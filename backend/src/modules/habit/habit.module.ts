import { Module } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { HabitService } from './habit.service';
import { HabitController } from './habit.controller';

@Module({
  controllers: [HabitController],
  providers: [HabitService, PrismaService],
  exports: [HabitService],
})
export class HabitModule {}
