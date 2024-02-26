import { Module } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { ChannelResolver } from './channel.resolver';
import { UsersModule } from 'src/users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Channel } from './models/channel.model';
import { ChannelSchema } from './models/channel.schema';
import { forwardRef } from "@nestjs/common/utils";
import { SquealsModule } from 'src/squeals/squeals.module';


@Module({
  imports: [
    MongooseModule.forFeature([{ name: Channel.name, schema: ChannelSchema}]),
    forwardRef( () => UsersModule),

  ],
  providers: [ChannelService, ChannelResolver],
  exports: [ChannelService],
})
export class ChannelModule {}
