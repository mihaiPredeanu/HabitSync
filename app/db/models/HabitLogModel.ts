import { Model } from '@nozbe/watermelondb';
import { field } from '@nozbe/watermelondb/decorators';

export default class HabitLogModel extends Model {
  static table = 'habit_logs';

  @field('habit_id') habitId!: string;
  @field('date') date!: string;
  @field('value') value!: string; // store as string, can be 'true', 'false', or a number as string
  @field('note') note?: string;
  @field('time_of_day') timeOfDay?: string;
  @field('created_at') createdAt!: string;
}
