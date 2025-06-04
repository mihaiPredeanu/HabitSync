import { BulkUpsertUserDto } from './dto/bulk-upsert-user.dto';

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RegisterPushTokenDto } from './dto/register-push-token.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateUserDto) {
    // Hash password in real app
    return this.prisma.user.create({
      data: {
        email: data.email,
        passwordHash: data.password, // Replace with hash in production
        displayName: data.displayName,
        avatarUrl: data.avatarUrl,
      },
    });
  }

  async findAll() {
    return this.prisma.user.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async update(id: string, data: UpdateUserDto) {
    return this.prisma.user.update({ where: { id }, data });
  }

  async remove(id: string) {
    return this.prisma.user.delete({ where: { id } });
  }

  async registerPushToken({ userId, pushToken }: RegisterPushTokenDto) {
    return this.prisma.user.update({ where: { id: userId }, data: { pushToken } });
  }
  /**
   * Bulk upsert logic for robust two-way sync
   */
  async bulkUpsert(dto: BulkUpsertUserDto) {
    const results: { created: any[]; updated: any[]; deleted: string[] } = { created: [], updated: [], deleted: [] };
    // Create
    for (const createData of dto.create || []) {
      const created = await this.prisma.user.upsert({
        where: { id: (createData as any).id || '' },
        update: {},
        create: {
          ...createData,
          passwordHash: (createData as any).password || '', // Replace with hash in production
        },
      });
      results.created.push(created);
    }
    // Update
    for (const updateData of dto.update || []) {
      if (!updateData.id) continue;
      const updated = await this.prisma.user.update({
        where: { id: updateData.id },
        data: updateData,
      });
      results.updated.push(updated);
    }
    // Delete
    for (const id of dto.delete || []) {
      try {
        await this.prisma.user.delete({ where: { id } });
        results.deleted.push(id);
      } catch (e) {
        // Already deleted or not found
      }
    }
    return results;
  }
}
