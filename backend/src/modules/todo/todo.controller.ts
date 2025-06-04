import { Controller, Get, Post, Put, Delete, Param, Body, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { BulkUpsertToDoDto } from './dto/bulk-upsert-todo.dto';
import { ToDoService } from './todo.service';
import { CreateToDoDto } from './dto/create-todo.dto';
import { UpdateToDoDto } from './dto/update-todo.dto';

@Controller('todos')
export class ToDoController {
  constructor(private readonly todoService: ToDoService) {}

  @Get()
  getToDos(@Query('userId') userId: string) {
    return this.todoService.getToDos(userId);
  }

  @Get(':id')
  getToDoById(@Param('id') id: string) {
    return this.todoService.getToDoById(id);
  }

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  createToDo(@Body() body: CreateToDoDto) {
    return this.todoService.createToDo(body);
  }

  @Put(':id')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  updateToDo(@Param('id') id: string, @Body() body: UpdateToDoDto) {
    return this.todoService.updateToDo(id, body);
  }

  @Delete(':id')
  deleteToDo(@Param('id') id: string) {
    return this.todoService.deleteToDo(id);
  }

  /**
   * Bulk upsert endpoint for robust two-way sync
   */
  @Post('bulk-upsert')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async bulkUpsert(@Body() dto: BulkUpsertToDoDto) {
    return this.todoService.bulkUpsert(dto);
  }
}
