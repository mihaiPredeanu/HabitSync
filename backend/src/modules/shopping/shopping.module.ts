import { Module } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { ShoppingService } from './shopping.service';
import { ShoppingController } from './shopping.controller';

@Module({
  controllers: [ShoppingController],
  providers: [ShoppingService, PrismaService],
  exports: [ShoppingService],
})
export class ShoppingModule {}
