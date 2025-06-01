import { Model } from '@nozbe/watermelondb';
import { field, date, readonly, writer } from '@nozbe/watermelondb/decorators';

export default class HabitModel extends Model {
  static table = 'habits';

  @field('name') name!: string;
  @field('color') color!: string;
  @field('icon') icon!: string;
  @field('type') type!: string;
  @field('frequency_type') frequencyType!: string;
  @field('frequency_value') frequencyValue?: number;
  @field('frequency_days_of_week') frequencyDaysOfWeek?: string;
  @field('priority') priority!: string;
  @field('category_id') categoryId?: string;
  @field('archived') archived?: boolean;
  @field('shared_with') sharedWith?: string;
  @field('is_default') isDefault?: boolean;
  @field('created_at') createdAt!: string;
  @field('updated_at') updatedAt!: string;

  // Add any custom actions or computed properties here
}
