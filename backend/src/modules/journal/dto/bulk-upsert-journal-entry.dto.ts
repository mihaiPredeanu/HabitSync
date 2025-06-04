import { Type } from 'class-transformer';
import { ValidateNested, IsArray } from 'class-validator';
import { CreateJournalEntryDto } from './create-journal-entry.dto';
import { UpdateJournalEntryDto } from './update-journal-entry.dto';

export class BulkUpsertJournalEntryDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateJournalEntryDto)
  create: CreateJournalEntryDto[] = [];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateJournalEntryDto)
  update: (UpdateJournalEntryDto & { id: string })[] = [];

  @IsArray()
  @Type(() => String)
  delete: string[] = [];
}
