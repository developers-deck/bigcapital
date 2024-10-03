import TenantModel from 'models/TenantModel';

export class PdfTemplate extends TenantModel {
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
    return [];
  }

  /**
   * Relationship mapping.
   */
  static get relationMappings() {
    return {};
  }
}