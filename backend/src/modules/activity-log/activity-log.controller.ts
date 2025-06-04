import { Controller, Get, Post, Query, Body, UsePipes, ValidationPipe } from '@nestjs/common';
import { ActivityLogService } from './activity-log.service';
import { CreateActivityLogDto } from './dto/create-activity-log.dto';
import { BulkUpsertActivityLogDto } from './dto/bulk-upsert-activity-log.dto';

@Controller('activity-logs')
export class ActivityLogController {
  constructor(private readonly activityLogService: ActivityLogService) {}

  @Get()
  getLogsForItem(@Query('itemId') itemId: string, @Query('itemType') itemType: string) {
    return this.activityLogService.getLogsForItem(itemId, itemType);
  }

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  createActivityLog(@Body() body: CreateActivityLogDto) {
    return this.activityLogService.createActivityLog(body);
  }

  /**
   * Bulk upsert endpoint for robust two-way sync
   */
  @Post('bulk-upsert')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async bulkUpsert(@Body() dto: BulkUpsertActivityLogDto) {
    return this.activityLogService.bulkUpsert(dto);
  }
}
