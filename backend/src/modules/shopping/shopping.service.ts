import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { BulkUpsertShoppingListDto } from './dto/bulk-upsert-shopping-list.dto';
import { BulkUpsertShoppingItemDto } from './dto/bulk-upsert-shopping-item.dto';

@Injectable()
export class ShoppingService {
  constructor(private prisma: PrismaService) {}

  // Shopping List CRUD
  async getShoppingLists(userId: string) {
    return this.prisma.shoppingList.findMany({
      where: { userId },
      include: { items: true },
    });
  }

  async getShoppingListById(id: string) {
    return this.prisma.shoppingList.findUnique({
      where: { id },
      include: { items: true },
    });
  }

  async createShoppingList(data: { name: string; userId: string; sharedWith?: string[] }) {
    return this.prisma.shoppingList.create({
      data: {
        name: data.name,
        userId: data.userId,
        sharedWith: data.sharedWith?.join(',') ?? null,
      },
    });
  }

  async updateShoppingList(id: string, data: { name?: string; sharedWith?: string[] }) {
    return this.prisma.shoppingList.update({
      where: { id },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.sharedWith && { sharedWith: data.sharedWith.join(',') }),
      },
    });
  }

  async deleteShoppingList(id: string) {
    return this.prisma.shoppingList.delete({ where: { id } });
  }

  // Shopping Item CRUD
  async getShoppingItems(listId: string) {
    return this.prisma.shoppingItem.findMany({ where: { listId } });
  }

  async getShoppingItemById(id: string) {
    return this.prisma.shoppingItem.findUnique({ where: { id } });
  }

  async createShoppingItem(data: { name: string; listId: string; sharedWith?: string[] }) {
    return this.prisma.shoppingItem.create({
      data: {
        name: data.name,
        listId: data.listId,
        sharedWith: data.sharedWith?.join(',') ?? null,
      },
    });
  }

  async updateShoppingItem(id: string, data: { name?: string; checked?: boolean; sharedWith?: string[] }) {
    return this.prisma.shoppingItem.update({
      where: { id },
      data: {
        ...(data.name && { name: data.name }),
        ...(typeof data.checked === 'boolean' ? { checked: data.checked } : {}),
        ...(data.sharedWith && { sharedWith: data.sharedWith.join(',') }),
      },
    });
  }

  async deleteShoppingItem(id: string) {
    return this.prisma.shoppingItem.delete({ where: { id } });
  }

  /**
   * Bulk upsert logic for shopping lists
   */
  async bulkUpsertShoppingLists(dto: BulkUpsertShoppingListDto) {
    const results: { created: any[]; updated: any[]; deleted: string[] } = { created: [], updated: [], deleted: [] };
    // Create
    for (const createData of dto.create || []) {
      const created = await this.prisma.shoppingList.upsert({
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
      const updated = await this.prisma.shoppingList.update({
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
        await this.prisma.shoppingList.delete({ where: { id } });
        results.deleted.push(id);
      } catch (e) {
        // Already deleted or not found
      }
    }
    return results;
  }

  /**
   * Bulk upsert logic for shopping items
   */
  async bulkUpsertShoppingItems(dto: BulkUpsertShoppingItemDto) {
    const results: { created: any[]; updated: any[]; deleted: string[] } = { created: [], updated: [], deleted: [] };
    // Create
    for (const createData of dto.create || []) {
      const created = await this.prisma.shoppingItem.upsert({
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
      const updated = await this.prisma.shoppingItem.update({
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
        await this.prisma.shoppingItem.delete({ where: { id } });
        results.deleted.push(id);
      } catch (e) {
        // Already deleted or not found
      }
    }
    return results;
  }


@Injectable()
export class ShoppingService {
  constructor(private prisma: PrismaService) {}

  // Shopping List CRUD
  async getShoppingLists(userId: string) {
    return this.prisma.shoppingList.findMany({
      where: { userId },
      include: { items: true },
    });
  }

  async getShoppingListById(id: string) {
    return this.prisma.shoppingList.findUnique({
      where: { id },
      include: { items: true },
    });
  }

  async createShoppingList(data: { name: string; userId: string; sharedWith?: string[] }) {
    return this.prisma.shoppingList.create({
      data: {
        name: data.name,
        userId: data.userId,
        sharedWith: data.sharedWith?.join(',') ?? null,
      },
    });
  }

  async updateShoppingList(id: string, data: { name?: string; sharedWith?: string[] }) {
    return this.prisma.shoppingList.update({
      where: { id },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.sharedWith && { sharedWith: data.sharedWith.join(',') }),
      },
    });
  }

  async deleteShoppingList(id: string) {
    return this.prisma.shoppingList.delete({ where: { id } });
  }

  // Shopping Item CRUD
  async getShoppingItems(listId: string) {
    return this.prisma.shoppingItem.findMany({ where: { listId } });
  }

  async getShoppingItemById(id: string) {
    return this.prisma.shoppingItem.findUnique({ where: { id } });
  }

  async createShoppingItem(data: { name: string; listId: string; sharedWith?: string[] }) {
    return this.prisma.shoppingItem.create({
      data: {
        name: data.name,
        listId: data.listId,
        sharedWith: data.sharedWith?.join(',') ?? null,
      },
    });
  }

  async updateShoppingItem(id: string, data: { name?: string; checked?: boolean; sharedWith?: string[] }) {
    return this.prisma.shoppingItem.update({
      where: { id },
      data: {
        ...(data.name && { name: data.name }),
        ...(typeof data.checked === 'boolean' ? { checked: data.checked } : {}),
        ...(data.sharedWith && { sharedWith: data.sharedWith.join(',') }),
      },
    });
  }

  async deleteShoppingItem(id: string) {
    return this.prisma.shoppingItem.delete({ where: { id } });
  }
}
