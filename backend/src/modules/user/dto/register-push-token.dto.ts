import { IsString } from 'class-validator';

export class RegisterPushTokenDto {
  @IsString()
  userId: string;

  @IsString()
  pushToken: string;
}
