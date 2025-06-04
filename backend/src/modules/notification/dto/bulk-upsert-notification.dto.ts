import { Type } from 'class-transformer';
import { ValidateNested, IsArray } from 'class-validator';
import { CreateNotificationDto } from './create-notification.dto';
import { UpdateNotificationDto } from './update-notification.dto';

export class BulkUpsertNotificationDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateNotificationDto)
  create: CreateNotificationDto[] = [];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateNotificationDto)
  update: (UpdateNotificationDto & { id: string })[] = [];

  @IsArray()
  @Type(() => String)
  delete: string[] = [];
}
