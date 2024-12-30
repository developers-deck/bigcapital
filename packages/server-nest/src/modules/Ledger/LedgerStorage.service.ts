import { Knex } from 'knex';
import { ILedger } from './types/Ledger.types';
import { LedgerContactsBalanceStorage } from './LedgerContactStorage.service';
import { LedegrAccountsStorage } from './LedgetAccountStorage.service';
import { LedgerEntriesStorageService } from './LedgerEntriesStorage.service';
import { Ledger } from './Ledger';
import { Injectable } from '@nestjs/common';

@Injectable()
export class LedgerStorageService {
  constructor(
    private ledgerContactsBalance: LedgerContactsBalanceStorage,
    private ledgerAccountsBalance: LedegrAccountsStorage,
    private ledgerEntriesService: LedgerEntriesStorageService,
  ) {}

  /**
   * Commit the ledger to the storage layer as one unit-of-work.
   * @param {ILedger} ledger
   * @returns {Promise<void>}
   */
  public commit = async (
    ledger: ILedger,
    trx?: Knex.Transaction,
  ): Promise<void> => {
    const tasks = [
      // Saves the ledger entries.
      this.ledgerEntriesService.saveEntries(ledger, trx),

      // Mutates the associated accounts balances.
      this.ledgerAccountsBalance.saveAccountsBalance(ledger, trx),

      // Mutates the associated contacts balances.
      this.ledgerContactsBalance.saveContactsBalance(ledger, trx),
    ];
    await Promise.all(tasks);
  };

  /**
   * Deletes the given ledger and revert balances.
   * @param {number} tenantId
   * @param {ILedger} ledger
   * @param {Knex.Transaction} trx
   * @returns {Promise<void>}
   */
  public delete = async (
    ledger: ILedger,
    trx?: Knex.Transaction,
  ) => {
    const tasks = [
      // Deletes the ledger entries.
      this.ledgerEntriesService.deleteEntries(ledger, trx),

      // Mutates the associated accounts balances.
      this.ledgerAccountsBalance.saveAccountsBalance(ledger, trx),

      // Mutates the associated contacts balances.
      this.ledgerContactsBalance.saveContactsBalance(ledger, trx),
    ];
    await Promise.all(tasks);
  };

  /**
   * @param {number | number[]} referenceId
   * @param {string | string[]} referenceType
   * @param {Knex.Transaction} trx
   */
  public deleteByReference = async (
    referenceId: number | number[],
    referenceType: string | string[],
    trx?: Knex.Transaction,
  ) => {
    // Retrieves the transactions of the given reference.
    const transactions =
      await transactionsRepository.getTransactionsByReference(
        referenceId,
        referenceType,
      );
    // Creates a new ledger from transaction and reverse the entries.
    const reversedLedger = Ledger.fromTransactions(transactions).reverse();

    // Deletes and reverts the balances.
    await this.delete(tenantId, reversedLedger, trx);
  };
}
