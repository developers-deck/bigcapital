import { Item } from './models/Item';
import { CreateItemService } from './CreateItem.service';
import { DeleteItemService } from './DeleteItem.service';
import { EditItemService } from './EditItem.service';
import { IItem, IItemDTO } from '@/interfaces/Item';
import { Knex } from 'knex';
import { InactivateItem } from './InactivateItem.service';
import { ActivateItemService } from './ActivateItem.service';
import { GetItemService } from './GetItem.service';
import { ItemTransactionsService } from './ItemTransactions.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ItemsApplicationService {
  constructor(
    private readonly createItemService: CreateItemService,
    private readonly editItemService: EditItemService,
    private readonly deleteItemService: DeleteItemService,
    private readonly activateItemService: ActivateItemService,
    private readonly inactivateItemService: InactivateItem,
    private readonly getItemService: GetItemService,
    private readonly itemTransactionsService: ItemTransactionsService,
  ) {}

  /**
   * Creates a new item.
   * @param {IItemDTO} createItemDto - The item DTO.
   * @param {Knex.Transaction} [trx] - The transaction.
   * @return {Promise<number>} - The created item id.
   */
  async createItem(
    createItemDto: IItemDTO,
    trx?: Knex.Transaction,
  ): Promise<number> {
    return this.createItemService.createItem(createItemDto);
  }

  /**
   * Edits an existing item.
   * @param {number} itemId - The item id.
   * @param {IItemDTO} editItemDto - The item DTO.
   * @param {Knex.Transaction} [trx] - The transaction.
   * @return {Promise<number>} - The updated item id.
   */
  async editItem(
    itemId: number,
    editItemDto: IItemDTO,
    trx?: Knex.Transaction,
  ): Promise<number> {
    return this.editItemService.editItem(itemId, editItemDto, trx);
  }

  /**
   * Deletes an existing item.
   * @param {number} itemId - The item id.
   * @return {Promise<void>}
   */
  async deleteItem(itemId: number): Promise<void> {
    return this.deleteItemService.deleteItem(itemId);
  }

  /**
   * Activates an item.
   * @param {number} itemId - The item id.
   * @returns {Promise<void>}
   */
  async activateItem(itemId: number): Promise<void> {
    return this.activateItemService.activateItem(itemId);
  }

  /**
   * Inactivates an item.
   * @param {number} itemId - The item id.
   * @returns {Promise<void>}
   */
  async inactivateItem(itemId: number): Promise<void> {
    return this.inactivateItemService.inactivateItem(itemId);
  }

  /**
   * Retrieves the item details of the given id with associated details.
   * @param {number} itemId - The item id.
   * @returns {Promise<IItem>} - The item details.
   */
  async getItem(itemId: number): Promise<any> {
    return this.getItemService.getItem(itemId);
  }

  /**
   * Retrieves the item associated invoices transactions.
   * @param {number} itemId
   * @returns {Promise<any>}
   */
  async getItemInvoicesTransactions(itemId: number): Promise<any> {
    return this.itemTransactionsService.getItemInvoicesTransactions(itemId);
  }

  /**
   * Retrieves the item associated bills transactions.
   * @param {number} itemId
   * @returns {Promise<any>}
   */
  async getItemBillTransactions(itemId: number): Promise<any> {
    return this.itemTransactionsService.getItemBillTransactions(itemId);
  }

  /**
   * Retrieves the item associated estimates transactions.
   * @param {number} itemId
   * @returns {Promise<any>}
   */
  async getItemEstimatesTransactions(itemId: number): Promise<any> {
    return this.itemTransactionsService.getItemEstimateTransactions(itemId);
  }

  /**
   * Retrieves the item associated receipts transactions.
   * @param {number} itemId
   * @returns {Promise<any>}
   */
  async getItemReceiptsTransactions(itemId: number): Promise<any> {
    return this.itemTransactionsService.getItemReceiptTransactions(itemId);
  }
}