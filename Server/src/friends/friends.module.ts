import { Module } from '@nestjs/common';
import { FriendsResolver } from './friends.resolver';
import { FriendsService } from './friends.service';
import { UsersModule } from 'src/users/users.module';
import { NotificationsModule } from 'src/notifications/notifications.module';

@Module({
  imports: [
    UsersModule
  ],
  providers: [FriendsResolver, FriendsService],
  exports: [FriendsService],
})
export class FriendsModule {}

