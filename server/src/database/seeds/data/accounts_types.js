

export default [
  {
    key: 'cash',
    normal: 'debit',
    child_type: 'current_asset',
    root_type: 'asset',
    balance_sheet: true,
    income_sheet: false,
  },
  {
    key: 'bank',
    normal: 'debit',
    child_type: 'current_asset',
    root_type: 'asset',
    balance_sheet: true,
    income_sheet: false,
  },
  {
    key: 'accounts_receivable',
    normal: 'debit',
    root_type: 'asset',
    child_type: 'current_asset',
    balance_sheet: true,
    income_sheet: false,
  },
  {
    key: 'inventory',
    normal: 'debit',
    root_type: 'asset',
    child_type: 'current_asset',
    balance_sheet: true,
    income_sheet: false,
  },
  {
    key: 'other_current_asset',
    normal: 'debit',
    root_type: 'asset',
    child_type: 'current_asset',
    balance_sheet: true,
    income_sheet: false,
  },
  {
    key: 'fixed_asset',
    normal: 'debit',
    root_type: 'asset',
    child_type: 'fixed_asset',
    balance_sheet: true,
    income_sheet: false,
  },
  {
    key: 'non_current_asset',
    normal: 'debit',
    root_type: 'asset',
    child_type: 'fixed_asset',
    balance_sheet: true,
    income_sheet: false,
  },
  {
    key: 'accounts_payable',
    normal: 'credit',
    root_type: 'liability',
    child_type: 'current_liability',
    balance_sheet: true,
    income_sheet: false,
  },
  {
    key: 'credit_card',
    normal: 'credit',
    root_type: 'liability',
    child_type: 'current_liability',
    balance_sheet: true,
    income_sheet: false,
  },
  {
    key: 'tax_payable',
    normal: 'credit',
    root_type: 'liability',
    child_type: 'current_liability',
    balance_sheet: true,
    income_sheet: false,
  },
  {
    key: 'other_current_liability',
    normal: 'credit',
    root_type: 'liability',
    child_type: 'current_liability',
    balance_sheet: false,
    income_sheet: true,
  },
  {
    key: 'non_current_liability',
    normal: 'credit',
    root_type: 'liability',
    child_type: 'current_liability',
    balance_sheet: false,
    income_sheet: true,
  },
  {
    key: 'long_term_liability',
    normal: 'credit',
    root_type: 'liability',
    child_type: 'long_term_liability',
    balance_sheet: false,
    income_sheet: true,
  },
  
];