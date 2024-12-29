import { Inject, Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import {
  ICreditNoteRefundDTO,
  IRefundCreditNoteCreatedPayload,
  IRefundCreditNoteCreatingPayload,
} from '../types/CreditNotes.types';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Account } from '@/modules/Accounts/models/Account.model';
import { UnitOfWork } from '@/modules/Tenancy/TenancyDB/UnitOfWork.service';
import { RefundCreditNote } from '../models/RefundCreditNote';
import { events } from '@/common/events/events';
import { CommandCreditNoteDTOTransform } from './CommandCreditNoteDTOTransform.service';
import { CreditNote } from '../models/CreditNote';

@Injectable()
export class CreateRefundCreditNoteService {
  /**
   * @param {UnitOfWork} uow - The unit of work service.
   * @param {EventEmitter2} eventPublisher - The event emitter service.
   * @param {CommandCreditNoteDTOTransform} commandCreditNoteDTOTransform - The command credit note DTO transform service.
   * @param {typeof RefundCreditNote} refundCreditNoteModel - The refund credit note model.
   * @param {typeof Account} accountModel - The account model.
   * @param {typeof CreditNote} creditNoteModel - The credit note model.
   */
  constructor(
    private uow: UnitOfWork,
    private eventPublisher: EventEmitter2,
    private commandCreditNoteDTOTransform: CommandCreditNoteDTOTransform,

    @Inject(RefundCreditNote.name)
    private refundCreditNoteModel: typeof RefundCreditNote,

    @Inject(Account.name) private accountModel: typeof Account,
    @Inject(CreditNote.name) private creditNoteModel: typeof CreditNote,
  ) {}

  /**
   * Retrieve the credit note graph.
   * @param {number} creditNoteId
   * @param {ICreditNoteRefundDTO} newCreditNoteDTO
   * @returns {Promise<IRefundCreditNote>}
   */
  public async createCreditNoteRefund(
    creditNoteId: number,
    newCreditNoteDTO: ICreditNoteRefundDTO,
  ): Promise<RefundCreditNote> {
    // Retrieve the credit note or throw not found service error.
    const creditNote = await this.creditNoteModel
      .query()
      .findById(creditNoteId)
      .throwIfNotFound();

    // Retrieve the withdrawal account or throw not found service error.
    const fromAccount = await this.accountModel
      .query()
      .findById(newCreditNoteDTO.fromAccountId)
      .throwIfNotFound();

    // Validate the credit note remaining amount.
    this.commandCreditNoteDTOTransform?.validateCreditRemainingAmount(
      creditNote,
      newCreditNoteDTO.amount,
    );
    // Validate the refund withdrawal account type.
    this.commandCreditNoteDTOTransform.validateRefundWithdrawwalAccountType(
      fromAccount,
    );
    // Creates a refund credit note transaction.
    return this.uow.withTransaction(async (trx: Knex.Transaction) => {
      // Triggers `onCreditNoteRefundCreating` event.
      await this.eventPublisher.emitAsync(events.creditNote.onRefundCreating, {
        trx,
        creditNote,
        newCreditNoteDTO,
      } as IRefundCreditNoteCreatingPayload);

      // Stores the refund credit note graph to the storage layer.
      const refundCreditNote = await this.refundCreditNoteModel
        .query(trx)
        .insertAndFetch({
          ...this.transformDTOToModel(creditNote, newCreditNoteDTO),
        });

      // Triggers `onCreditNoteRefundCreated` event.
      await this.eventPublisher.emitAsync(events.creditNote.onRefundCreated, {
        trx,
        refundCreditNote,
        creditNote,
      } as IRefundCreditNoteCreatedPayload);

      return refundCreditNote;
    });
  }

  /**
   * Transformes the refund credit note DTO to model.
   * @param {number} creditNoteId
   * @param {ICreditNoteRefundDTO} creditNoteDTO
   * @returns {ICreditNote}
   */
  private transformDTOToModel = (
    creditNote: CreditNote,
    creditNoteDTO: ICreditNoteRefundDTO,
  ): RefundCreditNote => {
    return {
      creditNoteId: creditNote.id,
      currencyCode: creditNote.currencyCode,
      ...creditNoteDTO,
      exchangeRate: creditNoteDTO.exchangeRate || 1,
    };
  };
}
