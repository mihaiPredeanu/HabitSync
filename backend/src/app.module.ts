import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { UserModule } from './modules/user/user.module';
import { ToDoModule } from './modules/todo/todo.module';
import { ShoppingModule } from './modules/shopping/shopping.module';
import { NotificationModule } from './modules/notification/notification.module';
import { JournalModule } from './modules/journal/journal.module';
import { CategoryModule } from './modules/category/category.module';
import { ActivityLogModule } from './modules/activity-log/activity-log.module';

@Module({
  imports: [
    UserModule,
    ToDoModule,
    ShoppingModule,
    NotificationModule,
    JournalModule,
    CategoryModule,
    ActivityLogModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
