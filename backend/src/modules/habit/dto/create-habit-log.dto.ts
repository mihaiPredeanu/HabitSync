import { IsString, IsOptional } from 'class-validator';

export class CreateHabitLogDto {
  @IsString()
  habitId: string;

  @IsString()
  date: string; // YYYY-MM-DD

  @IsString()
  value: string; // 'true', 'false', or number as string

  @IsOptional()
  @IsString()
  note?: string;

  @IsOptional()
  @IsString()
  timeOfDay?: string;
}
