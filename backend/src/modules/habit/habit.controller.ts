
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
import { HabitService } from './habit.service';
import { CreateHabitDto } from './dto/create-habit.dto';
import { UpdateHabitDto } from './dto/update-habit.dto';
import { BulkUpsertHabitDto } from './dto/bulk-upsert-habit.dto';

@Controller('habits')
export class HabitController {
  constructor(private readonly habitService: HabitService) {}

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async create(@Body() createDto: CreateHabitDto) {
    return this.habitService.create(createDto);
  }

  @Get()
  async findAll(@Query('userId') userId?: string, @Query('categoryId') categoryId?: string) {
    return this.habitService.findAll(userId, categoryId);
  }

  @Get(':id')
  async findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.habitService.findOne(id);
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateDto: UpdateHabitDto,
  ) {
    return this.habitService.update(id, updateDto);
  }

  @Delete(':id')
  async remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.habitService.remove(id);
  }

  /**
   * Bulk upsert endpoint for robust two-way sync
   * Accepts arrays of create, update, and delete actions
   */
  @Post('bulk-upsert')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async bulkUpsert(@Body() dto: BulkUpsertHabitDto) {
    return this.habitService.bulkUpsert(dto);
  }
}
