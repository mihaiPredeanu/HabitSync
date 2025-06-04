import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  name: string;

  @IsString()
  color: string;

  @IsString()
  icon: string;

  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
}
