import { Inject, Service } from 'typedi';
import { ISalesByItemsReportQuery } from '@/interfaces';
import { SalesByItemsTableInjectable } from './SalesByItemsTableInjectable';
import { TableSheetPdf } from '../TableSheetPdf';

@Service()
export class SalesByItemsPdfInjectable {
  @Inject()
  private salesByItemsTable: SalesByItemsTableInjectable;

  @Inject()
  private tableSheetPdf: TableSheetPdf;

  /**
   * Retrieves the sales by items sheet in pdf format.
   * @param {number} tenantId
   * @param {number} query
   * @returns {Promise<IBalanceSheetTable>}
   */
  public async pdf(
    tenantId: number,
    query: ISalesByItemsReportQuery
  ): Promise<Buffer> {
    const table = await this.salesByItemsTable.table(tenantId, query);
    const sheetName = 'Sales By Items';

    return this.tableSheetPdf.convertToPdf(
      tenantId,
      table.table,
      sheetName,
      table.meta.baseCurrency
    );
  }
}
