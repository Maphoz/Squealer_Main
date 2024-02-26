import { Module} from '@nestjs/common';
import { BasicusersResolver } from './basicusers.resolver';
import { BasicusersService } from './basicusers.service';
import { MongooseModule } from '@nestjs/mongoose';
import {BasicUserSchema } from './model/basic-user.schema';
import { UsersModule } from 'src/users/users.module';
import { ScheduleModule } from '@nestjs/schedule';
import { forwardRef } from "@nestjs/common/utils";
import { SquealsModule } from 'src/squeals/squeals.module';
import { MessagesModule } from 'src/messages/messages.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'BasicUser', schema: BasicUserSchema}]),
    UsersModule,
    ScheduleModule.forRoot(),
    forwardRef( () => MessagesModule)
  ],
  providers: [BasicusersResolver, BasicusersService],
  exports: [BasicusersService]
})
export class BasicusersModule {}
