import { BulkUpsertToDoDto } from './dto/bulk-upsert-todo.dto';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';

@Injectable()
export class ToDoService {
  constructor(private prisma: PrismaService) {}

  // ToDo CRUD
  async getToDos(userId: string) {
    return this.prisma.toDo.findMany({
      where: { userId },
    });
  }

  async getToDoById(id: string) {
    return this.prisma.toDo.findUnique({
      where: { id },
    });
  }

  async createToDo(data: any) {
    return this.prisma.toDo.create({
      data: {
        ...data,
        sharedWith: data.sharedWith?.join(',') ?? null,
      },
    });
  }

  async updateToDo(id: string, data: any) {
    return this.prisma.toDo.update({
      where: { id },
      data: {
        ...data,
        ...(data.sharedWith && { sharedWith: data.sharedWith.join(',') }),
      },
    });
  }

  async deleteToDo(id: string) {
    return this.prisma.toDo.delete({ where: { id } });
  }

  /**
   * Bulk upsert logic for robust two-way sync
   */
  async bulkUpsert(dto: BulkUpsertToDoDto) {
    const results: { created: any[]; updated: any[]; deleted: string[] } = { created: [], updated: [], deleted: [] };
    // Create
    for (const createData of dto.create || []) {
      const created = await this.prisma.toDo.upsert({
        where: { id: (createData as any).id || '' },
        update: {},
        create: {
          ...createData,
          sharedWith: createData.sharedWith?.join(',') ?? null,
        },
      });
      results.created.push(created);
    }
    // Update
    for (const updateData of dto.update || []) {
      if (!updateData.id) continue;
      const updated = await this.prisma.toDo.update({
        where: { id: updateData.id },
        data: {
          ...updateData,
          ...(updateData.sharedWith && { sharedWith: updateData.sharedWith.join(',') }),
        },
      });
      results.updated.push(updated);
    }
    // Delete
    for (const id of dto.delete || []) {
      try {
        await this.prisma.toDo.delete({ where: { id } });
        results.deleted.push(id);
      } catch (e) {
        // Already deleted or not found
      }
    }
    return results;
  }
}
