import { Type } from 'class-transformer';
import { ValidateNested, IsArray } from 'class-validator';
import { CreateActivityLogDto } from './create-activity-log.dto';

export class BulkUpsertActivityLogDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateActivityLogDto)
  create: CreateActivityLogDto[] = [];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateActivityLogDto)
  update: (CreateActivityLogDto & { id: string })[] = [];

  @IsArray()
  @Type(() => String)
  delete: string[] = [];
}
