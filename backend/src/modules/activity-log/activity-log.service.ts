import { BulkUpsertActivityLogDto } from './dto/bulk-upsert-activity-log.dto';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';

@Injectable()
export class ActivityLogService {
  constructor(private prisma: PrismaService) {}

  async getLogsForItem(itemId: string, itemType: string) {
    return this.prisma.activityLog.findMany({
      where: { itemId, itemType },
      orderBy: { timestamp: 'desc' },
    });
  }

  async createActivityLog(data: any) {
    return this.prisma.activityLog.create({
      data: {
        ...data,
        timestamp: data.timestamp ? new Date(data.timestamp) : undefined,
      },
    });
  }
  /**
   * Bulk upsert logic for robust two-way sync
   */
  async bulkUpsert(dto: BulkUpsertActivityLogDto) {
    const results: { created: any[]; updated: any[]; deleted: string[] } = { created: [], updated: [], deleted: [] };
    // Create
    for (const createData of dto.create || []) {
      const created = await this.prisma.activityLog.upsert({
        where: { id: (createData as any).id || '' },
        update: {},
        create: {
          ...createData,
          timestamp: createData.timestamp ? new Date(createData.timestamp) : undefined,
        },
      });
      results.created.push(created);
    }
    // Update
    for (const updateData of dto.update || []) {
      if (!updateData.id) continue;
      const updated = await this.prisma.activityLog.update({
        where: { id: updateData.id },
        data: {
          ...updateData,
          timestamp: updateData.timestamp ? new Date(updateData.timestamp) : undefined,
        },
      });
      results.updated.push(updated);
    }
    // Delete
    for (const id of dto.delete || []) {
      try {
        await this.prisma.activityLog.delete({ where: { id } });
        results.deleted.push(id);
      } catch (e) {
        // Already deleted or not found
      }
    }
    return results;
  }
}
