import { Model } from '@nozbe/watermelondb';
import { field } from '@nozbe/watermelondb/decorators';

export default class JournalEntryModel extends Model {
  static table = 'journal_entries';

  @field('date') date!: string;
  @field('content') content!: string;
  @field('created_at') createdAt!: string;
  @field('updated_at') updatedAt!: string;
}
