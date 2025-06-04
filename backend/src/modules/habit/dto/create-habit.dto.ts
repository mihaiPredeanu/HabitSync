import { IsString, IsOptional, IsBoolean, IsInt } from 'class-validator';

export class CreateHabitDto {
  @IsString()
  userId: string;

  @IsString()
  name: string;

  @IsString()
  color: string;

  @IsString()
  icon: string;

  @IsString()
  type: string;

  @IsString()
  frequencyType: string;

  @IsOptional()
  @IsInt()
  frequencyValue?: number;

  @IsOptional()
  @IsString()
  frequencyDaysOfWeek?: string;

  @IsString()
  priority: string;

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
