import { Inject, Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import {
  IBranchCreatedPayload,
  IBranchCreatePayload,
  ICreateBranchDTO,
} from '../Branches.types';
import { UnitOfWork } from '../../Tenancy/TenancyDB/UnitOfWork.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Branch } from '../models/Branch.model';
import { events } from '@/common/events/events';

@Injectable()
export class CreateBranchService {
  /**
   * @param {UnitOfWork} uow - Unit of Work for tenant database transactions.
   * @param {EventEmitter2} eventPublisher - Event emitter for publishing branch creation events.
   * @param {typeof Branch} branchModel - The Branch model class for database operations.
   */
  constructor(
    private readonly uow: UnitOfWork,
    private readonly eventPublisher: EventEmitter2,

    @Inject(Branch.name)
    private readonly branchModel: typeof Branch,
  ) {}

  /**
   * Creates a new branch.
   * @param {ICreateBranchDTO} createBranchDTO
   * @returns {Promise<IBranch>}
   */
  public createBranch = async (
    createBranchDTO: ICreateBranchDTO,
  ): Promise<Branch> => {
    // Creates a new branch under unit-of-work.
    return this.uow.withTransaction(async (trx: Knex.Transaction) => {
      // Triggers `onBranchCreate` event.
      await this.eventPublisher.emitAsync(events.warehouse.onEdit, {
        createBranchDTO,
        trx,
      } as IBranchCreatePayload);

      const branch = await this.branchModel.query().insertAndFetch({
        ...createBranchDTO,
      });

      // Triggers `onBranchCreated` event.
      await this.eventPublisher.emitAsync(events.warehouse.onEdited, {
        createBranchDTO,
        branch,
        trx,
      } as IBranchCreatedPayload);

      return branch;
    });
  };
}
