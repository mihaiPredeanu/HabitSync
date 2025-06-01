import { Model } from '@nozbe/watermelondb';
import { field } from '@nozbe/watermelondb/decorators';

export default class ShoppingListModel extends Model {
  static table = 'shopping_lists';

  @field('name') name!: string;
  @field('created_at') createdAt!: string;
  @field('updated_at') updatedAt!: string;
}
