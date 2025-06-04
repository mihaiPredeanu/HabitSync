import { Type } from 'class-transformer';
import { ValidateNested, IsArray } from 'class-validator';
import { CreateToDoDto } from './create-todo.dto';
import { UpdateToDoDto } from './update-todo.dto';

export class BulkUpsertToDoDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateToDoDto)
  create: CreateToDoDto[] = [];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateToDoDto)
  update: (UpdateToDoDto & { id: string })[] = [];

  @IsArray()
  @Type(() => String)
  delete: string[] = [];
}
