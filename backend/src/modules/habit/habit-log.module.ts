import { Module } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { HabitLogService } from './habit-log.service';
import { HabitLogController } from './habit-log.controller';

@Module({
  controllers: [HabitLogController],
  providers: [HabitLogService, PrismaService],
  exports: [HabitLogService],
})
export class HabitLogModule {}
