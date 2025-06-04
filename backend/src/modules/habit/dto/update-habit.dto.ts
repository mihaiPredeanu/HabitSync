import { IsString, IsOptional, IsBoolean, IsInt } from 'class-validator';

export class UpdateHabitDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  color?: string;

  @IsOptional()
  @IsString()
  icon?: string;

  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsString()
  frequencyType?: string;

  @IsOptional()
  @IsInt()
  frequencyValue?: number;

  @IsOptional()
  @IsString()
  frequencyDaysOfWeek?: string;

  @IsOptional()
  @IsString()
  priority?: string;

  @IsOptional()
  @IsBoolean()
  archived?: boolean;

  @IsOptional()
  @IsString()
  sharedWith?: string;

  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;

  @IsOptional()
  @IsString()
  categoryId?: string;
}
