import { Type } from 'class-transformer';
import { ValidateNested, IsArray } from 'class-validator';
import { CreateShoppingItemDto } from './create-shopping-item.dto';
import { UpdateShoppingItemDto } from './update-shopping-item.dto';

export class BulkUpsertShoppingItemDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateShoppingItemDto)
  create: CreateShoppingItemDto[] = [];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateShoppingItemDto)
  update: (UpdateShoppingItemDto & { id: string })[] = [];

  @IsArray()
  @Type(() => String)
  delete: string[] = [];
}
