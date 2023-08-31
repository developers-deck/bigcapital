import * as R from 'ramda';
import {
  SalesTaxLiabilitySummaryQuery,
  SalesTaxLiabilitySummaryRate,
  SalesTaxLiabilitySummaryReportData,
  SalesTaxLiabilitySummaryTotal,
} from '@/interfaces/SalesTaxLiabilitySummary';
import { tableRowMapper } from '@/utils';
import { ITableColumn, ITableColumnAccessor, ITableRow } from '@/interfaces';

enum IROW_TYPE {
  TaxRate = 'TaxRate',
  Total = 'Total',
}

export class SalesTaxLiabilitySummaryTable {
  data: SalesTaxLiabilitySummaryReportData;
  query: SalesTaxLiabilitySummaryQuery;

  /**
   * Sales tax liability summary table constructor.
   * @param {SalesTaxLiabilitySummaryReportData} data
   * @param {SalesTaxLiabilitySummaryQuery} query
   */
  constructor(
    data: SalesTaxLiabilitySummaryReportData,
    query: SalesTaxLiabilitySummaryQuery
  ) {
    this.data = data;
    this.query = query;
  }

  /**
   * Retrieve the tax rate row accessors.
   * @returns {ITableColumnAccessor[]}
   */
  private get taxRateRowAccessor() {
    return [
      { key: 'taxName', value: 'taxName' },
      { key: 'taxCode', accessor: 'taxCode' },
      { key: 'taxableAmount', accessor: 'taxableAmount.formattedAmount' },
      { key: 'taxAmount', accessor: 'taxAmount.formattedAmount' },
    ];
  }

  /**
   * Retrieve the tax rate total row accessors.
   * @returns {ITableColumnAccessor[]}
   */
  private get taxRateTotalRowAccessors() {
    return [
      { key: 'taxName', value: '' },
      { key: 'taxCode', accessor: 'taxCode' },
      { key: 'taxableAmount', accessor: 'taxableAmount.formattedAmount' },
      { key: 'taxAmount', accessor: 'taxAmount.formattedAmount' },
    ];
  }

  /**
   * Maps the tax rate node to table row.
   * @param {SalesTaxLiabilitySummaryRate} node
   * @returns {ITableRow}
   */
  private taxRateTableRowMapper = (
    node: SalesTaxLiabilitySummaryRate
  ): ITableRow => {
    const columns = this.taxRateRowAccessor;
    const meta = {
      rowTypes: [IROW_TYPE.TaxRate],
      id: node.id,
    };
    return tableRowMapper(node, columns, meta);
  };

  /**
   * Maps the tax rates nodes to table rows.
   * @param {SalesTaxLiabilitySummaryRate[]} nodes
   * @returns {ITableRow[]}
   */
  private taxRatesTableRowsMapper = (
    nodes: SalesTaxLiabilitySummaryRate[]
  ): ITableRow[] => {
    return nodes.map(this.taxRateTableRowMapper);
  };

  /**
   * Maps the tax rate total node to table row.
   * @param {SalesTaxLiabilitySummaryTotal} node
   * @returns {ITableRow}
   */
  private taxRateTotalRowMapper = (node: SalesTaxLiabilitySummaryTotal) => {
    const columns = this.taxRateTotalRowAccessors;
    const meta = {
      rowTypes: [IROW_TYPE.Total],
      id: node.key,
    };
    return tableRowMapper(node, columns, meta);
  };

  /**
   * Retrieves the tax rate total row.
   * @returns {ITableRow}
   */
  private get taxRateTotalRow(): ITableRow {
    return this.taxRateTotalRowMapper(this.data.total);
  }

  /**
   * Retrieves the tax rates rows.
   * @returns {ITableRow[]}
   */
  private get taxRatesRows(): ITableRow[] {
    return this.taxRatesTableRowsMapper(this.data.taxRates);
  }

  /**
   * Retrieve the table rows.
   * @returns {ITableRow[]}
   */
  public tableRows(): ITableRow[] {
    return R.compose(
      R.concat(this.taxRatesRows),
      R.prepend(this.taxRateTotalRow)
    )([]);
  }

  /**
   * Retrieve the table columns.
   * @returns {ITableColumn[]}
   */
  public tableColumns(): ITableColumn[] {
    return [
      {
        label: 'Tax Name',
        key: 'taxName',
      },
      {
        label: 'Tax Code',
        key: 'taxCode',
      },
      {
        label: 'Taxable Amount',
        key: 'taxableAmount',
      },
      {
        label: 'Tax Rate',
        key: 'taxRate',
      },
    ];
  }
}