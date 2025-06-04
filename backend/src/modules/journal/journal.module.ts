import { Module } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { JournalService } from './journal.service';
import { JournalController } from './journal.controller';

@Module({
  controllers: [JournalController],
  providers: [JournalService, PrismaService],
  exports: [JournalService],
})
export class JournalModule {}
