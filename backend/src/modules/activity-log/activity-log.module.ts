import { Module } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { ActivityLogService } from './activity-log.service';
import { ActivityLogController } from './activity-log.controller';

@Module({
  controllers: [ActivityLogController],
  providers: [ActivityLogService, PrismaService],
  exports: [ActivityLogService],
})
export class ActivityLogModule {}
