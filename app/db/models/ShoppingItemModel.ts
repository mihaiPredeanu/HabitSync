import { Model } from '@nozbe/watermelondb';
import { field } from '@nozbe/watermelondb/decorators';

export default class ShoppingItemModel extends Model {
  static table = 'shopping_items';

  @field('name') name!: string;
  @field('checked') checked!: boolean;
  @field('list_id') listId!: string;
  @field('shared_with') sharedWith?: string;
  @field('created_at') createdAt!: string;
  @field('updated_at') updatedAt!: string;
}
