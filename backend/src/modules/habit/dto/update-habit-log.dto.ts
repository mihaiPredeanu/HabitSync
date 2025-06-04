import { IsString, IsOptional } from 'class-validator';

export class UpdateHabitLogDto {
  @IsOptional()
  @IsString()
  value?: string;

  @IsOptional()
  @IsString()
  note?: string;

  @IsOptional()
  @IsString()
  timeOfDay?: string;
}
