import { Model } from '@nozbe/watermelondb';
import { field } from '@nozbe/watermelondb/decorators';

export default class NotificationModel extends Model {
  static table = 'notifications';

  @field('user_id') userId!: string;
  @field('type') type!: string;
  @field('title') title!: string;
  @field('body') body!: string;
  @field('data') data?: string;
  @field('read') read!: boolean;
  @field('created_at') createdAt!: string;
}
