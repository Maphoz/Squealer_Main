import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/auth/guards/jwt-auth.guard';
import { Message } from './dto/message.model';
import { MessagesService } from './messages.service';
import { ChatReturn } from './dto/ChatReturn.args';



@Resolver(() => Message)
export class MessagesResolver {

    constructor(
      private readonly messageService: MessagesService,
    ){}

    @Mutation( () => Message)
    @UseGuards(JwtGuard)
    async addMessage(
      @Context('userId') userId: any,
      @Args('text') text: string,
      @Args('channelId') channelId: string,
    ){
      return await this.messageService.addMessage(userId.userId, text, channelId);
    }
    
    @Query(() => ChatReturn)
    @UseGuards(JwtGuard)
    async getChatsSmm(
      @Context('userId') userId: any,
    ){
      return await this.messageService.getChatsSmm(userId.userId);
    }
}


