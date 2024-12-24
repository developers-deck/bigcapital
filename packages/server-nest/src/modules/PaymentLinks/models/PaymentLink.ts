import { Model } from 'objection';

export class PaymentLink extends Model {
  public tenantId!: number;
  public resourceId!: number;
  public resourceType!: string;
  public linkId!: string;
  public publicity!: string;
  public expiryAt!: Date;

  // Timestamps
  public createdAt!: Date;
  public updatedAt!: Date;

  /**
   * Table name.
   * @returns {string}
   */
  static get tableName() {
    return 'payment_links';
  }

  /**
   * Timestamps columns.
   * @returns {string[]}
   */
  static get timestamps() {
    return ['createdAt', 'updatedAt'];
  }
}
