import { IsString, IsOptional, IsArray, ArrayNotEmpty } from 'class-validator';

export class CreateShoppingListDto {
  @IsString()
  name: string;

  @IsString()
  userId: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  sharedWith?: string[];
}
