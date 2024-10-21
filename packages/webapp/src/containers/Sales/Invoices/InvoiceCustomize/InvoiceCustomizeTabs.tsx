import { css } from '@emotion/css';
import { Tabs, TabsProps } from '@blueprintjs/core';

interface InvoiceCustomizeTabsProps extends TabsProps { }

export function InvoiceCustomizeTabs(props: InvoiceCustomizeTabsProps) {
  return (
    <Tabs
      className={css`
        .bp4-tab-list {
          padding: 0 20px;
          background: #fff;
          border-bottom: 1px solid #dcdcdd;
        }
        .bp4-tab {
          line-height: 40px;
        }
        .bp4-tab:not([aria-selected='true']) {
          color: #5f6b7c;
        }
        .bp4-tab-indicator-wrapper .bp4-tab-indicator {
          height: 2px;
        }
      `}
      {...props}
    />
  );
}