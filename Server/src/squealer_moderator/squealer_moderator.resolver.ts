import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { SquealerModeratorService } from './squealer_moderator.service';
import { SquealerUser } from './model/squealer-moderator.model';
import { UserUnion } from 'src/users/user-union';


@Resolver()
export class SquealerModeratorResolver {

    constructor(private readonly usersService: SquealerModeratorService){}

    @Query(() => [UserUnion]) 
    async getUserByType(@Args('type') type: string){
      return await this.usersService.getUserByType(type);
    }

    @Query(() => [UserUnion]) 
    async getAllUsers(){
         return await this.usersService.getAllUsers();
    }

    @Query(() => [UserUnion]) 
    async getUsersByPopularity(@Args('popularityThreshold') popularityThreshold: number){
        return await this.usersService.filterUsersByPopularity(popularityThreshold);
    }

    @Mutation(() => Boolean)
    async blockUser(@Args('id') id: string){
        return await this.usersService.blockUser(id);
    }

    @Mutation(() => Boolean)
    async unblockUser(@Args('id') id: string){
        return await this.usersService.unblockUser(id);
    }

    @Mutation(() => Boolean)
    async addCharacter(
        @Args('toAdd') toAdd: number,
        @Args('type') type:string,
        @Args('id') id: string
        ) {
            return await this.usersService.addCharacter(toAdd, type, id);
        }

        @Mutation(() => Boolean)
        async removeCharacter(
            @Args('toAdd') toAdd: number,
            @Args('type') type:string,
            @Args('id') id: string
            ) {
                return await this.usersService.removeCharacter(toAdd, type, id);
            }

}
