import { Module } from '@nestjs/common';
import { BasicUserSchema } from 'src/basicusers/model/basic-user.schema';
import { SmmUserSchema } from 'src/smm/model/smm.schema';
import { SquealerUserSchema } from 'src/squealer_moderator/model/squealer-moderator.schema';
import { SquealsModule } from 'src/squeals/squeals.module';
import { forwardRef } from "@nestjs/common/utils";
import { ChannelModule } from 'src/channel/channel.module';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from 'src/users/users.module';
import { FriendsModule } from 'src/friends/friends.module';
import { SmmModule } from 'src/smm/smm.module';
import { BasicusersModule } from 'src/basicusers/basicusers.module';
import { Message } from './dto/message.model';
import { MessageSchema } from './dto/message.schema';
import { MessagesService } from './messages.service';
import { MessagesResolver } from './messages.resolver';



@Module({
  imports: [
    MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }]),
    forwardRef( () => UsersModule),
  ],
  providers: [MessagesService, MessagesResolver],
  exports: [MessagesService],
})
export class MessagesModule {}

