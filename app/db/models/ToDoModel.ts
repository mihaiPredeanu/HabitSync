import { Model } from '@nozbe/watermelondb';
import { field } from '@nozbe/watermelondb/decorators';

export default class ToDoModel extends Model {
  static table = 'todos';

  @field('title') title!: string;
  @field('completed') completed!: boolean;
  @field('due_date') dueDate?: string;
  @field('recurring') recurring?: boolean;
  @field('recurrence_rule') recurrenceRule?: string;
  @field('priority') priority!: string;
  @field('time_of_day') timeOfDay?: string;
  @field('category_id') categoryId?: string;
  @field('shared_with') sharedWith?: string;
  @field('created_at') createdAt!: string;
  @field('updated_at') updatedAt!: string;
}
