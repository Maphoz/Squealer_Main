import { Module } from '@nestjs/common';
import { SquealerModeratorResolver } from './squealer_moderator.resolver';
import { SquealerModeratorService } from './squealer_moderator.service';
import { MongooseModule } from '@nestjs/mongoose';
import { SquealerUserSchema } from './model/squealer-moderator.schema';
import { UsersModule } from 'src/users/users.module';
import { BasicUserSchema } from 'src/basicusers/model/basic-user.schema';
import { SmmUserSchema } from 'src/smm/model/smm.schema';

@Module({
  imports: [
    UsersModule,
    MongooseModule.forFeature([{name:  'BasicUser', schema: BasicUserSchema}]),
    MongooseModule.forFeature([{ name: 'SmmUser', schema: SmmUserSchema }]),
    MongooseModule.forFeature([{ name: 'SquealerUser', schema: SquealerUserSchema}]),
  ],
  providers: [SquealerModeratorResolver, SquealerModeratorService],
  exports: [SquealerModeratorService]
})
export class SquealerModeratorModule {}
