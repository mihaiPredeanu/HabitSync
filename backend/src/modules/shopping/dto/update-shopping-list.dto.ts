import { IsString, IsOptional, IsArray } from 'class-validator';

export class UpdateShoppingListDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  sharedWith?: string[];
}
