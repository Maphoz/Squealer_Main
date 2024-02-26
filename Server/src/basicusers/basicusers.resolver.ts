import { Args, Context, Mutation,Query, Resolver } from '@nestjs/graphql';
import { BasicUser } from './model/basic-user.model';
import { BasicusersService } from './basicusers.service';
import { CreateUserInput } from 'src/users/dto/input/create-user-input.dto';
import { DeleteUserArgs } from 'src/users/dto/args/delete-user-args.dto';
import { JwtGuard } from 'src/auth/guards/jwt-auth.guard';
import { UseGuards } from '@nestjs/common';
import { SMMUser } from 'src/smm/model/smm.model';
import { RecoverData } from './types/RecoverData.args';

@Resolver()
export class BasicusersResolver {

    constructor(private readonly basicsUserService: BasicusersService){}

    @Mutation(() => BasicUser)
    @UseGuards(JwtGuard)
    async addSmm(
        @Context('userId') userId: any,
        @Args('username') username: string)
    {
        return this.basicsUserService.addSmm(userId.userId, username);
    }

    @Mutation(() => BasicUser)
    @UseGuards(JwtGuard)
    async removeSmm(
        @Context('userId') userId: any,
        @Args('username') username: string)
        {
        return this.basicsUserService.removeSmm(userId.userId, username);
    }

    @Mutation(() => BasicUser)
    @UseGuards(JwtGuard)
    async removeSmmWithId(
        @Context('userId') userId: any,
        @Args('smmId') smmId: string)
        {
        return this.basicsUserService.removeSmmFromVip(userId.userId, smmId);
    }

    @Mutation(() => BasicUser)
    @UseGuards(JwtGuard)
    async upgradeToVip(
        @Context('userId') userId: any
    )
        {
        return this.basicsUserService.upgradeToVip(userId.userId);
    }

    @Mutation(() => BasicUser)
    @UseGuards(JwtGuard)
    async downgradeVip(
        @Context('userId') userId: any
    )
        {
        return this.basicsUserService.downgradeFromVip(userId.userId);
    }

    @Mutation(() => BasicUser)
    @UseGuards(JwtGuard)
    async addChars(
        @Context('userId') userId: any,
        @Args('chars') chars: number,
        @Args('period') period: string,
    )
        {
        return this.basicsUserService.addCharacters(userId.userId, chars, period);
    }

    @Mutation(() => Boolean)
    @UseGuards(JwtGuard)
    async reduceChars(
        @Context('userId') userId: any,
        @Args('chars') chars: number
    )
        {
        return this.basicsUserService.decresePurchasable(userId.userId, chars);
    }

    @Mutation(() => SMMUser)
    async addSmmToVip(
        @Args('vipId') vipId: string,
        @Args('smmId') smmId: string,
    ){
        return await this.basicsUserService.addSmmToVip(smmId, vipId);
    }

    @Query(() => [BasicUser])
    async getAllNonVipUsers(@Args('popularityIndex') popularityIndex: number){
        return await this.basicsUserService.getAllNonVipUsers(popularityIndex);
    }

    @Query(() => [BasicUser])
    async getAllVipUsers(@Args('popularityIndex') popularityIndex: number){
        return await this.basicsUserService.getAllVipUsers(popularityIndex);
    }

    @Query(() => [BasicUser])
    async getMostActiveUsers(){
        return await this.basicsUserService.getMostActiveUsers();
    }

    @Query(() => [BasicUser])
    async getMostUnpopularUser(){
        return await this.basicsUserService.getMostUnpopularUser();
    }

    @Query(() => [BasicUser])
    async getMostFriends(){
        return await this.basicsUserService.getMostFriends();
    }

    @Query(() => RecoverData)
    async getRecoveryData(
        @Args('email') email:string
    ){
        return await this.basicsUserService.getRecoveryData(email);
    }

    @Query(() => Boolean)
    async verifyData(
        @Args('email') email:string,
        @Args('recoverAnswer') recoverAnswer:string,
        ){
        return await this.basicsUserService.verifyData(email, recoverAnswer);
    }
    
    @Mutation(() => Boolean)
    async recoverPassword(
        @Args('email') email:string,
        @Args('newPassword') newPassword:string,
        ){
        return await this.basicsUserService.newPassword(email, newPassword);
    }
}
