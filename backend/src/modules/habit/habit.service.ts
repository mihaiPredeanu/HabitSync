import { BulkUpsertHabitDto } from './dto/bulk-upsert-habit.dto';

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { CreateHabitDto } from './dto/create-habit.dto';
import { UpdateHabitDto } from './dto/update-habit.dto';

@Injectable()
export class HabitService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateHabitDto) {
    return this.prisma.habit.create({ data });
  }

  async findAll(userId?: string, categoryId?: string) {
    return this.prisma.habit.findMany({
      where: {
        ...(userId ? { userId } : {}),
        ...(categoryId ? { categoryId } : {}),
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const habit = await this.prisma.habit.findUnique({ where: { id } });
    if (!habit) throw new NotFoundException('Habit not found');
    return habit;
  }

  async update(id: string, data: UpdateHabitDto) {
    return this.prisma.habit.update({ where: { id }, data });
  }

  async remove(id: string) {
    return this.prisma.habit.delete({ where: { id } });
  }

  /**
   * Bulk upsert logic for robust two-way sync
   */
  async bulkUpsert(dto: BulkUpsertHabitDto) {
    const results: { created: any[]; updated: any[]; deleted: string[] } = { created: [], updated: [], deleted: [] };
    // Create
    for (const createData of dto.create || []) {
      const created = await this.prisma.habit.upsert({
        where: { id: (createData as any).id || '' },
        update: {},
        create: createData,
      });
      results.created.push(created);
    }
    // Update
    for (const updateData of dto.update || []) {
      if (!updateData.id) continue;
      const updated = await this.prisma.habit.update({
        where: { id: updateData.id },
        data: updateData,
      });
      results.updated.push(updated);
    }
    // Delete
    for (const id of dto.delete || []) {
      try {
        await this.prisma.habit.delete({ where: { id } });
        results.deleted.push(id);
      } catch (e) {
        // Already deleted or not found
      }
    }
    return results;
  }
}
