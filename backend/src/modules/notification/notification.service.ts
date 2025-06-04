import { BulkUpsertNotificationDto } from './dto/bulk-upsert-notification.dto';

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';

@Injectable()
export class NotificationService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateNotificationDto) {
    return this.prisma.notification.create({ data });
  }

  async findAll(userId?: string) {
    if (userId) {
      return this.prisma.notification.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } });
    }
    return this.prisma.notification.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async findOne(id: string) {
    const notification = await this.prisma.notification.findUnique({ where: { id } });
    if (!notification) throw new NotFoundException('Notification not found');
    return notification;
  }

  async update(id: string, data: UpdateNotificationDto) {
    return this.prisma.notification.update({ where: { id }, data });
  }

  async remove(id: string) {
    return this.prisma.notification.delete({ where: { id } });
  }

  /**
   * Bulk upsert logic for robust two-way sync
   */
  async bulkUpsert(dto: BulkUpsertNotificationDto) {
    const results: { created: any[]; updated: any[]; deleted: string[] } = { created: [], updated: [], deleted: [] };
    // Create
    for (const createData of dto.create || []) {
      const created = await this.prisma.notification.upsert({
        where: { id: (createData as any).id || '' },
        update: {},
        create: createData,
      });
      results.created.push(created);
    }
    // Update
    for (const updateData of dto.update || []) {
      if (!updateData.id) continue;
      const updated = await this.prisma.notification.update({
        where: { id: updateData.id },
        data: updateData,
      });
      results.updated.push(updated);
    }
    // Delete
    for (const id of dto.delete || []) {
      try {
        await this.prisma.notification.delete({ where: { id } });
        results.deleted.push(id);
      } catch (e) {
        // Already deleted or not found
      }
    }
    return results;
  }
}
