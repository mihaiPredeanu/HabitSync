import { IsOptional, IsString, IsBoolean } from 'class-validator';

export class UpdateNotificationDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  body?: string;

  @IsOptional()
  @IsString()
  data?: string;

  @IsOptional()
  @IsBoolean()
  read?: boolean;
}
