import { Module } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { ToDoService } from './todo.service';
import { ToDoController } from './todo.controller';

@Module({
  controllers: [ToDoController],
  providers: [ToDoService, PrismaService],
  exports: [ToDoService],
})
export class ToDoModule {}
