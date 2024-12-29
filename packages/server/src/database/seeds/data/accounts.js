export const OtherExpensesAccount = {
  name: 'Other Expenses',
  slug: 'other-expenses',
  account_type: 'other-expense',
  code: '40011',
  description: '',
  active: 1,
  index: 1,
  predefined: 1,
};

export const TaxPayableAccount = {
  name: 'Tax Payable',
  slug: 'tax-payable',
  account_type: 'tax-payable',
  code: '20006',
  description: '',
  active: 1,
  index: 1,
  predefined: 1,
};

export const UnearnedRevenueAccount = {
  name: 'Unearned Revenue',
  slug: 'unearned-revenue',
  account_type: 'other-current-liability',
  parent_account_id: null,
  code: '50005',
  active: true,
  index: 1,
  predefined: true,
};

export const PrepardExpenses = {
  name: 'Prepaid Expenses',
  slug: 'prepaid-expenses',
  account_type: 'other-current-asset',
  parent_account_id: null,
  code: '100010',
  active: true,
  index: 1,
  predefined: true,
};

export const StripeClearingAccount = {
  name: 'Stripe Clearing',
  slug: 'stripe-clearing',
  account_type: 'other-current-asset',
  parent_account_id: null,
  code: '100020',
  active: true,
  index: 1,
  predefined: true,
};

export const DiscountExpenseAccount = {
  name: 'Discount',
  slug: 'discount',
  account_type: 'other-income',
  code: '40008',
  active: true,
  index: 1,
  predefined: true,
};

export const PurchaseDiscountAccount = {
  name: 'Purchase Discount',
  slug: 'purchase-discount',
  account_type: 'other-expense',
  code: '40009',
  active: true,
  index: 1,
  predefined: true,
};

export const OtherChargesAccount = {
  name: 'Other Charges',
  slug: 'other-charges',
  account_type: 'other-income',
  code: '40010',
  active: true,
  index: 1,
  predefined: true,
};

