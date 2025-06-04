import { IsString, IsOptional, IsBoolean, IsArray, IsIn } from 'class-validator';

export class CreateToDoDto {
  @IsString()
  title: string;

  @IsString()
  userId: string;

  @IsOptional()
  @IsBoolean()
  completed?: boolean;

  @IsOptional()
  @IsString()
  dueDate?: string;

  @IsOptional()
  @IsBoolean()
  recurring?: boolean;

  @IsOptional()
  @IsString()
  recurrenceRule?: string;

  @IsString()
  @IsIn(['none', 'low', 'medium', 'high', 'critical'])
  priority: string;

  @IsOptional()
  @IsString()
  timeOfDay?: string;

  @IsOptional()
  @IsString()
  categoryId?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  sharedWith?: string[];
}
