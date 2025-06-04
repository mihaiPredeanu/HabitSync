import { Type } from 'class-transformer';
import { ValidateNested, IsArray } from 'class-validator';
import { CreateUserDto } from './create-user.dto';
import { UpdateUserDto } from './update-user.dto';

export class BulkUpsertUserDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateUserDto)
  create: CreateUserDto[] = [];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateUserDto)
  update: (UpdateUserDto & { id: string })[] = [];

  @IsArray()
  @Type(() => String)
  delete: string[] = [];
}
