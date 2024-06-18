import { Knex } from 'knex';
import UnitOfWork from '@/services/UnitOfWork';
import { Inject, Service } from 'typedi';
import { EventPublisher } from '@/lib/EventPublisher/EventPublisher';
import events from '@/subscribers/events';
import {
  IBankRuleEventDeletedPayload,
  IBankRuleEventDeletingPayload,
} from './types';
import HasTenancyService from '@/services/Tenancy/TenancyService';

@Service()
export class DeleteBankRuleSerivce {
  @Inject()
  private uow: UnitOfWork;

  @Inject()
  private eventPublisher: EventPublisher;

  @Inject()
  private tenancy: HasTenancyService;

  /**
   * Deletes the given bank rule.
   * @param {number} tenantId
   * @param {number} ruleId
   * @returns {Promise<void>}
   */
  public async deleteBankRule(tenantId: number, ruleId: number) {
    const { BankRule } = this.tenancy.models(tenantId);

    const oldBankRule = await BankRule.query()
      .findById(ruleId)
      .throwIfNotFound();

    return this.uow.withTransaction(tenantId, async (trx: Knex.Transaction) => {
      // Triggers `onBankRuleDeleting` event.
      await this.eventPublisher.emitAsync(events.bankRules.onDeleting, {
        oldBankRule,
        ruleId,
        trx,
      } as IBankRuleEventDeletingPayload);

      await BankRule.query(trx).findById(ruleId).delete();

      // Triggers `onBankRuleDeleted` event.
      await await this.eventPublisher.emitAsync(events.bankRules.onDeleted, {
        ruleId,
        trx,
      } as IBankRuleEventDeletedPayload);
    });
  }
}
