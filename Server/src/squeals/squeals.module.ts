import { Module, forwardRef } from '@nestjs/common';
import { SquealsService } from './squeals.service';
import { SquealsResolver } from './squeals.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { Squeal } from './model/squeal.model';
import { SquealSchema } from './model/squeal.schema';
import { UsersModule } from 'src/users/users.module';
import { ChannelModule } from 'src/channel/channel.module';
import { JwtModule } from '@nestjs/jwt';
import { ScheduleModule } from '@nestjs/schedule';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { BasicusersModule } from 'src/basicusers/basicusers.module';



@Module({
  imports: [
    MongooseModule.forFeature([{ name: Squeal.name, schema: SquealSchema }]),
    forwardRef(() => ChannelModule),
    forwardRef(() => UsersModule),
    JwtModule,
    NotificationsModule,
    ScheduleModule.forRoot(),
    BasicusersModule
  ],
  providers: [SquealsService, SquealsResolver],
  exports: [SquealsService]
})
export class SquealsModule {}
