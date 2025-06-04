import { Model } from '@nozbe/watermelonDB';
import { field, date, readonly, writer } from '@nozbe/watermelonDB/decorators';

export default class ActivityLogModel extends Model {
  static table = 'activity_logs';

  @field('item_id') itemId!: string;
  @field('item_type') itemType!: 'todo' | 'shopping';
  @field('action') action!: string; // e.g., 'shared', 'unshared', 'edited', 'completed', 'comment'
  @field('user_id') userId!: string;
  @field('details') details?: string;
  @readonly @date('timestamp') timestamp!: number;

  @writer async updateDetails(newDetails: string) {
    await this.update(log => {
      log.details = newDetails;
    });
  }
}
