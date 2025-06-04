
import { Controller, Get, Post, Put, Delete, Param, Body, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { BulkUpsertShoppingListDto } from './dto/bulk-upsert-shopping-list.dto';
import { BulkUpsertShoppingItemDto } from './dto/bulk-upsert-shopping-item.dto';
import { ShoppingService } from './shopping.service';
import { CreateShoppingListDto } from './dto/create-shopping-list.dto';
import { UpdateShoppingListDto } from './dto/update-shopping-list.dto';
import { CreateShoppingItemDto } from './dto/create-shopping-item.dto';
import { UpdateShoppingItemDto } from './dto/update-shopping-item.dto';

@Controller('shopping')
export class ShoppingController {
  constructor(private readonly shoppingService: ShoppingService) {}

  // --- Shopping Lists ---
  @Get('lists')
  getShoppingLists(@Query('userId') userId: string) {
    return this.shoppingService.getShoppingLists(userId);
  }

  @Get('lists/:id')
  getShoppingListById(@Param('id') id: string) {
    return this.shoppingService.getShoppingListById(id);
  }


  @Post('lists')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  createShoppingList(@Body() body: CreateShoppingListDto) {
    return this.shoppingService.createShoppingList(body);
  }

  @Put('lists/:id')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  updateShoppingList(@Param('id') id: string, @Body() body: UpdateShoppingListDto) {
    return this.shoppingService.updateShoppingList(id, body);
  }

  @Delete('lists/:id')
  deleteShoppingList(@Param('id') id: string) {
    return this.shoppingService.deleteShoppingList(id);
  }

  /**
   * Bulk upsert endpoint for shopping lists
   */
  @Post('lists/bulk-upsert')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async bulkUpsertShoppingLists(@Body() dto: BulkUpsertShoppingListDto) {
    return this.shoppingService.bulkUpsertShoppingLists(dto);
  }

  // --- Shopping Items ---
  @Get('items')
  getShoppingItems(@Query('listId') listId: string) {
    return this.shoppingService.getShoppingItems(listId);
  }

  @Get('items/:id')
  getShoppingItemById(@Param('id') id: string) {
    return this.shoppingService.getShoppingItemById(id);
  }


  @Post('items')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  createShoppingItem(@Body() body: CreateShoppingItemDto) {
    return this.shoppingService.createShoppingItem(body);
  }

  @Put('items/:id')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  updateShoppingItem(@Param('id') id: string, @Body() body: UpdateShoppingItemDto) {
    return this.shoppingService.updateShoppingItem(id, body);
  }

  @Delete('items/:id')
  deleteShoppingItem(@Param('id') id: string) {
    return this.shoppingService.deleteShoppingItem(id);
  }

  /**
   * Bulk upsert endpoint for shopping items
   */
  @Post('items/bulk-upsert')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async bulkUpsertShoppingItems(@Body() dto: BulkUpsertShoppingItemDto) {
    return this.shoppingService.bulkUpsertShoppingItems(dto);
  }
}
