import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { CreateHabitLogDto } from './dto/create-habit-log.dto';
import { UpdateHabitLogDto } from './dto/update-habit-log.dto';

@Injectable()
export class HabitLogService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateHabitLogDto) {
    return this.prisma.habitLog.create({ data });
  }

  async findAll(habitId?: string) {
    if (habitId) {
      return this.prisma.habitLog.findMany({ where: { habitId }, orderBy: { date: 'desc' } });
    }
    return this.prisma.habitLog.findMany({ orderBy: { date: 'desc' } });
  }

  async findOne(id: string) {
    const log = await this.prisma.habitLog.findUnique({ where: { id } });
    if (!log) throw new NotFoundException('Habit log not found');
    return log;
  }

  async update(id: string, data: UpdateHabitLogDto) {
    return this.prisma.habitLog.update({ where: { id }, data });
  }

  async remove(id: string) {
    return this.prisma.habitLog.delete({ where: { id } });
  }
}
