import { Module } from '@nestjs/common';
import { SmmResolver } from './smm.resolver';
import { SmmService } from './smm.service';
import { MongooseModule } from '@nestjs/mongoose';
import { SmmUserSchema } from './model/smm.schema';
import { JwtGuard } from 'src/auth/guards/jwt-auth.guard';
import { JwtModule } from '@nestjs/jwt';
import { forwardRef } from "@nestjs/common/utils";
import { UsersModule } from 'src/users/users.module';
import { SquealsModule } from 'src/squeals/squeals.module';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { BasicusersModule } from 'src/basicusers/basicusers.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'SMMUser', schema: SmmUserSchema }]),
    JwtModule,
    forwardRef( () => UsersModule),
    forwardRef( () => SquealsModule),
    forwardRef( () => NotificationsModule),
    forwardRef( () => BasicusersModule),
  ],
  providers: [SmmResolver, SmmService],
  exports: [SmmService]
})
export class SmmModule {}
