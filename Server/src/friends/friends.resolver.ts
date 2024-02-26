import { Args, Context, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { FriendsService } from './friends.service';
import { JwtGuard } from 'src/auth/guards/jwt-auth.guard';
import { UseGuards } from '@nestjs/common';

@Resolver()
export class FriendsResolver {
    constructor(private readonly friendsService: FriendsService) {}

 
    @Mutation(() => Boolean)
    async addFriend(
        @Args('userUsername') userUsername: string,
        @Args('friendUsername') friendUsername: string,
    ): Promise<Boolean> {
        return this.friendsService.addFriend(userUsername, friendUsername);
    }

    @Query(() => [String])
    async getFriends(@Args('userId') userId: string): Promise<string[]> {
        return this.friendsService.getUserFriends(userId);
    }

    @Query(() => Int)
    async getNumFriends(@Args('userId') userId: string){
        return this.friendsService.getNumFriends(userId);
    }

    @Mutation(() => Boolean)
    async removeFriend(
        @Args('userUsername') userUsername: string,
        @Args('friendUsername') friendUsername: string,
    ): Promise<Boolean> {
        return this.friendsService.deleteFriend(userUsername, friendUsername);
    }
}
