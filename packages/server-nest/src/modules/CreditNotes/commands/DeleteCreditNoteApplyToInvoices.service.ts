import { Inject, Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { IApplyCreditToInvoicesDeletedPayload } from '../types/CreditNotes.types';
import { CreditNoteAppliedInvoice } from '../models/CreditNoteAppliedInvoice';
import { UnitOfWork } from '@/modules/Tenancy/TenancyDB/UnitOfWork.service';
import { events } from '@/common/events/events';
import { ServiceError } from '@/modules/Items/ServiceError';
import { CreditNote } from '../models/CreditNote';
import { ERRORS } from '../constants';

@Injectable()
export default class DeleteCreditNoteApplyToInvoices {
  constructor(
    private readonly uow: UnitOfWork,
    private readonly eventPublisher: EventEmitter2,
    private readonly creditNoteAppliedInvoiceModel: typeof CreditNoteAppliedInvoice,

    @Inject(CreditNote.name)
    private readonly creditNoteModel: typeof CreditNote,
  ) {}

  /**
   * Apply credit note to the given invoices.
   * @param {number} creditNoteId
   * @param {IApplyCreditToInvoicesDTO} applyCreditToInvoicesDTO
   */
  public deleteApplyCreditNoteToInvoices = async (
    applyCreditToInvoicesId: number,
  ): Promise<void> => {
    const creditNoteAppliedToInvoice = await this.creditNoteAppliedInvoiceModel
      .query()
      .findById(applyCreditToInvoicesId);

    if (!creditNoteAppliedToInvoice) {
      throw new ServiceError(ERRORS.CREDIT_NOTE_APPLY_TO_INVOICES_NOT_FOUND);
    }
    // Retrieve the credit note or throw not found service error.
    const creditNote = await this.creditNoteModel
      .query()
      .findById(creditNoteAppliedToInvoice.creditNoteId)
      .throwIfNotFound();

    // Creates credit note apply to invoice transaction.
    return this.uow.withTransaction(async (trx: Knex.Transaction) => {
      // Delete credit note applied to invoices.
      await this.creditNoteAppliedInvoiceModel
        .query(trx)
        .findById(applyCreditToInvoicesId)
        .delete();

      // Triggers `onCreditNoteApplyToInvoiceDeleted` event.
      await this.eventPublisher.emitAsync(
        events.creditNote.onApplyToInvoicesDeleted,
        {
          creditNote,
          creditNoteAppliedToInvoice,
          trx,
        } as IApplyCreditToInvoicesDeletedPayload,
      );
    });
  };
}