export default [
  {
    name: 'Bank Account',
    slug: 'bank-account',
    account_type: 'bank',
    code: '10001',
    description: '',
    active: 1,
    index: 1,
    predefined: 1,
  },
  {
    name: 'Saving Bank Account',
    slug: 'saving-bank-account',
    account_type: 'bank',
    code: '10002',
    description: '',
    active: 1,
    index: 1,
    predefined: 0,
  },
  {
    name: 'Undeposited Funds',
    slug: 'undeposited-funds',
    account_type: 'cash',
    code: '10003',
    description: '',
    active: 1,
    index: 1,
    predefined: 1,
  },
  {
    name: 'Petty Cash',
    slug: 'petty-cash',
    account_type: 'cash',
    code: '10004',
    description: '',
    active: 1,
    index: 1,
    predefined: 1,
  },
  {
    name: 'Computer Equipment',
    slug: 'computer-equipment',
    code: '10005',
    account_type: 'fixed-asset',
    predefined: 0,
    parent_account_id: null,
    index: 1,
    active: 1,
    description: '',
  },
  {
    name: 'Office Equipment',
    slug: 'office-equipment',
    code: '10006',
    account_type: 'fixed-asset',
    predefined: 0,
    parent_account_id: null,
    index: 1,
    active: 1,
    description: '',
  },
  {
    name: 'Accounts Receivable (A/R)',
    slug: 'accounts-receivable',
    account_type: 'accounts-receivable',
    code: '10007',
    description: '',
    active: 1,
    index: 1,
    predefined: 1,
  },
  {
    name: 'Inventory Asset',
    slug: 'inventory-asset',
    code: '10008',
    account_type: 'inventory',
    predefined: 1,
    parent_account_id: null,
    index: 1,
    active: 1,
    description:
      'An account that holds valuation of products or goods that available for sale.',
  },

  // Libilities
  {
    name: 'Accounts Payable (A/P)',
    slug: 'accounts-payable',
    account_type: 'accounts-payable',
    parent_account_id: null,
    code: '20001',
    description: '',
    active: 1,
    index: 1,
    predefined: 1,
  },
  {
    name: 'Owner A Drawings',
    slug: 'owner-drawings',
    account_type: 'other-current-liability',
    parent_account_id: null,
    code: '20002',
    description: 'Withdrawals by the owners.',
    active: 1,
    index: 1,
    predefined: 0,
  },
  {
    name: 'Loan',
    slug: 'owner-drawings',
    account_type: 'other-current-liability',
    code: '20003',
    description: 'Money that has been borrowed from a creditor.',
    active: 1,
    index: 1,
    predefined: 0,
  },
  {
    name: 'Opening Balance Liabilities',
    slug: 'opening-balance-liabilities',
    account_type: 'other-current-liability',
    code: '20004',
    description:
      'This account will hold the difference in the debits and credits entered during the opening balance..',
    active: 1,
    index: 1,
    predefined: 0,
  },
  {
    name: 'Revenue Received in Advance',
    slug: 'revenue-received-in-advance',
    account_type: 'other-current-liability',
    parent_account_id: null,
    code: '20005',
    description: 'When customers pay in advance for products/services.',
    active: 1,
    index: 1,
    predefined: 0,
  },
  TaxPayableAccount,

  // Equity
  {
    name: 'Retained Earnings',
    slug: 'retained-earnings',
    account_type: 'equity',
    code: '30001',
    description:
      'Retained earnings tracks net income from previous fiscal years.',
    active: 1,
    index: 1,
    predefined: 1,
  },
  {
    name: 'Opening Balance Equity',
    slug: 'opening-balance-equity',
    account_type: 'equity',
    code: '30002',
    description:
      'When you enter opening balances to the accounts, the amounts enter in Opening balance equity. This ensures that you have a correct trial balance sheet for your company, without even specific the second credit or debit entry.',
    active: 1,
    index: 1,
    predefined: 1,
  },
  {
    name: "Owner's Equity",
    slug: 'owner-equity',
    account_type: 'equity',
    code: '30003',
    description: '',
    active: 1,
    index: 1,
    predefined: 1,
  },
  {
    name: `Drawings`,
    slug: 'drawings',
    account_type: 'equity',
    code: '30003',
    description:
      'Goods purchased with the intention of selling these to customers',
    active: 1,
    index: 1,
    predefined: 1,
  },

  // Expenses
  OtherExpensesAccount,
  {
    name: 'Cost of Goods Sold',
    slug: 'cost-of-goods-sold',
    account_type: 'cost-of-goods-sold',
    parent_account_id: null,
    code: '40002',
    description: 'Tracks the direct cost of the goods sold.',
    active: 1,
    index: 1,
    predefined: 1,
  },
  {
    name: 'Office expenses',
    slug: 'office-expenses',
    account_type: 'expense',
    parent_account_id: null,
    code: '40003',
    description: '',
    active: 1,
    index: 1,
    predefined: 0,
  },
  {
    name: 'Rent',
    slug: 'rent',
    account_type: 'expense',
    parent_account_id: null,
    code: '40004',
    description: '',
    active: 1,
    index: 1,
    predefined: 0,
  },
  {
    name: 'Exchange Gain or Loss',
    slug: 'exchange-grain-loss',
    account_type: 'other-expense',
    parent_account_id: null,
    code: '40005',
    description: 'Tracks the gain and losses of the exchange differences.',
    active: 1,
    index: 1,
    predefined: 1,
  },
  {
    name: 'Bank Fees and Charges',
    slug: 'bank-fees-and-charges',
    account_type: 'expense',
    parent_account_id: null,
    code: '40006',
    description:
      'Any bank fees levied is recorded into the bank fees and charges account. A bank account maintenance fee, transaction charges, a late payment fee are some examples.',
    active: 1,
    index: 1,
    predefined: 0,
  },
  {
    name: 'Depreciation Expense',
    slug: 'depreciation-expense',
    account_type: 'expense',
    parent_account_id: null,
    code: '40007',
    description: '',
    active: 1,
    index: 1,
    predefined: 0,
  },

  // Income
  {
    name: 'Sales of Product Income',
    slug: 'sales-of-product-income',
    account_type: 'income',
    predefined: 1,
    parent_account_id: null,
    code: '50001',
    index: 1,
    active: 1,
    description: '',
  },
  {
    name: 'Sales of Service Income',
    slug: 'sales-of-service-income',
    account_type: 'income',
    predefined: 0,
    parent_account_id: null,
    code: '50002',
    index: 1,
    active: 1,
    description: '',
  },
  {
    name: 'Uncategorized Income',
    slug: 'uncategorized-income',
    account_type: 'income',
    parent_account_id: null,
    code: '50003',
    description: '',
    active: 1,
    index: 1,
    predefined: 1,
  },
  {
    name: 'Other Income',
    slug: 'other-income',
    account_type: 'other-income',
    parent_account_id: null,
    code: '50004',
    description:
      'The income activities are not associated to the core business.',
    active: 1,
    index: 1,
    predefined: 0,
  },
  UnearnedRevenueAccount,
  PrepardExpenses,
  DiscountExpenseAccount,
  PurchaseDiscountAccount,
  OtherChargesAccount,
];
