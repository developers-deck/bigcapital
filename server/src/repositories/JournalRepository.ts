import { ManualJournal } from 'models';
import TenantRepository from 'repositories/TenantRepository';

export default class JournalRepository extends TenantRepository {
  /**
   * Constructor method.
   */
  constructor(knex, cache) {
    super(knex, cache);
    this.model = ManualJournal;
  }
}