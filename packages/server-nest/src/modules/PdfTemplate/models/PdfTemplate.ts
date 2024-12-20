// import { getUploadedObjectUri } from '@/services/Attachments/utils';
import { BaseModel } from '@/models/Model';
// import TenantModel from 'models/TenantModel';

export class PdfTemplateModel extends BaseModel {
  public resource!: string;
  public templateName!: string;
  public predefined!: boolean;
  public default!: boolean;
  public attributes!: Record<string, any>;

  /**
   * Table name.
   */
  static get tableName() {
    return 'pdf_templates';
  }

  /**
   * Timestamps columns.
   */
  get timestamps() {
    return ['createdAt', 'updatedAt'];
  }

  /**
   * Json schema.
   */
  static get jsonSchema() {
    return {
      type: 'object',
      properties: {
        id: { type: 'integer' },
        templateName: { type: 'string' },
        attributes: { type: 'object' }, // JSON field definition
      },
    };
  }

  /**
   * Model modifiers.
   */
  static get modifiers() {
    return {
      /**
       * Filters the due invoices.
       */
      default(query) {
        query.where('default', true);
      },
    };
  }

  /**
   * Virtual attributes.
   */
  static get virtualAttributes() {
    return ['companyLogoUri'];
  }

  /**
   * Retrieves the company logo uri.
   * @returns {string}
   */
  // get companyLogoUri() {
  //   return this.attributes?.companyLogoKey
  //     ? getUploadedObjectUri(this.attributes.companyLogoKey)
  //     : '';
  // }

  /**
   * Relationship mapping.
   */
  static get relationMappings() {
    return {};
  }
}
