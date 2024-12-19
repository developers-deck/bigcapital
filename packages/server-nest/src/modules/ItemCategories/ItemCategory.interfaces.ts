import { Knex } from 'knex';
// import { IDynamicListFilterDTO } from './DynamicFilter';
// import { ISystemUser } from './User';
import { ItemCategory } from './models/ItemCategory.model';


export interface IItemCategoryOTD {
  name: string;

  description?: string;
  userId: number;

  costAccountId?: number;
  sellAccountId?: number;
  inventoryAccountId?: number;

  costMethod?: string;
}

// export interface IItemCategoriesFilter extends IDynamicListFilterDTO {
//   stringifiedFilterRoles?: string;
// }

export interface IItemCategoryCreatedPayload {
  itemCategory: ItemCategory;
  trx: Knex.Transaction;
}

export interface IItemCategoryEditedPayload {
  oldItemCategory: ItemCategory;
  trx: Knex.Transaction;
}

export interface IItemCategoryDeletedPayload {
  itemCategoryId: number;
  oldItemCategory: ItemCategory;
}
