import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { NotificationsService } from './notifications.service';
import { Notification } from './notification.model';
import { UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/auth/guards/jwt-auth.guard';
import { NotificationFeed } from './dto/NotificationFeed.args';



@Resolver(() => Notification)
export class NotificationsResolver {


    constructor(
      private readonly notificationsService: NotificationsService,
    ){}

    @Query( () => NotificationFeed)
    @UseGuards(JwtGuard)
    async getNotifications(
      @Context('userId') userId: any
    ){
      return await this.notificationsService.getNotifications(userId.userId)
    }

    @Mutation( () => NotificationFeed)
    @UseGuards(JwtGuard)
    async acceptFriendRequest(
      @Context('userId') userId: any,
      @Args('notificationId') notificationId: string
    ){
      return await this.notificationsService.acceptFriendRequest(userId.userId, notificationId)
    }

    @Mutation( () => NotificationFeed)
    @UseGuards(JwtGuard)
    async refuseFriendRequest(
      @Context('userId') userId: any,
      @Args('notificationId') notificationId: string
    ){
      return await this.notificationsService.refuseFriendRequest(userId.userId, notificationId)
    }

    @Mutation( () => NotificationFeed)
    @UseGuards(JwtGuard)
    async acceptChannelRequest(
      @Context('userId') userId: any,
      @Args('notificationId') notificationId: string
    ){
      return await this.notificationsService.acceptChannelRequest(userId.userId, notificationId)
    }

    @Mutation( () => NotificationFeed)
    @UseGuards(JwtGuard)
    async refuseChannelRequest(
      @Context('userId') userId: any,
      @Args('notificationId') notificationId: string
    ){
      return await this.notificationsService.refuseChannelRequest(userId.userId, notificationId)
    }
    
    @Query(() => Boolean)
    @UseGuards(JwtGuard)
    async checkFriendRequest(
      @Context('userId') userId: any,
      @Args('receiverId') receiverId: string
    ){
      return await this.notificationsService.checkFriendRequest(userId.userId, receiverId);
    }

    @Query(() => Boolean)
    @UseGuards(JwtGuard)
    async checkChannelRequest(
      @Context('userId') userId: any,
      @Args('channelId') channelId: string
    ){
      return await this.notificationsService.checkChannelRequest(userId.userId, channelId);
    }

    @Query(() => Boolean)
    @UseGuards(JwtGuard)
    async checkSmmRequest(
      @Context('userId') userId: any
    ){
      return await this.notificationsService.checkSmmRequest(userId.userId);
    }

    @Mutation(() => String)
    @UseGuards(JwtGuard)
    async sendFriendRequest(
        @Context('userId') userId: any,
        @Args('friendId') friendId: string
    ){
        return await this.notificationsService.sendFriendRequest(userId.userId, friendId);
    }

    @Mutation(() => String)
    @UseGuards(JwtGuard)
    async sendChannelRequest(
        @Context('userId') userId: any,
        @Args('channelId') channelId: string
    ){
        return await this.notificationsService.sendChannelRequest(userId.userId, channelId);
    }

    @Mutation(() => String)
    @UseGuards(JwtGuard)
    async sendSmmRequest(
        @Context('userId') userId: any,
        @Args('smmId') smmId: string
    ){
        return await this.notificationsService.sendSmmRequest(userId.userId, smmId);
    }

    @Mutation(() => Boolean)
    @UseGuards(JwtGuard)
    async deleteSmmRequest(
        @Context('userId') userId: any
    ){
        return await this.notificationsService.deleteSmmRequest(userId.userId);
    }

    @Mutation( () => NotificationFeed)
    @UseGuards(JwtGuard)
    async acceptSmmRequest(
      @Context('userId') userId: any,
      @Args('notificationId') notificationId: string
    ){
      return await this.notificationsService.acceptSmmRequest(userId.userId, notificationId)
    }

    @Mutation( () => NotificationFeed)
    @UseGuards(JwtGuard)
    async refuseSmmRequest(
      @Context('userId') userId: any,
      @Args('notificationId') notificationId: string
    ){
      return await this.notificationsService.refuseSmmRequest(userId.userId, notificationId)
    }

}


