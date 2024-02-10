import { IJournalReportQuery } from '@/interfaces';
import { TableSheetPdf } from '../TableSheetPdf';
import { JournalSheetTableInjectable } from './JournalSheetTableInjectable';
import { Inject, Service } from 'typedi';

@Service()
export class JournalSheetPdfInjectable {
  @Inject()
  private journalSheetTable: JournalSheetTableInjectable;

  @Inject()
  private tableSheetPdf: TableSheetPdf;

  /**
   * Converts the given journal sheet table to pdf.
   * @param {number} tenantId - Tenant ID.
   * @param {IBalanceSheetQuery} query - Balance sheet query.
   * @returns {Promise<Buffer>}
   */
  public async pdf(
    tenantId: number,
    query: IJournalReportQuery
  ): Promise<Buffer> {
    const table = await this.journalSheetTable.table(tenantId, query);
    const sheetName = 'Journal Sheet';

    return this.tableSheetPdf.convertToPdf(
      tenantId,
      table.table,
      sheetName,
      table.meta.baseCurrency
    );
  }
}
