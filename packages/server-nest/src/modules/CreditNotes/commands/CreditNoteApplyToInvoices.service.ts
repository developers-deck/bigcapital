import { Inject, Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { sumBy } from 'lodash';
import {
  ICreditNoteAppliedToInvoice,
  ICreditNoteAppliedToInvoiceModel,
  IApplyCreditToInvoicesDTO,
  IApplyCreditToInvoicesCreatedPayload,
  ICreditNote,
} from '../types/CreditNotes.types';
import { ERRORS } from '../constants';
import { PaymentReceivedValidators } from '@/modules/PaymentReceived/commands/PaymentReceivedValidators.service';
import { UnitOfWork } from '@/modules/Tenancy/TenancyDB/UnitOfWork.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CreditNoteAppliedInvoice } from '../models/CreditNoteAppliedInvoice';
import { events } from '@/common/events/events';
import { SaleInvoice } from '@/modules/SaleInvoices/models/SaleInvoice';
import { ServiceError } from '@/modules/Items/ServiceError';

@Injectable()
export class CreditNoteApplyToInvoices {
  /**
   * @param {PaymentReceivedValidators} paymentReceiveValidators - The payment received validators service.
   * @param {UnitOfWork} uow - The unit of work service.
   * @param {EventEmitter2} eventPublisher - The event emitter service.
   * @param {typeof CreditNoteAppliedInvoice} creditNoteAppliedInvoiceModel - The credit note applied invoice model.
   */
  constructor(
    private readonly paymentReceiveValidators: PaymentReceivedValidators,
    private readonly uow: UnitOfWork,
    private readonly eventPublisher: EventEmitter2,

    @Inject(CreditNoteAppliedInvoice.name)
    private readonly creditNoteAppliedInvoiceModel: typeof CreditNoteAppliedInvoice,
  ) {}

  /**
   * Apply credit note to the given invoices.
   * @param {number} creditNoteId
   * @param {IApplyCreditToInvoicesDTO} applyCreditToInvoicesDTO
   */
  public async applyCreditNoteToInvoices(
    creditNoteId: number,
    applyCreditToInvoicesDTO: IApplyCreditToInvoicesDTO,
  ): Promise<ICreditNoteAppliedToInvoice[]> {
    // Saves the credit note or throw not found service error.
    const creditNote = await this.getCreditNoteOrThrowError(creditNoteId);

    // Retrieve the applied invoices that associated to the credit note customer.
    const appliedInvoicesEntries =
      await this.paymentReceiveValidators.validateInvoicesIDsExistance(
        creditNote.customerId,
        applyCreditToInvoicesDTO.entries,
      );

    // Transformes apply DTO to model.
    const creditNoteAppliedModel = this.transformApplyDTOToModel(
      applyCreditToInvoicesDTO,
      creditNote,
    );

    // Validate invoices has remaining amount to apply.
    this.validateInvoicesRemainingAmount(
      appliedInvoicesEntries,
      creditNoteAppliedModel.amount,
    );
    // Validate the credit note remaining amount.
    this.validateCreditRemainingAmount(
      creditNote,
      creditNoteAppliedModel.amount,
    );

    // Creates credit note apply to invoice transaction.
    return this.uow.withTransaction(async (trx: Knex.Transaction) => {
      // Saves the credit note apply to invoice graph to the storage layer.
      const creditNoteAppliedInvoices = await this.creditNoteAppliedInvoiceModel
        .query()
        .insertGraph(creditNoteAppliedModel.entries);

      // Triggers `onCreditNoteApplyToInvoiceCreated` event.
      await this.eventPublisher.emitAsync(
        events.creditNote.onApplyToInvoicesCreated,
        {
          creditNote,
          creditNoteAppliedInvoices,
          trx,
        } as IApplyCreditToInvoicesCreatedPayload,
      );

      return creditNoteAppliedInvoices;
    });
  }

  /**
   * Transformes apply DTO to model.
   * @param {IApplyCreditToInvoicesDTO} applyDTO
   * @param {ICreditNote} creditNote
   * @returns
   */
  private transformApplyDTOToModel = (
    applyDTO: IApplyCreditToInvoicesDTO,
    creditNote: ICreditNote,
  ): ICreditNoteAppliedToInvoiceModel => {
    const entries = applyDTO.entries.map((entry) => ({
      invoiceId: entry.invoiceId,
      amount: entry.amount,
      creditNoteId: creditNote.id,
    }));
    return {
      amount: sumBy(entries, 'amount'),
      entries,
    };
  };

  /**
   * Validate the invoice remaining amount.
   * @param {ISaleInvoice[]} invoices
   * @param {number} amount
   */
  private validateInvoicesRemainingAmount = (
    invoices: SaleInvoice[],
    amount: number,
  ) => {
    const invalidInvoices = invoices.filter(
      (invoice) => invoice.dueAmount < amount,
    );
    if (invalidInvoices.length > 0) {
      throw new ServiceError(ERRORS.INVOICES_HAS_NO_REMAINING_AMOUNT);
    }
  };
}
