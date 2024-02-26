import { Resolver,  Query, Args, Mutation, Context } from '@nestjs/graphql';
import { Channel } from './models/channel.model';
import { ChannelService } from './channel.service';
import { NewChannelArgs } from './dto/input/newChannel.Args';
import { ChannelType } from './dto/types/channels.enum';
import { channel } from 'diagnostics_channel';
import { GraphQLUpload, FileUpload, Upload } from 'graphql-upload';
import { JwtGuard } from 'src/auth/guards/jwt-auth.guard';
import { UseGuards } from '@nestjs/common';
import { ChannelReturn } from './dto/types/canali-return';




@Resolver(() => Channel)
export class ChannelResolver {
    constructor(
        private readonly channelService: ChannelService,
        ){
    
      }
    
      /*
        Possono farlo solo gli amministratori
      */
      @Query(() => [Channel])
      async getChannels(
      ){
        return await this.channelService.getAllChannels();
      }
    
      @Query(() => [Channel])
      async getChannelsByType(
        @Args('type') type:ChannelType
      ){
        return await this.channelService.getChannelsByType(type);
      }
    
      
      @Mutation(() => Channel)
      async addUserToChannel(
        @Args('channelId') channelId: string,
        @Args('userId') userId: string
      ){
        return await this.channelService.addUserToChannel(channelId, userId);
      }

      @Mutation(() => Channel)
      async removeUserFromChannel(
        @Args('channelId') channelId: string,
        @Args('username') username: string
      ){
        return await this.channelService.removeUserFromChannel(channelId, username);
      }


      @Query(() => Channel)
      async getChannelByName(
        @Args('name') name:string
      ){
        const channel = await this.channelService.getChannelByName(name);
        return channel;
      }
      
      @Query(() => Channel)
      async getChannelById(
        @Args('_id') _id:string
      ){
        return await this.channelService.getChannelById(_id);
      }
      
      @Query(() => [String])
      async getChannelUsers(
        @Args('_id') _id:string
      ){
        return await this.channelService.getChannelUsers(_id);
      }
    
      @Query(() => [String])
      async getChannelAdmins(
        @Args('_id') _id:string
      ){
        return await this.channelService.getChannelAdmins(_id);
      }
    
      @Mutation(() => Channel)
      @UseGuards(JwtGuard)
      async createChannel(
        @Args('channelInfo') channelInfo: NewChannelArgs,
        @Args({ name: 'file', type: () => GraphQLUpload, nullable: true})
        file: FileUpload,
        @Context('userId') userId: any
      ) {
        return await this.channelService.createChannel(channelInfo, file, userId.userId);
      }
    
      @Mutation(() => String)
      async deleteChannel(
        @Args('_id') _id:string
      ){
        return await this.channelService.deleteChannel(_id);
      }
    
    
      /*@Mutation(() => String)
      async addUsersChannel(
        @Args('userIds') userIds: string[],
        @Args('_id') _id: string
      ){
        return await this.channelService.addUsersToChannel(userIds, _id);
      }*/
    
      @Mutation(() => String)
      async addAdminChannel(
        @Args('channelId') channelId: string,
        @Args('username') username: string
      ){
        return await this.channelService.addAdminToChannel(channelId, username);
      }
      
      @Query(() => [String])
      async getChannelSqueals(
        @Args('_id') _id:string
      ){
        return await this.channelService.getChannelSqueals(_id);
      }
      
      @Mutation(() => Channel)
      async uploadChannelImage(
        @Args('channelId') channelId: string,
        @Args({ name: 'file', type: () => GraphQLUpload })
          file: FileUpload,
      ) {
        return this.channelService.uploadChannelImage(channelId, file);
      }

      @Mutation(() =>  Boolean)
      async addSquealToChannel(
        @Args('channelId') channelId: string,
        @Args('squealId') squealId: string
      ){
        return await this.channelService.addSquealToChannel(channelId, squealId);
      }

      @Query(() => [Channel])
      async getMostPopularChannels(
      ){
        return await this.channelService.getMostPopularChannels();
      }

      @Query(() => Channel)
      async getTemporaryChannel(
        @Args('keyword') keyword: string
      ){
        return await this.channelService.getTemporaryChannel(keyword);
      }

      @Mutation(() => Channel)
      @UseGuards(JwtGuard)
      async createTemporaryChannel(
        @Args('keyword') keyword: string,
        @Context('userId') userId: any,
        @Args('squealId') squealId: string
      ){
        return await this.channelService.createTemporaryChannel(keyword, userId.userId, squealId);
      }

      @Mutation(() => Channel)
      async changeChannelDescription(
        @Args('channelId') channelId: string,
        @Args('newDescription') newDescription: string,
      ){
        return await this.channelService.changeChannelDescription(channelId, newDescription);
      }

      @Query(() => [Channel])
      async getAllOfficialChannels(
      ){
        return await this.channelService.getAllOfficialChannels();
      }

      @Mutation(() => Channel)
      async handleOwnerAdd(
        @Args('channelId') channelId: string,
        @Args('usernames', { type: () => [String] }) usernames: string[]
      ){
        return await this.channelService.handleOwnerAdd(channelId, usernames);
      }

      @Mutation(() => Channel)
      async handleOwnerRemove(
        @Args('channelId') channelId: string,
        @Args('usernames', { type: () => [String] }) usernames: string[]
      ){
        return await this.channelService.handleOwnerRemove(channelId, usernames);
      }

      @Mutation(() => Channel)
      async blockChannel(
        @Args('channelId') channelId: string,
      ){
        return await this.channelService.blockChannel(channelId);
      }

      @Mutation(() => Channel)
      async unblockChannel(
        @Args('channelId') channelId: string,
      ){
        return await this.channelService.unblockChannel(channelId);
      }

      @Mutation(() => Channel)
      async changeChannelName(
        @Args('channelId') channelId: string,
        @Args('newName') newName: string,
      ){
        return await this.channelService.changeChannelName(channelId, newName);
      }

      @Query(() => [ChannelReturn])
      async getChannelsCreatedPerDay(
      ){
        return await this.channelService.getChannelsCreatedPerDay();
      }
      
      @Query(() => [Channel])
      async getAllChannels(
        @Args('pageNumber') pageNumber: number
      ){
        return await this.channelService.getAllChannelsPaginated(pageNumber);
      }

      
}
