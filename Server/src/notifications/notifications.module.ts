import { Module } from '@nestjs/common';
import { BasicUserSchema } from 'src/basicusers/model/basic-user.schema';
import { SmmUserSchema } from 'src/smm/model/smm.schema';
import { SquealerUserSchema } from 'src/squealer_moderator/model/squealer-moderator.schema';
import { SquealsModule } from 'src/squeals/squeals.module';
import { forwardRef } from "@nestjs/common/utils";
import { ChannelModule } from 'src/channel/channel.module';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { NotificationSchema } from './notification.schema';
import { Notification } from './notification.model';
import { NotificationsResolver } from './notifications.resolver';
import { NotificationsService } from './notifications.service';
import { UsersModule } from 'src/users/users.module';
import { FriendsModule } from 'src/friends/friends.module';
import { SmmModule } from 'src/smm/smm.module';
import { BasicusersModule } from 'src/basicusers/basicusers.module';



@Module({
  imports: [
    MongooseModule.forFeature([{ name: Notification.name, schema: NotificationSchema }]),
    UsersModule,
    FriendsModule,
    ChannelModule,
    forwardRef( () => SmmModule),
    forwardRef( () => BasicusersModule),
  ],
  providers: [NotificationsResolver, NotificationsService],
  exports: [NotificationsService],
})
export class NotificationsModule {}

