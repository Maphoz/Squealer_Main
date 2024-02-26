import { Module } from '@nestjs/common';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './models/user.schema';
import { User } from './models/user.model';
import { BasicUserSchema } from 'src/basicusers/model/basic-user.schema';
import { SmmUserSchema } from 'src/smm/model/smm.schema';
import { SquealerUserSchema } from 'src/squealer_moderator/model/squealer-moderator.schema';
import { forwardRef } from "@nestjs/common/utils";
import { ChannelModule } from 'src/channel/channel.module';
import { JwtModule } from '@nestjs/jwt';
import { ScheduleModule } from '@nestjs/schedule';
import { SquealsModule } from 'src/squeals/squeals.module';




@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{name:  'BasicUser', schema: BasicUserSchema}]),
    MongooseModule.forFeature([{ name: 'SmmUser', schema: SmmUserSchema }]),
    MongooseModule.forFeature([{ name: 'SquealerUser', schema: SquealerUserSchema}]),
    forwardRef( () => ChannelModule),
    JwtModule
  ],
  providers: [UsersResolver, UsersService],
  exports: [UsersService],
})
export class UsersModule {}

