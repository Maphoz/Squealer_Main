import { Args, Mutation, Resolver, Query, Context } from '@nestjs/graphql';
import { SmmService } from './smm.service';
import { SMMUser } from './model/smm.model';
import { CreateUserInput } from 'src/users/dto/input/create-user-input.dto';
import { GraphQLUpload, FileUpload, Upload } from 'graphql-upload';
import { UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateSMMInput } from './dto/SMMInput';
import { SmmUserDocument } from './model/smm.schema';
import { BasicUser } from 'src/basicusers/model/basic-user.model';
import { ClientStats } from './dto/ClientStats.args';
import { ClientActivity } from './dto/ClientActivity.args';
import { NotificationFeed } from 'src/notifications/dto/NotificationFeed.args';
import { Squeal } from 'src/squeals/model/squeal.model';
import { PotentialReceivers } from 'src/users/dto/args/PotentialReceivers.args';
import { CreateSquealInput } from 'src/squeals/dto/squealInput';
import { Review } from './dto/review.model';
import { SmmProfile } from './dto/SmmProfile.args';
import { NewReview } from './dto/NewReview.args';
import { UpdateSmm } from './dto/UpdateSmm.args';
import { MonthSqueals } from 'src/squeals/dto/MonthSqueals';

@Resolver()
export class SmmResolver {
    constructor(
        private readonly smmService: SmmService,
    ){}


    @Mutation(() => SMMUser)
    async createSmm(
      @Args('userInfo') userInfo: CreateSMMInput,
      @Args({ name: 'file', type: () => GraphQLUpload })
        file: FileUpload,
    ) {
      return this.smmService.createSmm(userInfo, file);
    }

    @Query( () => [BasicUser])
    @UseGuards(JwtGuard)
    async getClients(
        @Context('userId') userId: any
    ){
        return await this.smmService.getClients(userId.userId)
    }

    @Query(() => ClientStats)
    @UseGuards(JwtGuard)
    async getClientStats(
        @Context('userId') userId: any,
        @Args('clientId') clientId: string
    ){
        return await this.smmService.getClientStats(userId.userId, clientId)
    }

    @Mutation(() => [BasicUser])
    @UseGuards(JwtGuard)
    async removeClient(
        @Context('userId') userId: any,
        @Args('clientId') clientId: string
    ){
        return await this.smmService.removeClient(userId.userId, clientId);
    }
    

    @Query(() => BasicUser)
    @UseGuards(JwtGuard)
    async getClient(
        @Context('userId') userId: any,
        @Args('clientId') clientId: string
    ){
        return await this.smmService.getClient(userId.userId, clientId)
    }

    @Query(() => ClientActivity)
    @UseGuards(JwtGuard)
    async getClientSqueals(
        @Context('userId') userId: any,
        @Args('clientId') clientId: string
    ){
        return await this.smmService.getClientSqueals(userId.userId, clientId);
    }   

    @Query(() => NotificationFeed)
    @UseGuards(JwtGuard)
    async getClientNotifications(
        @Context('userId') userId: any,
        @Args('clientId') clientId: string
    ){
        return await this.smmService.getClientNotifications(userId.userId, clientId);
    }   

    @Mutation( () => NotificationFeed)
    @UseGuards(JwtGuard)
    async acceptFriendRequestSmm(
      @Context('userId') userId: any,
      @Args('notificationId') notificationId: string,
      @Args('clientId') clientId: string
    ){
      return await this.smmService.acceptFriendRequest(userId.userId, notificationId, clientId)
    }

    @Mutation( () => NotificationFeed)
    @UseGuards(JwtGuard)
    async refuseFriendRequestSmm(
      @Context('userId') userId: any,
      @Args('notificationId') notificationId: string,
      @Args('clientId') clientId: string
    ){
      return await this.smmService.refuseFriendRequest(userId.userId, notificationId, clientId)
    }

    @Mutation( () => NotificationFeed)
    @UseGuards(JwtGuard)
    async acceptChannelRequestSmm(
      @Context('userId') userId: any,
      @Args('notificationId') notificationId: string,
      @Args('clientId') clientId: string
    ){
      return await this.smmService.acceptChannelRequest(userId.userId, notificationId, clientId)
    }

