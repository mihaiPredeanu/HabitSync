import { IsString, IsOptional, IsBoolean, IsArray } from 'class-validator';

export class UpdateShoppingItemDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsBoolean()
  checked?: boolean;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  sharedWith?: string[];
}
