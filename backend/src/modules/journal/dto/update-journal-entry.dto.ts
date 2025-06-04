import { IsString, IsOptional } from 'class-validator';

export class UpdateJournalEntryDto {
  @IsOptional()
  @IsString()
  content?: string;
}
