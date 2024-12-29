import { Knex } from 'knex';
import { Injectable } from '@nestjs/common';
import {
  ICreditNoteCreatedPayload,
  ICreditNoteCreatingPayload,
  ICreditNoteNewDTO,
} from '../types/CreditNotes.types';
import { CreditNote } from '../models/CreditNote';
import { Contact } from '../../Contacts/models/Contact';
import { CommandCreditNoteDTOTransform } from './CommandCreditNoteDTOTransform.service';
import { UnitOfWork } from '@/modules/Tenancy/TenancyDB/UnitOfWork.service';
import { ItemsEntriesService } from '@/modules/Items/ItemsEntries.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { events } from '@/common/events/events';

@Injectable()
export class CreateCreditNoteService {
  constructor(
    private readonly uow: UnitOfWork,
    private readonly itemsEntriesService: ItemsEntriesService,
    private readonly eventPublisher: EventEmitter2,
    private readonly creditNoteModel: typeof CreditNote,
    private readonly contactModel: typeof Contact,
    private readonly commandCreditNoteDTOTransform: CommandCreditNoteDTOTransform,
  ) {}

  /**
   * Creates a new credit note.
   * @param creditNoteDTO
   */
  public creditCreditNote = async (
    creditNoteDTO: ICreditNoteNewDTO,
    trx?: Knex.Transaction,
  ) => {
    // Triggers `onCreditNoteCreate` event.
    await this.eventPublisher.emitAsync(events.creditNote.onCreate, {
      creditNoteDTO,
    });
    // Validate customer existance.
    const customer = await this.contactModel
      .query()
      .modify('customer')
      .findById(creditNoteDTO.customerId)
      .throwIfNotFound();

    // Validate items ids existance.
    await this.itemsEntriesService.validateItemsIdsExistance(
      creditNoteDTO.entries,
    );
    // Validate items should be sellable items.
    await this.itemsEntriesService.validateNonSellableEntriesItems(
      creditNoteDTO.entries,
    );
    // Transformes the given DTO to storage layer data.
    const creditNoteModel =
      await this.commandCreditNoteDTOTransform.transformCreateEditDTOToModel(
        creditNoteDTO,
        customer.currencyCode,
      );
    // Creates a new credit card transactions under unit-of-work envirement.
    return this.uow.withTransaction(async (trx: Knex.Transaction) => {
      // Triggers `onCreditNoteCreating` event.
      await this.eventPublisher.emitAsync(events.creditNote.onCreating, {
        creditNoteDTO,
        trx,
      } as ICreditNoteCreatingPayload);

      // Upsert the credit note graph.
      const creditNote = await this.creditNoteModel.query(trx).upsertGraph({
        ...creditNoteModel,
      });
      // Triggers `onCreditNoteCreated` event.
      await this.eventPublisher.emitAsync(events.creditNote.onCreated, {
        creditNoteDTO,
        creditNote,
        creditNoteId: creditNote.id,
        trx,
      } as ICreditNoteCreatedPayload);

      return creditNote;
    }, trx);
  };
}
