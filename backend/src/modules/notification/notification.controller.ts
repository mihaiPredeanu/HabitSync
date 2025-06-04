
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Patch,
  Delete,
  ParseUUIDPipe,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { BulkUpsertNotificationDto } from './dto/bulk-upsert-notification.dto';

@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async create(@Body() createDto: CreateNotificationDto) {
    return this.notificationService.create(createDto);
  }

  @Get()
  async findAll(@Query('userId') userId?: string) {
    return this.notificationService.findAll(userId);
  }

  @Get(':id')
  async findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.notificationService.findOne(id);
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateDto: UpdateNotificationDto,
  ) {
    return this.notificationService.update(id, updateDto);
  }

  @Delete(':id')
  async remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.notificationService.remove(id);
  }

  /**
   * Bulk upsert endpoint for robust two-way sync
   */
  @Post('bulk-upsert')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async bulkUpsert(@Body() dto: BulkUpsertNotificationDto) {
    return this.notificationService.bulkUpsert(dto);
  }
}
