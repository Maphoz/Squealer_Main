import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { User } from './models/user.model';
import { UsersService } from './users.service';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/guards/gql-auth.guards';
import { CreateUserInput } from './dto/input/create-user-input.dto';
import { UserUnion } from './user-union';
import { createWriteStream, existsSync, mkdir, mkdirSync } from 'fs';
import { GraphQLUpload, FileUpload, Upload } from 'graphql-upload';
import { create } from 'domain';
import { dirname, join } from 'path';
import { JwtGuard } from 'src/auth/guards/jwt-auth.guard';
import { CompleteRegistrationInput } from './dto/input/completeRegistration.dto';
import { PotentialReceivers } from './dto/args/PotentialReceivers.args';
import { BasicUser } from 'src/basicusers/model/basic-user.model';
import { SMMUser } from 'src/smm/model/smm.model';
import { SquealerUser } from 'src/squealer_moderator/model/squealer-moderator.model';
import { UserTypeReturn } from './dto/user-type-return';


@Resolver(() => User)
export class UsersResolver {


    constructor(
        private readonly usersService: UsersService,

        ){}
    

    @UseGuards(GqlAuthGuard)
    @Query(() => User, {name : 'user'})
    async user(@Args('username') username: string ){ //dato uno username restituisce un utente
       return this.usersService.getUserByUsername(username);
    }

    @Mutation(() => String)
    async createUser(@Args('createUserData') createUserData: CreateUserInput){
        return await this.usersService.createUser(createUserData);
    }

    @Mutation(() => Boolean)
    @UseGuards(JwtGuard)
    async deleteUser(   @Context('userId') userId: any): Promise<Boolean> {
        const deleted = await this.usersService.deleteUser(userId.userId);
        return deleted;
    }

    @Query( () => UserUnion)
    @UseGuards(JwtGuard)
    async getMyAccount(
        @Context('userId') userId: any
    ){
        return await this.usersService.getUserById(userId.userId)
    }

    @Query(() => UserUnion)
    async getUserById(
        @Args('_id') _id: string
    ){
        return await this.usersService.getUserById(_id);
    }

    @Query(() =>  UserUnion)
    async getByUsername(@Args('username') username: string){
        return await this.usersService.getUserByUsername(username);
    }

    @Mutation(() => Boolean)
    @UseGuards(JwtGuard)
    async changeUsername(@Args('_id') _id: string, @Args('newUsername') newUsername: string){
        const changed = await this.usersService.changeUsername(_id, newUsername);
        return changed;
    }

    @Mutation(() => Boolean)
    async changeProfilePicture(@Args('_id') _id: string, @Args('newPicture') newPicture: string){
        const changed = this.usersService.changeProfilePicture(_id, newPicture);
        return changed;
    }

    @Mutation(() => Boolean)
    @UseGuards(JwtGuard)
    async changePassword(
        @Context('userId') userId: any,
        @Args('newPassword') newPassword: string, 
        @Args('newPassword2') newPassword2: string
    ){
        const changed = await this.usersService.changePassword(userId.userId, newPassword, newPassword2);
        return changed;
    }

    @Mutation(() => Boolean)
    async addChannelToUser(
        @Args('userId') userId: string,
        @Args('channelId') channelId: string,
    ){
        return await this.usersService.addChannelToUser(userId, channelId);
    }

    @Mutation(() => Boolean)
    async addBio(
        @Args('_id') _id: string,
        @Args('bio') bio: string
    ){
        return await this.usersService.setBio(_id, bio);
    }

    @Mutation(() => Boolean)
    async uploadImage(
      @Args('userId') userId: string,
      @Args({ name: 'file', type: () => GraphQLUpload })
        file: FileUpload,
    ) {
      return this.usersService.uploadProfileImage(userId, file);
    }

    @Mutation(() => Boolean)
    @UseGuards(JwtGuard)
    async changeFirstName(
        @Context('userId') userId: any,
        @Args('newFirstName') newFirstName: string
    ){
        return await this.usersService.changeFirstName(userId.userId, newFirstName);
    }

    @Mutation(() => Boolean)
    @UseGuards(JwtGuard)
    async changeLastName(
        @Context('userId') userId: any,
        @Args('newLastName') newLastName: string
    ){
        return await this.usersService.changeLastName(userId.userId, newLastName);
    }


    
    @Mutation( () => Boolean)
    async registerBioAndImage(
        @Args('userId') userId: string,
        @Args({ name: 'file', type: () => GraphQLUpload })
        file: FileUpload,
        @Args('bio') bio: string,
    ){
        return await this.usersService.completeRegistration(userId, file, bio);
    }

    @Query(() => UserUnion)
    async validateUser(
        @Args('value') value: string
    ){
        return await this.usersService.validateUser(value);
    }

    @Mutation(() => Boolean)
    @UseGuards(JwtGuard)
    async addHistorytoUser(
        @Context('userId') userId: any,
        @Args('historyId') historyId: string,
        @Args('type') type: string
    ){
        return await this.usersService.addHistoryToUser(userId.userId, historyId, type);
    }

    @Mutation(() => Boolean)
    @UseGuards(JwtGuard)
    async clearHistory(
        @Context('userId') userId: any
    ){
        return await this.usersService.clearHistory(userId.userId);
    }

    @Mutation(() => Boolean)
    @UseGuards(JwtGuard)
    async clearOneHistory(
        @Context('userId') userId: any,
        @Args('historyId') historyId: string
    ){
        return await this.usersService.clearOneHistory(userId.userId, historyId);
    }

    @Query( ( ) => PotentialReceivers)
    @UseGuards(JwtGuard)
    async getReceivers(
        @Context('userId') userId: any
    ){
        return await this.usersService.getReceivers(userId.userId);
    }
    
    @Query(() => [UserUnion])
    async getMostPopularUsers(
    ){
        return await this.usersService.getMostPopularUsers();
    }

    @Query(() => [BasicUser])
    async getAllBasicUsers(){
        return await this.usersService.getAllBasicUsers();
    }

    @Query(() => [SMMUser])
    async getAllSMMUsers(){
        return await this.usersService.getAllSmmUsers();
    }

    @Query(() => [SquealerUser])
    async getAllSquealerUsers(){
        return await this.usersService.getAllSquealerUsers();
    }

    @Query(() => [UserTypeReturn])
    async getAllUsersType(){
        return await this.usersService.getUserForGraph();
    }
    
}