    @Mutation( () => NotificationFeed)
    @UseGuards(JwtGuard)
    async refuseChannelRequestSmm(
      @Context('userId') userId: any,
      @Args('notificationId') notificationId: string,
      @Args('clientId') clientId: string
    ){
      return await this.smmService.refuseChannelRequest(userId.userId, notificationId, clientId)
    }

    @Mutation( () => BasicUser)
    @UseGuards(JwtGuard)
    async addCharsClient(
      @Context('userId') userId: any,
      @Args('chars') chars: number,
      @Args('period') period: string,
      @Args('clientId') clientId: string
    ){
      return await this.smmService.addCharsClient(userId.userId, clientId, chars, period)
    }

    @Mutation( () => [Squeal])
    @UseGuards(JwtGuard)
    async deleteClientSqueal(
      @Context('userId') userId: any,
      @Args('squealId') squealId: string,
      @Args('clientId') clientId: string
    ){
      return await this.smmService.deleteClientSqueal(userId.userId, squealId, clientId);
    }

    @Query(() => PotentialReceivers)
    @UseGuards(JwtGuard)
    async getClientReceivers(
        @Context('userId') userId: any,
        @Args('clientId') clientId: string
    ){
        return await this.smmService.getClientReceivers(userId.userId, clientId);
    }   

    @Mutation(() => Boolean)
    @UseGuards(JwtGuard)
    async createClientSqueal(
      @Args('squealInput') squealInput: CreateSquealInput,
      @Args({ name: 'file', type: () => GraphQLUpload, nullable: true})
        file: FileUpload,
      @Context('userId') userId: any,
      @Args('clientId') clientId: string
    ){
      return await this.smmService.createClientSqueal(squealInput, userId.userId, file, clientId);
    }

    @Mutation(() => Boolean)
    @UseGuards(JwtGuard)
    async createTemporizedClientSqueal(
      @Args('squealInput') squealInput: CreateSquealInput,
      @Args({ name: 'file', type: () => GraphQLUpload, nullable: true})
        file: FileUpload,
      @Context('userId') userId: any,
      @Args('clientId') clientId: string
    ){
      return await this.smmService.createTemporizedClientSqueal(userId.userId, squealInput, file, clientId);
    }

    @Query(() => SmmProfile)
    @UseGuards(JwtGuard)
    async getSmmProfile(
        @Context('userId') userId: any,
    ){
        return await this.smmService.getSmmProfile(userId.userId);
    }
    
    @Query(() => SMMUser)
    @UseGuards(JwtGuard)
    async getSmmFromClient(
        @Context('userId') userId: any,
        @Args('smmId') smmId: string
    ){
        return await this.smmService.getSmmClient(userId.userId, smmId);
    }

    @Mutation(() => Boolean)
    @UseGuards(JwtGuard)
    async deleteSmm(
        @Context('userId') userId: any,
    ){
        return await this.smmService.deleteSmm(userId.userId);
    } 

    @Mutation(() => [Review])
    @UseGuards(JwtGuard)
    async addReview(
        @Context('userId') userId: any,
        @Args('smmId') smmId: string,
        @Args('review') review: NewReview
    ){
        return await this.smmService.addReview(userId.userId, smmId, review);
    }

    @Mutation(() => SMMUser)
    @UseGuards(JwtGuard)
    async updateSmm(
      @Context('userId') userId: any,
      @Args({name: 'userInfo', nullable: true}) userInfo: UpdateSmm,
      @Args({ name: 'file', type: () => GraphQLUpload, nullable: true})
        file: FileUpload,
    ) {
      return this.smmService.updateProfile(userId.userId, userInfo, file);
    }

    @Query(() => MonthSqueals)
    @UseGuards(JwtGuard)
    async monthDataClient(
      @Args('clientId') clientId: string,
      @Context('userId') userId: any,
    ){
      return await this.smmService.getClientMonthData(userId.userId, clientId);
    }

    @Query(() => [SMMUser])
    @UseGuards(JwtGuard)
    async getSmms(
    ){
      return await this.smmService.getSmms();
    }

    @Mutation(() => Boolean)
    @UseGuards(JwtGuard)
    async reduceCharsClient(
      @Args('clientId') clientId: string,
      @Context('userId') userId: any,
      @Args('chars') chars: number,

    ){
      return await this.smmService.reduceClientChars(userId.userId, clientId, chars);
    }
}
