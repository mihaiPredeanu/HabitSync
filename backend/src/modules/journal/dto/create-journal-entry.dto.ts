import { IsString } from 'class-validator';

export class CreateJournalEntryDto {
  @IsString()
  userId: string;

  @IsString()
  date: string; // YYYY-MM-DD

  @IsString()
  content: string;
}
