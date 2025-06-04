import { Type } from 'class-transformer';
import { ValidateNested, IsArray } from 'class-validator';
import { CreateShoppingListDto } from './create-shopping-list.dto';
import { UpdateShoppingListDto } from './update-shopping-list.dto';

export class BulkUpsertShoppingListDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateShoppingListDto)
  create: CreateShoppingListDto[] = [];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateShoppingListDto)
  update: (UpdateShoppingListDto & { id: string })[] = [];

  @IsArray()
  @Type(() => String)
  delete: string[] = [];
}
