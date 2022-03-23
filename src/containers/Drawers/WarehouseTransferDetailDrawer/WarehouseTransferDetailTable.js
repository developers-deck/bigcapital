import React from 'react';

import { CommercialDocEntriesTable } from 'components';
import { TableStyle } from '../../../common';
import { useWarehouseTransferReadOnlyEntriesColumns } from './utils';
import { useWarehouseDetailDrawerContext } from './WarehouseTransferDetailDrawerProvider';

/**
 * Warehouse transfer detail table.
 * @returns {React.JSX}
 */
export default function WarehouseTransferDetailTable() {
  // Warehouse transfer entries table columns.
  const columns = useWarehouseTransferReadOnlyEntriesColumns();

  const {
    warehouseTransfer: { entries },
  } = useWarehouseDetailDrawerContext();

  return (
    <CommercialDocEntriesTable
      columns={columns}
      data={entries}
      styleName={TableStyle.Constrant}
    />
  );
}
