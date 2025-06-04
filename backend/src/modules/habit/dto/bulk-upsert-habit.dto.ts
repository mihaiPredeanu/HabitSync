import { Type } from 'class-transformer';
import { ValidateNested, IsArray } from 'class-validator';
import { CreateHabitDto } from './create-habit.dto';
import { UpdateHabitDto } from './update-habit.dto';

export class BulkUpsertHabitDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateHabitDto)
  create: CreateHabitDto[] = [];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateHabitDto)
  update: (UpdateHabitDto & { id: string })[] = [];

  @IsArray()
  @Type(() => String)
  delete: string[] = [];
}
