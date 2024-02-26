import { Args, Mutation, Resolver, Query, Context} from '@nestjs/graphql';
import { InjectModel } from '@nestjs/mongoose';
//import { Squeal } from './model/squeal.model';
import { Model } from 'mongoose';
//import { SquealDocument } from './model/squeal.schema';
import { CreateSquealInput } from './dto/squealInput';
import { SquealsService } from './squeals.service';
import { Squeal } from './model/squeal.model';
import { GraphQLUpload, FileUpload, Upload } from 'graphql-upload';
import { BasicUser } from 'src/basicusers/model/basic-user.model';
import { userInfo } from 'os';
import { UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/auth/guards/jwt-auth.guard';

import { SquealReturn } from './types/squeal-return';
import { MonthSqueals } from './dto/MonthSqueals';
import { DateReturn } from './types/date-return';
import { ClassificationReturn } from './types/classification-return';
@Resolver(() => Squeal)
export class SquealsResolver {
    
    constructor(private readonly squealService: SquealsService) {}

    @Mutation(() => Boolean)
    @UseGuards(JwtGuard)
    async createSqueal(
      @Args('squealInput') squealInput: CreateSquealInput,
      @Args({ name: 'file', type: () => GraphQLUpload, nullable: true})
        file: FileUpload,
      @Context('userId') userId: any
    ){
      return await this.squealService.createSqueal(squealInput, userId.userId, file);
    }


    @Mutation(() => Boolean)
    @UseGuards(JwtGuard)
    async createTemporized(
      @Args('squealInput') squealInput: CreateSquealInput,
      @Args({ name: 'file', type: () => GraphQLUpload, nullable: true})
        file: FileUpload,
      @Context('userId') userId: any
    ){
      return await this.squealService.publicateTemporizedSqueals(squealInput, userId.userId, file);
    }

    @Query(() => Squeal)
    async getSquealById(
      @Args('squealId') squealId: string
      ) {
          return await this.squealService.getSquealById(squealId);
      }
    
      @Query(() => SquealReturn)
      async getSquealByIdFull(
        @Args('squealId') squealId: string
        ) {
            return await this.squealService.getSquealByIdFull(squealId);
        }
    
    @Query(() => [Squeal])
    @UseGuards(JwtGuard)
    async getSquealsByUserId(
      @Args('profileId') profileId: string,
      @Context('userId') userId: any
    ) {
      return await this.squealService.getSquealsByUserId(profileId, userId.userType);
    }
    
    @Query(() => [SquealReturn])
    @UseGuards(JwtGuard)
    async getUserFeed(
      @Context('userId') userId: any,
      @Args('pageNumber') pageNumber: number
    ) {
      return await this.squealService.getUserFeed(userId.userId, pageNumber);
    }

    @Mutation(() => SquealReturn)
    @UseGuards(JwtGuard)
    async addReaction(
      @Args('squealId') squealId: string,
      @Args('reaction') reaction: string,
      @Context('userId') userId: any
    ) {
      return await this.squealService.addReactionToSqueal(squealId, reaction, userId.userId);
    }

    @Mutation(() => SquealReturn)
    async removeReaction(
      @Args('squealId') squealId: string,
      @Args('reaction') reaction: string,
      @Args('userId') userId: string
    ) {
      return await this.squealService.removeReactionFromSqueal(squealId, reaction, userId);
    }
    @Mutation(() => SquealReturn)
    @UseGuards(JwtGuard)
    async addComment(
      @Args('squealId') squealId: string,
      @Args('commentText') commentText: string,
      @Context('userId') userId: any
    ) {
      return await this.squealService.addCommentToSqueal(squealId, commentText, userId.userId);
    }

    @Mutation(() => Boolean)
    @UseGuards(JwtGuard)
    async addSquealVisualized(
        @Context('userId') userId: any,
        @Args('squealId') squealId: string
    )
        {
        return this.squealService.addVisualizedSqueal(userId.userId, squealId);
    }


    
    @Query(() => [SquealReturn])
    async getSquealsByText(
      @Args('text') text: string
    ) {
      return await this.squealService.getSquealsByText(text);
    }

    @Mutation(() => SquealReturn)
    async addLocation(
      @Args('squealId') squealId: string,
      @Args('lat') lat: number,
      @Args('long') long: number
    ) {
      return await this.squealService.addLocationToSqueal(squealId, lat, long);
    }

    @Query(() => [SquealReturn])
    async getSquealsByChannel(
      @Args('channelId') channelId: string
    ) {
      return await this.squealService.getSquealsByChannelId(channelId);
    }

    @Query(() => [SquealReturn])
    async getUserPublicSqueals(
      @Args('senderId') senderId: string
    ) {
      return await this.squealService.getUserPublicSqueals(senderId);
    }
    
    @Query(() => [SquealReturn])
    async getTrendingSqueals() {
      return await this.squealService.getTrendingSqueals();
    }

    @Query(() => [SquealReturn])
    async getPublicFeed(
      @Args('pageNumber') pageNumber: number
    ) {
      return await this.squealService.getPublicFeed();
    }
    

    @Query(() => [SquealReturn])
    @UseGuards(JwtGuard)
    async getPrivateSqueals(
        @Context('userId') userId: any
    )
        {
        return this.squealService.getPrivateSqueals(userId.userId);
    }

    @Query(() => [SquealReturn])
    @UseGuards(JwtGuard)
    async getMessageSqueals(
        @Context('userId') userId: any
    )
        {
        return this.squealService.getPrivateFeed(userId.userId);
    }

    @Mutation(() => Boolean)
    @UseGuards(JwtGuard)
    async deleteSqueal(
        @Args('squealId') squealId: string
    )
        {
        return this.squealService.deleteSqueal(squealId);
    }

    @Query(() => [SquealReturn])
    async getAllSqueals() {
      return await this.squealService.getAllSqueals();
    }
    
    @Query(() => [SquealReturn])
    @UseGuards(JwtGuard)
    async getSquealReturnByUserId(
      @Args('profileId') profileId: string,
      @Context('userId') userId: any
    ) {
      return await this.squealService.getSquealReturnByUserId(profileId, userId.userType);
    }
    

    @Query(() => [SquealReturn])  
    async getUserSqueals(
      @Args('username', {nullable: true}) username?: string,
      @Args('popular', {nullable: true}) popular?: boolean,
      @Args('unpopular', {nullable: true}) unpopular?: boolean,
      @Args('date', {nullable: true}) date?: string,
      @Args('destionationUserUsername', {nullable: true}) destionationUserUsername?: string
    ) {
      return await this.squealService.getUserSqueals(username, popular, unpopular, date, destionationUserUsername);
    }

    @Mutation(() => SquealReturn)
    async addDestinationToSqueal(
      @Args('squealId') squealId: string,
      @Args('destinationUsers',{ type: () => [String] }) destinationUsers: string[],
      @Args('destinationChannels',{ type: () => [String] }) destinationChannels: string[]
    ) {
      return await this.squealService.addDestinationToSqueal(squealId, destinationUsers, destinationChannels);
    }

    @Mutation(() => SquealReturn)
    async removeDestinationFromSqueal(
      @Args('squealId') squealId: string,
      @Args('destinationUsers',{ type: () => [String] }) destinationUsers: string[],
      @Args('destinationChannels',{ type: () => [String] }) destinationChannels: string[]
    ) {
      return await this.squealService.removeDestinationFromSqueal(squealId, destinationUsers, destinationChannels);
    }

    @Mutation(() => SquealReturn)
    async addNewReactionToSquealMod(
      @Args('squealId') squealId: string,
      @Args('reaction') reaction: string,
      @Args('userId') userId: string,
      @Args('numberOfReactions') numberOfReactions: number
    ) {
      return await this.squealService.addNewReactionToSqueal(squealId, reaction, userId, numberOfReactions);
    }

    @Mutation(() => SquealReturn)
    async removeReactionFromSquealMod(
      @Args('squealId') squealId: string,
      @Args('reaction') reaction: string,
      @Args('numberOfReactions') numberOfReactions: number
    ) {
      return await this.squealService.removeReactionFromSquealMod(squealId, reaction,  numberOfReactions);
    }

    @Mutation(() => Boolean)
    async removeSquealFromChannel(
      @Args('squealId') squealId: string,
      @Args('channelId') channelId: string
    ) {
      return await this.squealService.removeSquealFromChannel(squealId, channelId);
    }

    @Query(() => [DateReturn])
    async getNumberOfSquealsPerDay() {
      return await this.squealService.getNumberOfSquealsPerWeek();
    }

    @Query(() => [ClassificationReturn])
    async getNumberOfSquealsPerClassification() {
      return await this.squealService.getSquealsClassification();
    }

  }
