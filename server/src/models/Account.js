/* eslint-disable global-require */
import { Model } from 'objection';
import { flatten, castArray } from 'lodash';
import TenantModel from 'models/TenantModel';
import {
  buildFilterQuery,
  buildSortColumnQuery,
} from 'lib/ViewRolesBuilder';
import { flatToNestedArray } from 'utils';
import DependencyGraph from 'lib/DependencyGraph';
import AccountTypesUtils from 'lib/AccountTypes'

export default class Account extends TenantModel {
  /**
   * Table name.
   */
  static get tableName() {
    return 'accounts';
  }

  /**
   * Timestamps columns.
   */
  get timestamps() {
    return ['createdAt', 'updatedAt'];
  }

  /**
   * Virtual attributes.
   */
  static get virtualAttributes() {
    return [
      'accountTypeLabel',
      'accountParentTypeLabel',
      'accountNormal',
      'isBalanceSheetAccount',
      'isPLSheet'
    ];
  }

  /**
   * Account normal.
   */
  get accountNormal() {
    return AccountTypesUtils.getType(this.accountType, 'normal');
  }

  /**
   * Retrieve account type label.
   */
  get accountTypeLabel() {
    return AccountTypesUtils.getType(this.accountType, 'label');
  }

  /**
   * Retrieve account parent type.
   */
  get accountParentType() {
    return AccountTypesUtils.getType(this.accountType, 'parentType');
  }

  /**
   * Retrieve whether the account is balance sheet account.
   */
  get isBalanceSheetAccount() {
    return this.isBalanceSheet();
  }

  /**
   * Retrieve whether the account is profit/loss sheet account.
   */
  get isPLSheet() {
    return this.isProfitLossSheet();
  }

  /**
   * Allows to mark model as resourceable to viewable and filterable.
   */
  static get resourceable() {
    return true;
  }

  /**
   * Model modifiers.
   */
  static get modifiers() {
    const TABLE_NAME = Account.tableName;

    return {
      filterAccounts(query, accountIds) {
        if (accountIds.length > 0) {
          query.whereIn(`${TABLE_NAME}.id`, accountIds);
        }
      },
      filterAccountTypes(query, typesIds) {
        if (typesIds.length > 0) {
          query.whereIn('account_types.accoun_type_id', typesIds);
        }
      },
      viewRolesBuilder(query, conditionals, expression) {
        buildFilterQuery(Account.tableName, conditionals, expression)(query);
      },
      sortColumnBuilder(query, columnKey, direction) {
        buildSortColumnQuery(Account.tableName, columnKey, direction)(query);
      },
    };
  }

  /**
   * Relationship mapping.
   */
  static get relationMappings() {
    const AccountTransaction = require('models/AccountTransaction');

    return {
      /**
       * Account model may has many transactions.
       */
      transactions: {
        relation: Model.HasManyRelation,
        modelClass: AccountTransaction.default,
        join: {
          from: 'accounts.id',
          to: 'accounts_transactions.accountId',
        },
      },
    };
  }
  
  /**
   * Detarmines whether the given type equals the account type.
   * @param {string} accountType 
   * @return {boolean}
   */
  isAccountType(accountType) {
    const types = castArray(accountType);
    return types.indexOf(this.accountType) !== -1;
  }

  /**
   * Detarmines whether the given root type equals the account type.
   * @param {string} rootType 
   * @return {boolean}
   */
  isRootType(rootType) {
    return AccountTypesUtils.isRootTypeEqualsKey(this.accountType, rootType);
  }

  /**
   * Detarmine whether the given parent type equals the account type.
   * @param {string} parentType 
   * @return {boolean}
   */
  isParentType(parentType) {
    return AccountTypesUtils.isParentTypeEqualsKey(this.accountType, parentType);
  }

  /**
   * Detarmines whether the account is balance sheet account.
   * @return {boolean}
   */
  isBalanceSheet() {
    return AccountTypesUtils.isTypeBalanceSheet(this.accountType);
  }

  /**
   * Detarmines whether the account is profit/loss account.
   * @return {boolean}
   */
  isProfitLossSheet() {
    return AccountTypesUtils.isTypePLSheet(this.accountType);
  }

  /**
   * Detarmines whether the account is income statement account
   * @return {boolean}
   */
  isIncomeSheet() {
    return this.isProfitLossSheet();
  }

  static collectJournalEntries(accounts) {
    return flatten(accounts.map((account) => account.transactions.map((transaction) => ({
      accountId: account.id,
      ...transaction,
      accountNormal: account.type.normal,
    }))));
  }

  /**
   * Converts flatten accounts list to nested array. 
   * @param {Array} accounts 
   * @param {Object} options 
   */
  static toNestedArray(accounts, options = { children: 'children' }) {
    return flatToNestedArray(accounts, { id: 'id', parentId: 'parentAccountId' })
  }

  static toDependencyGraph(accounts) {
    return DependencyGraph.fromArray(
      accounts, { itemId: 'id', parentItemId: 'parentAccountId' }
    );
  }

  /**
   * Model defined fields.
   */
  static get fields() {
    return {
      name: {
        label: 'Account name',
        column: 'name',
        columnType: 'string',
        
        fieldType: 'text',
      },
      type: {
        label: 'Account type',
        column: 'account_type_id',
        relation: 'account_types.id',
        relationColumn: 'account_types.key',

        fieldType: 'options',
        optionsResource: 'AccountType',
        optionsKey: 'key',
        optionsLabel: 'label',
      },
      description: {
        label: 'Description',
        column: 'description',
        columnType: 'string',

        fieldType: 'text',
      },
      code: {
        label: 'Account code',
        column: 'code',
        columnType: 'string',
        fieldType: 'text',
      },
      root_type: {
        label: 'Root type',
        column: 'account_type_id',
        relation: 'account_types.id',
        relationColumn: 'account_types.root_type',
        options: [
          { key: 'asset', label: 'Asset', },
          { key: 'liability', label: 'Liability' },
          { key: 'equity', label: 'Equity' },
          { key: 'Income', label: 'Income' },
          { key: 'expense', label: 'Expense' },
        ],
        fieldType: 'options',
      },
      created_at: {
        label: 'Created at',
        column: 'created_at',
        columnType: 'date',
        fieldType: 'date',
      },
      active: {
        label: 'Active',
        column: 'active', 
        columnType: 'boolean',
        fieldType: 'checkbox',
      },
      balance: {
        label: 'Balance',
        column: 'amount',
        columnType: 'number',
        fieldType: 'number',
      },
      currency: {
        label: 'Currency',
        column: 'currency_code',
        fieldType: 'options',
        optionsResource: 'currency',
        optionsKey: 'currency_code',
        optionsLabel: 'currency_name',
      },
      normal: {
        label: 'Account normal',
        column: 'account_type_id',
        fieldType: 'options',
        relation: 'account_types.id',
        relationColumn: 'account_types.normal',
        options: [
          { key: 'credit', label: 'Credit' },
          { key: 'debit', label: 'Debit' },
        ],
      },
    };
  }
}
