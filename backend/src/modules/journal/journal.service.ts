import { BulkUpsertJournalEntryDto } from './dto/bulk-upsert-journal-entry.dto';

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { CreateJournalEntryDto } from './dto/create-journal-entry.dto';
import { UpdateJournalEntryDto } from './dto/update-journal-entry.dto';

@Injectable()
export class JournalService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateJournalEntryDto) {
    return this.prisma.journalEntry.create({ data });
  }

  async findAll(userId?: string) {
    if (userId) {
      return this.prisma.journalEntry.findMany({ where: { userId }, orderBy: { date: 'desc' } });
    }
    return this.prisma.journalEntry.findMany({ orderBy: { date: 'desc' } });
  }

  async findOne(id: string) {
    const entry = await this.prisma.journalEntry.findUnique({ where: { id } });
    if (!entry) throw new NotFoundException('Journal entry not found');
    return entry;
  }

  async update(id: string, data: UpdateJournalEntryDto) {
    return this.prisma.journalEntry.update({ where: { id }, data });
  }

  async remove(id: string) {
    return this.prisma.journalEntry.delete({ where: { id } });
  }

  /**
   * Bulk upsert logic for robust two-way sync
   */
  async bulkUpsert(dto: BulkUpsertJournalEntryDto) {
    const results: { created: any[]; updated: any[]; deleted: string[] } = { created: [], updated: [], deleted: [] };
    // Create
    for (const createData of dto.create || []) {
      const created = await this.prisma.journalEntry.upsert({
        where: { id: (createData as any).id || '' },
        update: {},
        create: createData,
      });
      results.created.push(created);
    }
    // Update
    for (const updateData of dto.update || []) {
      if (!updateData.id) continue;
      const updated = await this.prisma.journalEntry.update({
        where: { id: updateData.id },
        data: updateData,
      });
      results.updated.push(updated);
    }
    // Delete
    for (const id of dto.delete || []) {
      try {
        await this.prisma.journalEntry.delete({ where: { id } });
        results.deleted.push(id);
      } catch (e) {
        // Already deleted or not found
      }
    }
    return results;
  }
}
