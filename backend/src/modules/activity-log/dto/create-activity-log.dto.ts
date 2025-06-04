import { IsString, IsOptional } from 'class-validator';

export class CreateActivityLogDto {
  @IsString()
  itemId: string;

  @IsString()
  itemType: string; // 'todo' | 'shopping' | 'shoppingList'

  @IsString()
  action: string;

  @IsString()
  userId: string;

  @IsOptional()
  @IsString()
  details?: string;

  @IsOptional()
  timestamp?: number;
}
