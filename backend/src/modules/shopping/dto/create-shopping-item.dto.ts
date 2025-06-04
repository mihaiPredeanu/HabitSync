import { IsString, IsOptional, IsArray } from 'class-validator';

export class CreateShoppingItemDto {
  @IsString()
  name: string;

  @IsString()
  listId: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  sharedWith?: string[];
}
