import { Body, Controller, Delete, Param, Post, Put } from '@nestjs/common';
import { CreditNoteApplication } from './CreditNoteApplication.service';
import {
  ICreditNoteEditDTO,
  ICreditNoteNewDTO,
} from './types/CreditNotes.types';
import { PublicRoute } from '../Auth/Jwt.guard';

@Controller('credit-notes')
@PublicRoute()
export class CreditNotesController {
  /**
   * @param {CreditNoteApplication} creditNoteApplication - The credit note application service.
   */
  constructor(private creditNoteApplication: CreditNoteApplication) {}

  @Post()
  createCreditNote(@Body() creditNoteDTO: ICreditNoteNewDTO) {
    return this.creditNoteApplication.createCreditNote(creditNoteDTO);
  }

  @Put(':id')
  editCreditNote(
    @Param('id') creditNoteId: number,
    @Body() creditNoteDTO: ICreditNoteEditDTO,
  ) {
    return this.creditNoteApplication.editCreditNote(
      creditNoteId,
      creditNoteDTO,
    );
  }

  @Put(':id/open')
  openCreditNote(@Param('id') creditNoteId: number) {
    return this.creditNoteApplication.openCreditNote(creditNoteId);
  }

  @Delete(':id')
  deleteCreditNote(@Param('id') creditNoteId: number) {
    return this.creditNoteApplication.deleteCreditNote(creditNoteId);
  }
}
