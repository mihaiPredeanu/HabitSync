import { Model } from '@nozbe/watermelondb';
import { field } from '@nozbe/watermelondb/decorators';

export default class CategoryModel extends Model {
  static table = 'categories';

  @field('name') name!: string;
  @field('color') color!: string;
  @field('icon') icon!: string;
  @field('is_default') isDefault?: boolean;
  @field('created_at') createdAt!: string;
  @field('updated_at') updatedAt!: string;
}
