import { Inject, Injectable, Logger, forwardRef, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { SquealDocument } from './model/squeal.schema';
import { Model, set } from 'mongoose';
import { CreateSquealInput } from './dto/squealInput';
import { UsersService } from 'src/users/users.service';
import { ChannelService } from 'src/channel/channel.service';
import { ChannelType } from 'src/channel/dto/types/channels.enum';
import { GraphQLUpload, FileUpload, Upload } from 'graphql-upload';
import { createWriteStream } from 'fs';
import { Squeal } from './model/squeal.model';
import { Reaction } from './types/reaction.schema';
import { BasicUser } from 'src/basicusers/model/basic-user.model';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ActivePath } from 'src/const';
import { NotificationsService } from 'src/notifications/notifications.service';
import { NotificationType } from 'src/notifications/dto/notification.enum';
import { SQUEAL_CLASSIFICATION } from './types/squeal.classification';
import { BasicusersService } from 'src/basicusers/basicusers.service';
import { User } from 'src/users/models/user.model';
import { SquealReturn } from './types/squeal-return';
import { get } from 'http';
import { start } from 'repl';
import { MonthSqueals } from './dto/MonthSqueals';
import { ChannelDocument } from 'src/channel/models/channel.schema';
import axios from 'axios';


@Injectable()
export class SquealsService {
  private readonly logger = new Logger(SquealsService.name);
  private positiveReactions = ["laugh", "agree", "emotional", "like"];
  private cachedPostsMap: Map<string, SquealReturn[]> = new Map();

    constructor(
        @InjectModel('Squeal') private readonly squealModel: Model<SquealDocument>,
        @Inject(forwardRef( () => UsersService))
        private readonly userService: UsersService,
        private readonly channelsService: ChannelService,
        private readonly notificationsService: NotificationsService,
        private readonly basicUserService: BasicusersService,
        ) {}

        onModuleInit() {
          setInterval(() => this.setTrendingIndex().catch(err => console.error(err)), 60 * 60 * 1000);
          setInterval(() => this.deleteExpiredTemporaryChannels(), 5 * 60 * 1000);  
          setInterval(() => this.addSquealsToOfficialChannels(), 1 * 60 * 60 * 1000 + 2 * 60 * 1000);
          setInterval(() => this.addTrendingSquealsToOfficialChannel(),12 * 60 * 60 * 1000 + 4 * 60 * 1000); 
          setInterval(() => this.postRandomNews(), 2* 60 * 60 * 1000 + 6 * 60 * 1000);
          
        }

        async createSqueal(squealInput: CreateSquealInput, userId: string, file): Promise<boolean> {
          try {
            var createdSqueal;
            const user = await this.userService.getUserById(userId);
            if(squealInput.charactersCost > await this.userService.getCharLimit(userId))
              throw new Error('Non hai caratteri sufficienti');
            if(squealInput.keyword){
              try{
                if(squealInput.text.length > 0) 
                  await this.notifiyMentions(squealInput.text, user.username, userId);
              } catch(error) {
                console.log("errore nel mandare menzioni");
              }
              createdSqueal = new this.squealModel({
                ...squealInput,
                senderId: userId,
                publicationDate: squealInput.delay ? null : new Date(), 
                reactions: [],
                comments: [],
                uploadedFile: null,
                geolocation: squealInput.lat ? {latitude: squealInput.lat, longitude: squealInput.lng} : null,
                publicationAnticipation: squealInput.delay ? new Date(Date.now() + squealInput.delay * 1000) : null,
                keyword: squealInput.keyword ? squealInput.keyword : null,
                classification: SQUEAL_CLASSIFICATION.NORMALE,
                views: 0,
                isPublic: true
              });
              squealInput.typeOfUpload && await this.uploadImage(createdSqueal, file);
              await this.userService.addSquealToUser(userId, createdSqueal._id, squealInput.charactersCost);

              const channel = await this.channelsService.getTemporaryChannel(squealInput.keyword);
              if(channel == null){
                await this.channelsService.createTemporaryChannel(squealInput.keyword, userId, createdSqueal._id);
                //get the channel
                let tempChannel = await this.channelsService.getTemporaryChannel(squealInput.keyword);
                //add the channel id to the squeal
                createdSqueal.destinationChannels.push(tempChannel._id);
              } else {
                await this.channelsService.addSquealToTemporaryChannel(channel.keyword, createdSqueal._id)
                let tempChannel = await this.channelsService.getTemporaryChannel(squealInput.keyword);
                //add the channel id to the squeal
                createdSqueal.destinationChannels.push(tempChannel._id);
              }
              await createdSqueal.save();
            } else{
              if(squealInput.destinationUserIds.length  === 0 && squealInput.destinationChannels.length === 0){
                try{
                  if(squealInput.text.length > 0) 
                    await this.notifiyMentions(squealInput.text, user.username, userId);
                } catch(error) {
                  console.log("errore nel mandare menzioni");
                }
                createdSqueal = new this.squealModel({
                  ...squealInput,
                  destinationUserIds: [],
                  destinationChannels: [],
                  senderId: userId,
                  publicationDate:  new Date(),
                  reactions: [],
                  
                  comments: [],
                  uploadedFile: null,
                  geolocation: squealInput.lat ? {latitude: squealInput.lat, longitude: squealInput.lng} : null,
                  publicationAnticipation:  null,
                  keyword:  null,
                  classification: SQUEAL_CLASSIFICATION.NORMALE,
                  views: 0,
                  isPublic: true
                });
                squealInput.typeOfUpload && await this.uploadImage(createdSqueal, file);
                await this.userService.addSquealToUser(userId, createdSqueal._id, squealInput.charactersCost);
                await createdSqueal.save();
              }  else {
                for(let i = 0; i < squealInput.destinationUserIds.length; i++){
                  createdSqueal = new this.squealModel({
                    ...squealInput,
                    destinationUserIds: [squealInput.destinationUserIds[i]],
                    destinationChannels: [],
                    senderId: userId,
                    publicationDate: squealInput.delay ? null : new Date(),
                    reactions: [],
                    isPublic: false,
                    comments: [],
                    uploadedFile: null,
                    geolocation: squealInput.lat ? {latitude: squealInput.lat, longitude: squealInput.lng} : null,
                    publicationAnticipation: squealInput.delay ? new Date(Date.now() + squealInput.delay * 1000) : null,
                    keyword: null,
                    classification: SQUEAL_CLASSIFICATION.NORMALE,
                    views: 0,
                  });
                  squealInput.typeOfUpload && await this.uploadImage(createdSqueal, file);
                  await this.userService.addSquealToUser(userId, createdSqueal._id, 0);
                  await createdSqueal.save();
                }
                for(let i = 0; i < squealInput.destinationChannels.length; i++){
                  createdSqueal = new this.squealModel({
                    ...squealInput,
                    destinationChannels: [squealInput.destinationChannels[i]],
                    destinationUserIds: [],
                    channelName : (await this.channelsService.getChannelById(squealInput.destinationChannels[i])).name,
                    senderId: userId,
                    publicationDate: squealInput.delay ? null : new Date(), 
                    reactions: [],
                    isPublic: false,
                    comments: [],
                    uploadedFile: null,
                    geolocation: squealInput.lat ? {latitude: squealInput.lat, longitude: squealInput.lng} : null,
                    publicationAnticipation: squealInput.delay ? new Date(Date.now() + squealInput.delay * 1000) : null,
                    keyword:  null,
                    classification: SQUEAL_CLASSIFICATION.NORMALE,
                    views: 0,
                  });
                  squealInput.typeOfUpload && await this.uploadImage(createdSqueal, file);
                  await this.userService.addSquealToUser(userId, createdSqueal._id, i == 0 ? squealInput.charactersCost : 0);
                  await createdSqueal.save();
                  await this.channelsService.addSquealToChannel(squealInput.destinationChannels[i], createdSqueal._id);
                }
              }
            }
            return true;
          } catch (error) {
            console.log(error);
          }
          }

          async createTemporizedSqueal(squealInput: CreateSquealInput, userId: string, file, publicationAnticipation: Date): Promise<boolean> {
  
            var createdSqueal;
            if(!squealInput.keyword){
              if(squealInput.destinationUserIds.length  === 0 && squealInput.destinationChannels.length === 0){
                createdSqueal = new this.squealModel({
                  ...squealInput,
                  destinationUserIds: [],
                  destinationChannels: [],
                  senderId: userId,
                  publicationDate: null,
                  reactions: [],
                  comments: [],
                  uploadedFile: null,
                  geolocation: null,
                  publicationAnticipation: publicationAnticipation,
                  keyword: null,
                  classification: SQUEAL_CLASSIFICATION.NORMALE,
                  views: 0,
                  isPublic: true
                });
                try{
                  await createdSqueal.save();
                } catch(error){
                  console.log("errore in nessuna destinazione");
                }
              }
              for(let i = 0; i < squealInput.destinationChannels.length; i++){
                createdSqueal = new this.squealModel({
                  ...squealInput,
                  destinationChannels: squealInput.destinationChannels[i],
                  destinationUserIds: [],
                  channelName: (await this.channelsService.getChannelById(squealInput.destinationChannels[i])).name,
                  senderId: userId,
                  publicationDate: null, 
                  reactions: [],
                  comments: [],
                  uploadedFile: null,
                  geolocation: null,
                  publicationAnticipation: publicationAnticipation,
                  keyword: null,
                  classification: SQUEAL_CLASSIFICATION.NORMALE,
                  views: 0,
                  isPublic: false
                });
                try{
                  await createdSqueal.save();
                } catch(error){
                  console.log('destinationChannels', error.message);
                }
              }
              for(let i = 0; i < squealInput.destinationUserIds.length; i++){
                createdSqueal = new this.squealModel({
                  ...squealInput,
                  destinationUserIds: squealInput.destinationUserIds[i],
                  destinationChannels: [],
                  senderId: userId,
                  publicationDate: null, 
                  reactions: [],
                  
                  comments: [],
                  uploadedFile: null,
                  geolocation: null,
                  publicationAnticipation: publicationAnticipation,
                  keyword: null,
                  classification: SQUEAL_CLASSIFICATION.NORMALE,
                  views: 0,
                  isPublic: false
                });
                try{
                  await createdSqueal.save();
                } catch(error){
                  console.log('destinationUserIds', error.message)
                }
              }
            }else {
              createdSqueal = new this.squealModel({
                ...squealInput,
                destinationUserIds: [],
                senderId: userId,
                publicationDate: null, 
                reactions: [],
                
                comments: [],
                uploadedFile: null,
                geolocation: null,
                publicationAnticipation: publicationAnticipation,
                keyword: squealInput.keyword,
                classification: SQUEAL_CLASSIFICATION.NORMALE,
                views: 0,
                isPublic: true
              });
              try{
                await createdSqueal.save();
              } catch(error){
                console.log("errore in keyword");
              }
            }

            return createdSqueal;
          }


          async publicateTemporizedSqueals(squeal: CreateSquealInput, userId: string, file) : Promise<boolean>{
            const {text, repetitions} = squeal;
      
            // parsing del testo per vedere se presente variabile {NUM}, {Time} e {date} da temporizzare
            const {numPresent, timePresent, datePresent} = await this.parseText(squeal.text);
            
            for(let i = 1; i < repetitions + 1; i++){
              const publicationAnticipation = new Date(Date.now() + squeal.delay * 1000 * i)

              //creazione del testo ad hoc per lo squeal
              var textCompiled = text;
              if(numPresent) textCompiled = textCompiled.replace(/\{NUM\}/g, i.toString());
              if(timePresent) textCompiled = textCompiled.replace(/\{TIME\}/g, await this.getHour(publicationAnticipation));
              if(datePresent) textCompiled = textCompiled.replace(/\{DATE\}/g, await this.getDate(publicationAnticipation));


              try{
                var squealCreated = await this.createTemporizedSqueal({
                ...squeal,
                text: textCompiled
                }, userId, null, publicationAnticipation);
              }catch(error){
                console.log(error.message);
              }
            }
            return true;
          }

          //function to get the squeal by id
          async getSquealById(squealId: string) {
            try {
            const squeal = await this.squealModel.findById(squealId);
            if (!squeal) {
              return null;
            }
            let senderUser = await this.userService.getUserById(squeal.senderId);
            if(!senderUser){
              return null;
            }
            return squeal;
          } catch(error){
            console.log(error);
          }
          }

          async getSquealByIdFull(squealId: string): Promise<SquealReturn>{
            try {
            const squeal = await this.squealModel.findById(squealId);
            if (!squeal) {
              return null;
            }
            let senderUser = await this.userService.getUserById(squeal.senderId);
            if(!senderUser){
              return null;
            }
            return {
              squeal: squeal,
              user: senderUser
            };
          } catch(error){
            console.log(error);
          }
          }

          async deleteSqueal(squealId: string): Promise<boolean>{
            try {
            const squeal = await this.squealModel.findById(squealId);
            if (!squeal) {
              return null;
            }
            if(squeal.destinationChannels){
              await this.channelsService.deleteSquealFromChannel(squealId, squeal.destinationChannels[0]);
            }
            const user = await this.userService.getUserById(squeal.senderId);
            if(!user) return null;
            user.squeals = user.squeals.filter(squeal => squeal!== squealId);
            await user.save();
            await squeal.deleteOne();
            return true;
          } catch(error){
            console.log(error);
          }
          }
         
          /*
            function to return 10 squeals from the channels user is subscribed to ordinated by date
          */
          async getChannelsSqueal(userId: string) {
           try{
           const user = await this.userService.getUserById(userId);
            if (!user) {
              throw new Error('User not found');
            }
            const channels = user.channels;
            /*
              get the squeals from the channels, put them in an array and sort them by date
            */
            let squeals = [];
            if(channels != null){
              for (let i = 0; i < channels.length; i++) {
                squeals.push(await this.channelsService.getChannelSqueals(channels[i]));
              }
            }
            //for each squeal in the array get the related document
            let squealDocuments = [];
            if(squeals != null){
              for (let i = 0; i < squeals.length; i++) {
                const squeal = await this.getSquealById(squeals[i]);
                if(squeal)  squealDocuments.push(await this.getSquealById(squeals[i]));
              }
            }
            //sort the squeals by date the msot recent is the first and the oldest is the last
            squealDocuments.sort((a, b) => b.publicationDate.getTime() - a.publicationDate.getTime());
            let userChannelSqueals: SquealReturn[] = [];
            for (let i = 0; i < squealDocuments.length; i++) {
              const userDocument = await this.userService.getUserById(squealDocuments[i].senderId);
              if (userDocument) {
                userChannelSqueals.push({ squeal: squealDocuments[i], user: userDocument });
              }
            }
            //sort the squeals by date
            userChannelSqueals.sort((a, b) => b.squeal.publicationDate.getTime() - a.squeal.publicationDate.getTime());
            //return the first 10 squeals
            if(userChannelSqueals.length > 10){
               userChannelSqueals.slice(0, 10);
            }
            return userChannelSqueals;
          } catch(error){
            console.log(error);
          }
          }

          /**
           * 
           * @param userId 
           * @returns 30 squeal più recenti dei canali di cui fa parte
           */
          async getChannelFeed(userId: string) {
            try {
            const user = await this.userService.getUserById(userId);
            if (!user) {
              throw new Error('User not found');
            }
            const channels = user.channels;
          
            const squeals = await this.squealModel
              .find({
                destinationChannels: { $elemMatch: { $in: channels } },
                publicationDate: { $ne: null },
                _id: { $nin: user.visualizedSqueals }, // Exclude squeals that user has already visualized
              })
              .sort({ publicationDate: -1 })
              .limit(30)
              .exec();
          
            let userChannelSqueals: SquealReturn[] = [];
            for (let i = 0; i < squeals.length; i++) {
              var userDocument = null;
              if(squeals[i] != null && squeals[i].senderId) userDocument = await this.userService.getUserById(squeals[i].senderId);
              if (userDocument) {
                userChannelSqueals.push({ squeal: squeals[i], user: userDocument });
              }
            }
          
            return userChannelSqueals;
          } catch(error){
            console.log(error);
          }
          }

          /*
            function to return 10 squeals from the channels of type "public" ordinated by date
          */
          async getPublicSqueals(userId: string) {
            try {
            const user = await this.userService.getUserById(userId);
            //take some random squeals published in the last week with 'isPublic' = true 
            const squeals = await this.squealModel.find({
              publicationDate: {
                $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
              },
              isPublic: true,
              _id: { $nin: user.visualizedSqueals },
            })
            .sort({ publicationDate: -1 })
              .limit(10)
              .exec();;
            //sort the squeals by date
            squeals.sort((a, b) => b.publicationDate.getTime() - a.publicationDate.getTime());
            //for each squeal in the array get the related user document
            let squealDocuments: SquealReturn[] = [];
            for (let i = 0; i < squeals.length; i++) {
              const userDocument = await this.userService.getUserById(squeals[i].senderId);
              if (userDocument) {
                squealDocuments.push({ squeal: squeals[i], user: userDocument });
              }
            }
            //sort the squeals by date
            //return the first 10 squeals
            return squealDocuments;
          } catch(error){
            console.log(error);
          }
          }

          /*
            function to return a maximum of 10 squeal in which the user is tagged
          */
          async getTaggedSqueals(userId:string){
            try{
            const squeals = await this.squealModel.find(
              {mentionedUserIds: userId, publicationDate: { $ne: null }}
              );
            //sort the squeals by date
            squeals.sort((a, b) => b.publicationDate.getTime() - a.publicationDate.getTime());
            let userTaggedSqueals: SquealReturn[] = [];
            for (let i = 0; i < squeals.length; i++) {
              const userDocument = await this.userService.getUserById(squeals[i].senderId);
              if (userDocument) {
                userTaggedSqueals.push({ squeal: squeals[i], user: userDocument });
              }
            }
            //return the first 10 squeals
            if(userTaggedSqueals.length > 10){
              userTaggedSqueals.slice(0, 10);
            }
            return userTaggedSqueals;
          } catch(error){
            console.log(error);
          }
          }

          async getPrivateSqueals(userId: string) : Promise<SquealReturn[]>{
            try{
              const user = await this.userService.getUserById(userId);
              const squeals = await this.squealModel.find({
                destinationUserIds: userId, 
                publicationDate: { $ne: null },
                _id: { $nin: user.visualizedSqueals },
              })
              .sort({ publicationDate: -1 })
              .limit(20)
              .exec();
                ;
              let userPrivateSqueals: SquealReturn[] = [];
              for (let i = 0; i < squeals.length; i++) {
                const userDocument = await this.userService.getUserById(squeals[i].senderId);
                if (userDocument) {
                  userPrivateSqueals.push({ squeal: squeals[i], user: userDocument });
                }
              }
              return userPrivateSqueals;
            } catch(error){
              console.log(error);
            }
          }

          async getPrivateFeed(userId: string) : Promise<SquealReturn[]>{
            try{
              const user = await this.userService.getUserById(userId);
              const squeals = await this.squealModel.find({
                destinationUserIds: userId, 
                publicationDate: { $ne: null },
              })
              .sort({ publicationDate: -1 })
              .limit(50)
              .exec();
                ;
              let userPrivateSqueals: SquealReturn[] = [];
              for (let i = 0; i < squeals.length; i++) {
                const userDocument = await this.userService.getUserById(squeals[i].senderId);
                if (userDocument) {
                  userPrivateSqueals.push({ squeal: squeals[i], user: userDocument });
                }
              }
              return userPrivateSqueals;
            } catch(error){
              console.log(error);
            }
          }
        
          /*
            function to return the 50th most popular squeal ordinatedes by the sum of the reactions, commentds and date
          */
          getSquealPopularity(squeal: SquealDocument){
              return squeal.reactions.length + squeal.comments.length;
          }
          async getPopularSqueals(userId: string) {
            try{

            const user = await this.userService.getUserById(userId);
            // squeals published in the last month which are public 
            const squeals = await this.squealModel.find({
              publicationDate: {
                $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
              },
              isPublic: true,
              _id: { $nin: user.visualizedSqueals },
            })
            .sort({ publicationDate: -1 })
            .limit(50)
            .exec();
            //sort the squeals by their popularity
            let userPopularSqueals: SquealReturn[] = [];
            for (let i = 0; i < squeals.length; i++) {
              const userDocument = await this.userService.getUserById(squeals[i].senderId);
              if (userDocument) {
                userPopularSqueals.push({ squeal: squeals[i], user: userDocument });
              }
            }
            //return the first 50 squeals
            
            return userPopularSqueals;
          } catch(error){
            console.log(error);
          }
          }

          async getOfficialChannelSqueals() : Promise<SquealReturn[]>{
            //take all the official channels
            const channels = await this.channelsService.getAllOfficialChannels();
            let squeals = [];
            //for each channel take the squeals
            for(let i = 0; i < channels.length; i++){
              squeals.push((await this.channelsService.getChannelSqueals(channels[i]._id)));
            }
            //get the squeals documents
            squeals = squeals.slice(-10);
            let squealDocuments = [];
            for(let i = 0; i < squeals.length; i++){
              squealDocuments.push(await this.getSquealById(squeals[i]));
            }
            let userOfficialChannelSqueals: SquealReturn[] = [];
            for (let i = 0; i < squealDocuments.length; i++) {
             if(squealDocuments[i] != null){
              const userDocument = await this.userService.getUserById((squealDocuments[i].senderId));
              if (userDocument) {
                userOfficialChannelSqueals.push({ squeal: squealDocuments[i], user: userDocument });
              }
             }

            }
            //return the first 10 squeals
            if(userOfficialChannelSqueals.length > 10){
              userOfficialChannelSqueals.slice(0, 10);
            } else {
              return userOfficialChannelSqueals;
            }

          }
          
          
          /*
            function to return the user feed
          */
// squeal.service.ts
async getUserFeed(userId: string, pageNumber: number): Promise<SquealReturn[]> {
  if (!userId) {
    return await this.getPublicFeed();
  }

  if (!this.cachedPostsMap.has(userId) || this.cachedPostsMap.get(userId).length === 0 || pageNumber == 0) {
    // If the cache doesn't exist or is empty, generate the feed
    await this.generateUserFeed(userId);
  }

  // Retrieve the feed from the cache
  const cachedFeed = this.cachedPostsMap.get(userId);

  // Calculate the start and end index for the requested page
  var pageSize = 20;
  var startIndex = pageNumber * pageSize;
  var endIndex = startIndex + pageSize;

  // If the requested page is beyond the current cached feed, regenerate and update the cache
  if (startIndex >= cachedFeed.length) {
    await this.generateUserFeed(userId);
  }


  // Return the slice of the cached feed based on the page number
  return cachedFeed.slice(startIndex, endIndex);
}

async generateUserFeed(userId: string){
  if (!userId) return await this.getPublicFeed();

  let feed: SquealReturn[] = [];
  const channelSqueal = await this.getChannelFeed(userId);
  const popularSqueals = await this.getPopularSqueals(userId);
  const privateSendSqueals = await this.getPrivateSqueals(userId);
  const publicSqueals = await this.getPublicSqueals(userId);
  const getOfficialChannelSqueals = await this.getOfficialChannelSqueals();
  feed = feed.concat(channelSqueal);
  feed = feed.concat(popularSqueals);
  feed = feed.concat(privateSendSqueals);
  feed = feed.concat(publicSqueals);
  feed = feed.concat(getOfficialChannelSqueals);

  //randomize the feed
  //feed.sort(() => Math.random() - 0.5);
  
  for(let i = 0; i < feed.length; i++){
    //sort the squeals by date if publicationDate is not null
    if(feed[i].squeal.publicationDate != null){
      feed.sort((a, b) => b.squeal.publicationDate.getTime() - a.squeal.publicationDate.getTime());
    } 
  }
  let fillerSqueals: SquealReturn[] = [];
  if(feed.length < 100){
     fillerSqueals = await this.getFillerSqueals(100 - feed.length);
     for(let i = 0; i < fillerSqueals.length; i++){
        //sort the squeals by date if publicationDate is not null
        if(fillerSqueals[i].squeal.publicationDate != null){
          fillerSqueals.sort((a, b) => b.squeal.publicationDate.getTime() - a.squeal.publicationDate.getTime());
        } 
      }
     feed = feed.concat(fillerSqueals);
  }

  //check if there are duplicates and remove them
  const feedWithoutDuplicates = feed.reduce((uniqueFeed, currentSqueal) => {
    // Check if an object with the same id already exists in uniqueFeed
    const existingSqueal = uniqueFeed.find((s) => String(s.squeal._id) == String(currentSqueal.squeal._id));
  
    // If not, add the currentSqueal to uniqueFeed
    if (!existingSqueal) {
      uniqueFeed.push(currentSqueal);
    }
  
    return uniqueFeed;
  }, []);
  this.cachedPostsMap.set(userId, feedWithoutDuplicates);
}

async getFillerSqueals(number: number){
  try{
  const squeals = await this.squealModel
    .find({
      publicationDate: { $ne: null },
      isPublic: true,
    })
    .sort({ publicationDate: -1 })
    .limit(number)
    .exec();
  let userPublicSqueals: SquealReturn[] = [];
  for (let i = 0; i < squeals.length; i++) {
    var userDocument = null;
    if(squeals[i] != null && squeals[i].senderId) userDocument = await this.userService.getUserById(squeals[i].senderId);
    if (userDocument) {
      userPublicSqueals.push({ squeal: squeals[i], user: userDocument });
    }
  }
  return userPublicSqueals;
} catch(error){
  console.log(error);
}
}


         async getPublicFeed() : Promise<SquealReturn[]>{
          try{
          const squeals = await this.squealModel.find({publicationDate: { $ne: null }, isPublic: true});
          squeals.sort((a, b) => b.publicationDate.getTime() - a.publicationDate.getTime());
          let userPublicSqueals: SquealReturn[] = [];
          for (let i = 0; i < squeals.length; i++) {
            const userDocument = await this.userService.getUserById(squeals[i].senderId);
            if (userDocument) {
              userPublicSqueals.push({ squeal: squeals[i], user: userDocument });
            }
          }
        
          if(userPublicSqueals.length > 10){
            userPublicSqueals.slice(0, 10);
          }
          //add the official channel squeals
          const officialChannelSqueals = await this.getOfficialChannelSqueals();
          userPublicSqueals = userPublicSqueals.concat(officialChannelSqueals);
          //sort the squeals by date
          userPublicSqueals.sort((a, b) => b.squeal.publicationDate.getTime() - a.squeal.publicationDate.getTime());
          return userPublicSqueals;
        } catch(error){
          console.log(error);
        }
         }

         async addReactionToSqueal(squealId: string, reaction: string, userId: string) {
          try{
          const squeal = await this.getSquealById(squealId);
          const user = await this.userService.getUserById(userId);
          if (!user) {
            throw new Error('User not found');
          }

          // Check if the user has already reacted to the squeal 
          var newReactions = squeal.reactions.filter(reactionObj => reactionObj.user.username !== user.username);

          if(newReactions.length === squeal.reactions.length){
            this.positiveReactions.includes(reaction) ? 
              await this.notificationsService.createPositiveReactionNotification({
                senderId: userId,
                receiversId: [squeal.senderId],
                senderName: user.username,
                senderType: 'user',
                notificationType: NotificationType.POS_REAC
              }) :
              await this.notificationsService.createNegativeReactionNotification({
                senderId: userId,
                receiversId: [squeal.senderId],
                senderName: user.username,
                senderType: 'user',
                notificationType: NotificationType.NEG_REAC
              })
          }
          newReactions.push({type: reaction, user: user});
          squeal.reactions = [...newReactions];
          let views = squeal.views;
          let positiveReactions = 0;
          let negativeReactions = 0;
          let cm = 0.25 * views;
          for(let i = 0; i < squeal.reactions.length; i++){
            if(this.positiveReactions.includes(squeal.reactions[i].type)){
              positiveReactions++;
            } else {
              negativeReactions++;
            }
          }
          let total_reactions = squeal.reactions.length;
          let total_views = squeal.views;
          const soglia_reaction = 10;
          const soglia_views = 15;
          if(total_reactions > soglia_reaction && total_views > soglia_views){
            if(positiveReactions > cm && negativeReactions > cm ){ 
              squeal.classification = SQUEAL_CLASSIFICATION.CONTROVERSO;
              await squeal.save();
            } else if(positiveReactions > cm && squeal.classification != SQUEAL_CLASSIFICATION.POPOLARE ){
              squeal.classification = SQUEAL_CLASSIFICATION.POPOLARE;
              await squeal.save();
              
                let count = 0;
                let userSqueals = await this.getSquealsByUserId(userId, 'REGISTERED');
                for(let i = 0; i<userSqueals.length; i++){
                  if(userSqueals[i].classification == SQUEAL_CLASSIFICATION.POPOLARE){
                    count++;
                  }
                }
                if(count > 0 && count % 10 == 0){
                  await this.basicUserService.incrementBaseQuota(userId);
                }
              
            } else if(negativeReactions > cm && squeal.classification != SQUEAL_CLASSIFICATION.IMPOPOLARE){
              squeal.classification = SQUEAL_CLASSIFICATION.IMPOPOLARE;
              await squeal.save();
  
              let count = 0;
              let userSqueals = await this.getSquealsByUserId(userId, 'REGISTERED');
              for(let i = 0; i<userSqueals.length; i++){
                if(userSqueals[i].classification == SQUEAL_CLASSIFICATION.IMPOPOLARE){
                  count++;
                }
              }
              console.log('numero post impopolari contati: ' + count);
              if(count > 0 && count % 3 == 0){
                console.log('decremento');
                await this.basicUserService.decrementBaseQuota(userId);
              }
            } else {
              squeal.classification = SQUEAL_CLASSIFICATION.NORMALE;
              await squeal.save();
            }
          } else {
            squeal.classification = SQUEAL_CLASSIFICATION.NORMALE;
            await squeal.save();
          }
         let squealUser : SquealReturn = undefined
          const userDocument = await this.userService.getUserById(squeal.senderId);
          if (userDocument) {
            squealUser = ({ squeal: squeal, user: userDocument });
          }

          return squealUser;
        } catch(error){
          console.log(error);
        }
        }
        
        //Remove a reaction from a squeal
        async removeReactionFromSqueal(squealId: string, reaction: string, userId: string) {
          const squeal = await this.getSquealById(squealId);

          // Find the reaction to remove
          const reactionToRemove = squeal.reactions.find(reactionObj => reactionObj.type === reaction && reactionObj.user._id === userId);
          // Remove the reaction from the squeal
          if (reactionToRemove) {
            squeal.reactions = squeal.reactions.filter(reactionObj => reactionObj !== reactionToRemove);
          }
          await squeal.save();
          let squealUser : SquealReturn = undefined
          const userDocument = await this.userService.getUserById(squeal.senderId);
          if (userDocument) {
            squealUser = ({ squeal: squeal, user: userDocument });
          }

          return squealUser;
          return squealUser;
        }

        async addCommentToSqueal(squealId: string, commentText: string, userId: string) : Promise<SquealReturn>{
          try{
          const squeal = await this.getSquealById(squealId);
          const user = await this.userService.getUserById(userId);
          if (!user) {
            throw new Error('User not found');
          }
          squeal.comments.push({text: commentText, user: user, date: new Date()});
          await this.notificationsService.createNewCommentNotification({
            senderId: userId,
            receiversId: [squeal.senderId],
            senderName: user.username,
            senderType: 'user',
            notificationType: NotificationType.NEW_COMM
          })
          await squeal.save();
          let squealUser : SquealReturn = undefined
          const userDocument = await this.userService.getUserById(squeal.senderId);
          if (userDocument) {
            squealUser = ({ squeal: squeal, user: userDocument });
          }

          return squealUser;
        } catch(error){
          console.log(error);
        }
        }
      
         /*
          function to return the squeals of a user
         */
          async getSquealsByUserId(userId: string, userType: string){
            try {
            if(userType == 'UNREGISTERED'){
              const squeals = await this.squealModel.find({senderId: userId, publicationDate: { $ne: null }, isPublic: true});
              return squeals;
            }
            const squeals = await this.squealModel.find({senderId: userId});
            //sort the squeals by date
           // squeals.sort((a, b) => b.publicationDate.getTime() - a.publicationDate.getTime());
            return squeals;
          } catch(error){
            console.log(error);
          }
          }

          async getSquealReturnByUserId(userId: string, userType: string){
            try{
            let squeals = null;
            if(userType == 'UNREGISTERED'){
              squeals = await this.squealModel.find({senderId: userId, publicationDate: { $ne: null }, isPublic: true});
            } else {
              squeals = await this.squealModel.find({senderId: userId, publicationDate: { $ne: null }});
            }
            let squealDocuments: SquealReturn[] = [];
            for (let i = 0; i < squeals.length; i++) {
              const userDocument = await this.userService.getUserById(squeals[i].senderId);
              if (userDocument) {
                squealDocuments.push({ squeal: squeals[i], user: userDocument });
              }
            }
            //sort the squeals by date
            squealDocuments.sort((a, b) => b.squeal.publicationDate.getTime() - a.squeal.publicationDate.getTime());
            return squealDocuments;
          } catch(error){
            console.log(error);
          }
          }

          async uploadImage(squeal: SquealDocument, file: FileUpload): Promise<boolean> {
            const { createReadStream, filename } = await file;
    
            const filePath = `${ActivePath}/squeals/uploads/${filename}`;
            await createReadStream()
              .pipe(createWriteStream(filePath));
    
            try {
              squeal.uploadedFile = 'https://site222344.tw.cs.unibo.it/squealUploads/' + filename;
              await squeal.save();
              return true;
            } catch (error) {
              console.error('Error uploading image:', error);
              return false;
          }
    
      }
      
      /*Fuction to get all the squeals which contain a certain string */
      async getSquealsByText(text: string){
        try{
        const squeals = await this.squealModel.find({text: {$regex: text, $options: 'i'}});
        let squealDocuments: SquealReturn[] = [];
        for (let i = 0; i < squeals.length; i++) {
          const userDocument = await this.userService.getUserById(squeals[i].senderId);
          if (userDocument) {
            squealDocuments.push({ squeal: squeals[i], user: userDocument });
          }
        }
        //sort the squeals by date
        squealDocuments.sort((a, b) => b.squeal.publicationDate.getTime() - a.squeal.publicationDate.getTime());
        return squealDocuments;
      } catch(error){
        console.log(error);
      }
      }

      async addLocationToSqueal(squealId: string, longitude: GLfloat, latitude: GLfloat){
        const squeal = await this.getSquealById(squealId);
        squeal.geolocation = {longitude: longitude, latitude: latitude};
        await squeal.save();
        let squealUser : SquealReturn = undefined
        const userDocument = await this.userService.getUserById(squeal.senderId);
        if (userDocument) {
          squealUser = ({ squeal: squeal, user: userDocument });
        }

        return squealUser;
      }

      

      @Cron("*/20 * * * * *", {name: 'postTemporizedSqueals'})
      async postTemporizedSqueals(){
        try{
        const currentDateTime = new Date();
        const twoMinutesAgo = new Date(currentDateTime.getTime() - 1 * 23 * 1000); // 23 secs ago

        // Find posts with publicationDate between two minutes ago and now
        const squealsToPublish = await this.squealModel.find({
          publicationAnticipation: { $gte: twoMinutesAgo, $lte: currentDateTime },
          publicationDate: null
        });


        for (var squeal of squealsToPublish) {
          var user;
          try{
            user = await this.userService.getUserById(squeal.senderId);
          } catch(error){
            console.log("utente di temporizzato non trovaot");
          }
          var squealCost;
          if(squeal.destinationUserIds.length > 0) squealCost = 0;
          else squealCost = (squeal.text.length);
          if(squealCost > await this.userService.getCharLimit(squeal.senderId))
            continue;
          squeal.publicationDate = currentDateTime;
          if(squeal.keyword){
            try{
              if(squeal.text.length > 0) 
                await this.notifiyMentions(squeal.text, user.username, squeal.senderId);
            } catch(error) {
              console.log("errore nel mandare menzioni");
            }
            //check if a temporary channel with that keyword already exists
            const channel = await this.channelsService.getTemporaryChannel(squeal.keyword);
            if(!channel){
              //create a temporary channel with that keyword
              await this.channelsService.createTemporaryChannel(squeal.keyword, squeal.senderId, squeal._id);
            } else {
              await this.channelsService.addSquealToTemporaryChannel(channel.keyword, squeal._id)
            }
          } else if (squeal.destinationChannels.length > 0) await this.channelsService.addSquealToChannel(squeal.destinationChannels[0], squeal._id);
          if(squeal.destinationChannels.length == 0 && squeal.destinationUserIds.length == 0){
            try{
              if(squeal.text.length > 0) 
                await this.notifiyMentions(squeal.text, user.username, squeal.senderId);
            } catch(error) {
              console.log("errore nel mandare menzioni");
            }
          }
          await this.userService.addSquealToUser(squeal.senderId, squeal._id, squealCost);
          await squeal.save();          
        }
      } catch(error){
        console.log(error);
      }
      }
      

      async getSquealsByChannelId(channelId: string){
        try{
        const squeals = await this.squealModel.find({destinationChannels: channelId});
        //sort the squeals by date
        squeals.sort((a, b) => b.publicationDate.getTime() - a.publicationDate.getTime());
        //for each squeal in the array get the related user document
        let squealDocuments: SquealReturn[] = [];
        for (let i = 0; i < squeals.length; i++) {
          const userDocument = await this.userService.getUserById(squeals[i].senderId);
          if (userDocument) {
            squealDocuments.push({ squeal: squeals[i], user: userDocument });
          }
        }
        return squealDocuments;
      } catch(error){
        console.log(error);
      }
      }

      async getNonPrivateSqueals(userId: string){
        try{
        const user = await this.userService.getUserById(userId);
        if(!user) throw new Error("Utente non trovato");

        const squeals = await this.squealModel.find({ destinationUserIds: { $exists: true, $size: 0 }, senderId: userId });
        return squeals;
      } catch(error){
        console.log(error);
      }
      }



      /**
       * UTILITY
       */

      async parseText(text) {
        // Define regular expressions for the patterns '{NUM}', '{TIME}', and '{DATE}'
        const numRegex = /\{NUM\}/;
        const timeRegex = /\{TIME\}/;
        const dateRegex = /\{DATE\}/;
    
        // Check if each pattern is present in the text
        const numPresent = numRegex.test(text);
        const timePresent = timeRegex.test(text);
        const datePresent = dateRegex.test(text);
    
        // Return the results
        return { numPresent, timePresent, datePresent };
    }


    /**
     * 
     * @param date 
     * 
     * returns: given date, returns HH:MM
     */
    async getHour(date: Date){
      return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    }
    
    /**
     * 
     * @param date 
     * 
     * returns: given date, returns DD/MM/YYYY
     */
    async getDate(date: Date){
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
      const year = date.getFullYear().toString();

      return `${day}-${month}-${year}`;
    }

    async getUserPublicSqueals(senderId: string): Promise<SquealReturn[]> {
      try{
      const squeals = await this.squealModel.find({ senderId: senderId, isPublic: true });
      let userPublicSqueals: SquealReturn[] = [];
    
      for (let i = 0; i < squeals.length; i++) {
        const userDocument = await this.userService.getUserById(squeals[i].senderId);
        if (userDocument) {
          userPublicSqueals.push({ squeal: squeals[i], user: userDocument });
        }
      }
      return userPublicSqueals;
    } catch(error){
      console.log(error);
    }
    }

  

    async addVisualizedSqueal(userId: string, squealId: string){
      try{
      const squeal = await this.getSquealById(squealId);
      if(!squeal) throw new Error("Squeal non trovato");

      if(!await this.basicUserService.addVisualizedSqueal(userId, squealId)){
        squeal.views += 1;
      }

      await squeal.save();
      return true;
    } catch(error){
      console.log(error);
    }
    }

    async classifyUserSqueals(userId: string){
      const user = await this.userService.getUserById(userId);
      const squeals = await this.getSquealsByUserId(userId, 'REGISTERED');
      ///filter to take only the one with publicationDate != null
      squeals.filter(squeal => squeal.publicationDate != null);
      squeals.filter(squeal => squeal.publicationDate.getTime() > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).getTime());
      let numberOfControversi = 0 ;
      let numberOfPopolari = 0;
      let numberOfImpopolari = 0;
      let numberOfNormali = 0;
      let totalViews = 0;
      for(let i = 0; i < squeals.length; i++){
        if(squeals[i].classification == SQUEAL_CLASSIFICATION.CONTROVERSO) numberOfControversi++;
        else if(squeals[i].classification == SQUEAL_CLASSIFICATION.POPOLARE) numberOfPopolari++;
        else if(squeals[i].classification == SQUEAL_CLASSIFICATION.IMPOPOLARE) numberOfImpopolari++;
        else if(squeals[i].classification == SQUEAL_CLASSIFICATION.NORMALE) numberOfNormali++;
        totalViews += squeals[i].views; 
      }
      //create a formula to calculate the popularity index based on: number of controversial squeals, number of popular squeals, number of unpopular squeals, number of normal squeals and number of visualizations
      const weightPopolari = 0.4; 
      const weightVisuals = 0.3; 
      const weightControversi = 0.2;
      const weightNormali = 0.05;
      const weightImpopolari = -0.05; 
      
      const popularityIndex = (
          (numberOfControversi * weightControversi) +
          (numberOfPopolari * weightPopolari) +
          (numberOfImpopolari * weightImpopolari) +
          (numberOfNormali * weightNormali) +
          (totalViews * weightVisuals)
      );
      user.popularityIndex = popularityIndex;
      try{
      await user.save();
      } catch(error){
        console.log(error);
      }
     }
  
    async setTrendingIndex(){
      const users = await this.userService.getAllBasicUsers();
      for(let i = 0; i < users.length; i++){
        await this.classifyUserSqueals(users[i].id);
      }
    }
// Modifica la tua funzione getTrendingSqueals in squeal.service.ts
async getTrendingSqueals(): Promise<SquealReturn[]> {
  try{
  const squeals = await this.squealModel.find({ publicationDate: { $ne: null }, isPublic: true }) || [];
  squeals.filter(squeal => squeal.publicationDate.getTime() > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).getTime());
  squeals.sort((a, b) => (b.views + b.reactions.length + b.comments.length) - (a.views + a.reactions.length + a.comments.length));
  let trendingSqueals: SquealReturn[] = [];
  for (let i = 0; i < squeals.length; i++) {
    const userDocument = await this.userService.getUserById(squeals[i].senderId);
    if (userDocument) {
      trendingSqueals.push({ squeal: squeals[i], user: userDocument });
    }
  }
  return trendingSqueals;
} catch(error){
  console.log(error);
}
}

async getTopUsers(){
  //return the top 5 users who has the most positive squeals percentage
  const users = await this.userService.getAllBasicUsers();
  //sort the user by the number of positive squeals, total views, positive reactions 
  let positiveUsers = []
 for(let i = 0; i < users.length; i++){
    //count the user positive squeals
    let positiveSqueals = 0;
    const squeals = await this.getSquealsByUserId(users[i].id, 'REGISTERED');
    for(let j = 0; j < squeals.length; j++){
      if(squeals[j].classification == SQUEAL_CLASSIFICATION.POPOLARE) positiveSqueals++;
    }
    /*
    if(positiveSqueals > 10 && positiveSqueals > squeals.length * 0.6){
      //insert the user in the positiveUsers array based on the number of positive squeals
      positiveUsers.push({user: users[i], positiveSqueals: positiveSqueals});
      //sort the array
      positiveUsers.sort((a, b) => b.positiveSqueals - a.positiveSqueals);
    }*/
    //just for now put everyone
    positiveUsers.push({user: users[i], positiveSqueals: positiveSqueals});
    //sort the array
    positiveUsers.sort((a, b) => b.positiveSqueals - a.positiveSqueals);
 }

 //create a new array to save only the users
  let topUsers = [];
  for(let i = 0; i < positiveUsers.length; i++){
    topUsers.push(positiveUsers[i].user);
  }
  if(topUsers.length > 5){
    topUsers.slice(0, 5);
  } else {
    return topUsers;
  }
}

async getAllSqueals(){
  try{
  const squeals = await this.squealModel.find();
  let squealDocuments: SquealReturn[] = [];
  for (let i = 0; i < squeals.length; i++) {
    const userDocument = await this.userService.getUserById(squeals[i].senderId);
    if (userDocument) {
      squealDocuments.push({ squeal: squeals[i], user: userDocument });
    }
  }
  return squealDocuments;
} catch(error){
  console.log(error);
}
}

async getPopularSquealsMod(userId: string){
  //get the squeals with most positive reactions
  try{
  let squeals = [] 
  if(userId) squeals =  await this.getSquealsByUserId(userId, 'REGISTERED')
  else squeals = await this.squealModel.find({ publicationDate: { $ne: null } }) || [];

  let squealDocuments = [];

  for(let i = 0; i < squeals.length; i++){
    if(!squeals[i]) continue;
    let positiveReactions = 0;
    for(let j = 0; j < squeals[i].reactions.length; j++){
    
      if(this.positiveReactions.includes(squeals[i].reactions[j].type)){
        positiveReactions++;
      }
    }
   //save the squeal, the user and the number of positive reactions
    squealDocuments.push({ squeal: squeals[i], user: await this.userService.getUserById(squeals[i].senderId), positiveReactions: positiveReactions });
  }
  //sort the squeals by the number of positive reactions
  squealDocuments.sort((a, b) => b.positiveReactions - a.positiveReactions);
  //take only the user and the squeal
  let returnsSqueal : SquealReturn[] = [];
  for(let i = 0; i < squealDocuments.length; i++){
    returnsSqueal.push({ squeal: squealDocuments[i].squeal, user: squealDocuments[i].user });
  }
  return returnsSqueal;
} catch(error){
  console.log(error);
}
}

async getUnpopularSquealsMod( userId: string){
  try{
  let squeals = [] 
  if(userId) squeals =  await this.getSquealsByUserId(userId, 'REGISTERED')
  else squeals = await this.squealModel.find({ publicationDate: { $ne: null } }) || [];

  let squealDocuments = [];
  for(let i = 0; i < squeals.length; i++){
    let negativeReactions = 0;
    for(let j = 0; j < squeals[i].reactions.length; j++){
      if(!this.positiveReactions.includes(squeals[i].reactions[j].type)){
        negativeReactions++;
      }
    }
   //save the squeal, the user and the number of positive reactions
    squealDocuments.push({ squeal: squeals[i], user: await this.userService.getUserById(squeals[i].senderId), negativeReactions: negativeReactions });
  }
  //sort the squeals by the number of positive reactions
  squealDocuments.sort((a, b) => b.negativeReactions - a.negativeReactions);
  //take only the user and the squeal
  let returnsSqueal : SquealReturn[] = [];
  for(let i = 0; i < squealDocuments.length; i++){
    returnsSqueal.push({ squeal: squealDocuments[i].squeal, user: squealDocuments[i].user });
  }
  return returnsSqueal;
} catch(error){
  console.log(error);
}
  
}

//get all the squeals of a user
async getUserSqueals(username: string, popular: boolean, unpopular: boolean, date: string, destinationUserUsername: string ){
  try{
  let squealDocuments  = [];
  let userId = undefined;

  if(username){
    const user = await this.userService.getUserByUsername(username);
    if(!user) throw new Error("User not found");
    userId = user.id;
    let userSqueals = await this.getSquealsByUserId(userId, 'REGISTERED');
    for(let i = 0; i < userSqueals.length; i++){
      squealDocuments.push({ squeal: userSqueals[i], user: user });
    }
  } 
  else squealDocuments = await this.getAllSqueals();

  if(date){
    const selectedDate = new Date(date);
    squealDocuments = squealDocuments.filter(squeal => squeal.squeal.publicationDate >= selectedDate);
  }
  if(destinationUserUsername){
    const destinationUser= await this.userService.getUserByUsername(destinationUserUsername);
    if(!destinationUser) throw new Error("User not found");
    const destinationUserId = destinationUser.id;
    squealDocuments = squealDocuments.filter(squeal => squeal.squeal.destinationUserIds.includes(destinationUserId));
  }
  //sort the squeals by popularity
  if(popular){
    squealDocuments = await this.getPopularSquealsMod(userId);
  } else if(unpopular){
    squealDocuments = await this.getUnpopularSquealsMod(userId);
  } else {
    squealDocuments.sort((a, b) => {
      const publicationDateA = a.squeal?.publicationDate || 0;
      const publicationDateB = b.squeal?.publicationDate || 0;
      return publicationDateB - publicationDateA;
    });
    
  }
  //check if there is a null squeal
  squealDocuments = squealDocuments.filter(squeal => squeal.squeal != null && squeal.user != null);
  return squealDocuments;
} catch(error){
  console.log(error);
}
}


async addDestinationToSqueal(squealId: string, destinationUsers: string [], destinationChannels: string[]): Promise<SquealReturn>{
  try{
  const squeal = await this.getSquealById(squealId);
  if(!squeal) throw new Error("Squeal not found");
  if(destinationUsers){
  for(let i = 0; i < destinationUsers.length; i++){
    const user = await this.userService.getUserByUsername(destinationUsers[i]);
    if(!user) throw new Error("User not found");
    if(!squeal.destinationUserIds.includes(user.id)) squeal.destinationUserIds.push(user.id);
  }
}
if(destinationChannels){
  for(let i = 0; i < destinationChannels.length; i++){
    const channel = await this.channelsService.getChannelByName(destinationChannels[i]);
    if(!channel) throw new Error("Channel not found");
    if(!squeal.destinationChannels.includes(channel._id)){
      squeal.destinationChannels.push(channel._id);
      this.channelsService.addSquealToChannel(channel._id, squeal._id);
    }
  }
}
  await squeal.save();
  let squealUser : SquealReturn = undefined;
  const userDocument = await this.userService.getUserById(squeal.senderId);
  if (userDocument) {
    squealUser = ({ squeal: squeal, user: userDocument });
  }
  return squealUser;
} catch(error){
  console.log(error);
}
}

async removeDestinationFromSqueal(squealId: string, destinationUsers: string [], destinationChannels: string[]){
  try{
  const squeal = await this.getSquealById(squealId);
  if(!squeal) throw new Error("Squeal not found");
  if(destinationUsers){
    for(let i = 0; i < destinationUsers.length; i++){
      const user = await this.userService.getUserByUsername(destinationUsers[i]);
      if(!user) throw new Error("User not found");
      squeal.destinationUserIds = squeal.destinationUserIds.filter(userId => userId != user.id);
    }
  }
  if(destinationChannels){
    for(let i = 0; i < destinationChannels.length; i++){
      const channel = await this.channelsService.getChannelByName(destinationChannels[i]);
      if(!channel) throw new Error("Channel not found");
      squeal.destinationChannels = squeal.destinationChannels.filter(channelId => channelId != channel._id);
      channel.squeals = channel.squeals.filter(squealId => squealId != squeal._id);
    }
  }
  await squeal.save();
  let squealUser : SquealReturn = undefined;
  const userDocument = await this.userService.getUserById(squeal.senderId);
  if (userDocument) {
    squealUser = ({ squeal: squeal, user: userDocument });
  }
  return squealUser;
} catch(error){
  console.log(error);
}
}



//function to add new reactions to a squeal
async addNewReactionToSqueal(squealId: string, reaction: string, userId: string, numberOfReactions: number){
  try{
  const squeal = await this.getSquealById(squealId);
  let senderId = squeal.senderId;
  if(!squeal) throw new Error("Squeal not found");
  const user = await this.userService.getUserById(userId);
  if (!user) {
    throw new Error('User not found');
  }
  for(let i = 0; i < numberOfReactions; i++){
    squeal.reactions.push({type: reaction, user: user});
    await squeal.save();
  }
  let views = squeal.views;
  let positiveReactions = 0;
  let negativeReactions = 0;
  let cm = 0.25 * views;
  for(let i = 0; i < squeal.reactions.length; i++){
    if(this.positiveReactions.includes(squeal.reactions[i].type)){
      positiveReactions++;
    } else {
      negativeReactions++;
    }
  }
  console.log('pos: ' + positiveReactions + ' neg: ' + negativeReactions + ' cm: ' + cm)

  let total_reactions = squeal.reactions.length;
  let total_views = squeal.views;
  const soglia_reaction = 0;
  const soglia_views = 0;
  if(total_reactions > soglia_reaction && total_views >= soglia_views){
    if(positiveReactions > cm && negativeReactions > cm ){ 
      console.log("controverso");
      squeal.classification = SQUEAL_CLASSIFICATION.CONTROVERSO;
      await squeal.save();
    } else if(positiveReactions > cm && squeal.classification != SQUEAL_CLASSIFICATION.POPOLARE ){
      squeal.classification = SQUEAL_CLASSIFICATION.POPOLARE;
      await squeal.save();
      
        let count = 0;
        let userSqueals = await this.getSquealsByUserId(senderId, 'REGISTERED');
        for(let i = 0; i<userSqueals.length; i++){
          if(userSqueals[i].classification == SQUEAL_CLASSIFICATION.POPOLARE){
            count++;
          }
        }
        if(count > 0 && count % 10 == 0){
          await this.basicUserService.incrementBaseQuota(senderId);
        }
      
    } else if(negativeReactions > cm && squeal.classification != SQUEAL_CLASSIFICATION.IMPOPOLARE){
      squeal.classification = SQUEAL_CLASSIFICATION.IMPOPOLARE;
      await squeal.save();

      let count = 0;
      let userSqueals = await this.getSquealsByUserId(senderId, 'REGISTERED');
      for(let i = 0; i<userSqueals.length; i++){
        if(userSqueals[i].classification ==  SQUEAL_CLASSIFICATION.IMPOPOLARE){
          count++;
        }
      }
      if(count > 0 && count % 3 == 0){
        await this.basicUserService.decrementBaseQuota(senderId);
      }
    } else {
      squeal.classification = SQUEAL_CLASSIFICATION.NORMALE;
      await squeal.save();
    }
  } else {
    squeal.classification = SQUEAL_CLASSIFICATION.NORMALE;
    await squeal.save();
  }
 let squealUser : SquealReturn = undefined
  const userDocument = await this.userService.getUserById(squeal.senderId);
  if (userDocument) {
    squealUser = ({ squeal: squeal, user: userDocument });
  }

  return squealUser;
} catch(error){
  console.log(error);
}
}

//function to remove a reaction from a squeal
async removeReactionFromSquealMod(squealId: string, reaction: string, numberOfReactions: number){
  const squeal = await this.getSquealById(squealId);
  // remove the number of reactions from the squeal
  for(let i = 0; i < numberOfReactions; i++){
    for(let j = 0; j < squeal.reactions.length; j++){
      if(squeal.reactions[j].type == reaction){
        squeal.reactions.splice(j, 1);
        break;
      }
    }
  }
  await squeal.save();
  let squealUser : SquealReturn = undefined
  const userDocument = await this.userService.getUserById(squeal.senderId);
  if (userDocument) {
    squealUser = ({ squeal: squeal, user: userDocument });
  }

  return squealUser;
}

async removeSquealFromChannel(squealId: string, channelId: string){
  try{
  const squeal = await this.getSquealById(squealId);
  const channel = await this.channelsService.getChannelById(channelId);
  if(!squeal) throw new Error("Squeal not found");
  if(!channel) throw new Error("Channel not found");
  squeal.destinationChannels = squeal.destinationChannels.filter(channel => channel != channelId);
  //remove the squeal from the channel
  channel.squeals = channel.squeals.filter(squeal => squeal != squealId);
  await squeal.save();
  await channel.save();
  return true;
  } catch(error){
    console.log(error);
  }

}

//for each day in the last week, get the number of squeals


async getNumberOfSquealsPerWeek() {
  try {
  const numberOfSquealsPerWeek = [];

  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setUTCHours(0, 0, 0, 0);
    date.setUTCDate(date.getUTCDate() - i);

    const squeals = await this.squealModel.find({
      publicationDate: {
        $gte: date,
        $lt: new Date(date.getTime() + (24 * 60 * 60 * 1000)),
      },
    });

    numberOfSquealsPerWeek.push({
      date: date,
      number: squeals.length,
    });
  }

  return numberOfSquealsPerWeek;
  } catch(error){
    console.log(error);
  }

}


async getSquealsClassification(){
  try{
  const squeals = await this.squealModel.find({ publicationDate: { $ne: null } }) || [];
  let squealDocuments = [];
  let total_popolari = 0;
  let total_impopolari = 0;
  let total_controversi = 0;
  let total_normali = 0;
  for(let i = 0; i < squeals.length; i++){
    if(squeals[i].classification == SQUEAL_CLASSIFICATION.POPOLARE) total_popolari++;
    else if(squeals[i].classification == SQUEAL_CLASSIFICATION.IMPOPOLARE) total_impopolari++;
    else if(squeals[i].classification == SQUEAL_CLASSIFICATION.CONTROVERSO) total_controversi++;
    else if(squeals[i].classification == SQUEAL_CLASSIFICATION.NORMALE) total_normali++;
  }
  squealDocuments.push({type: SQUEAL_CLASSIFICATION.POPOLARE, number: total_popolari});
  squealDocuments.push({type: SQUEAL_CLASSIFICATION.IMPOPOLARE, number: total_impopolari});
  squealDocuments.push({type: SQUEAL_CLASSIFICATION.CONTROVERSO, number: total_controversi});
  squealDocuments.push({type: SQUEAL_CLASSIFICATION.NORMALE, number: total_normali});
  return squealDocuments;
} catch(error){
  console.log(error);
}
}
async getSquealsMonthData(userId: string) : Promise<MonthSqueals>{
  try{
  const currentDate = new Date();
  const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const endOfDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 1);

  var squeals = [];
  var squealsByDay;
  /**
   * Impopolari
   */
  squeals = await this.squealModel
    .find({
      publicationDate: { $gte: startOfMonth, $lt: endOfDay },
      senderId: userId,
      classification: 'Impopolare'
    })
    .exec();

  squealsByDay = this.groupSquealsByDay(squeals);
  const resultImpopular = this.fillInGapsForMonth(startOfMonth, endOfDay, squealsByDay);
  
  /**
   * Normali
   */
  squeals = await this.squealModel
    .find({
      publicationDate: { $gte: startOfMonth, $lt: endOfDay },
      senderId: userId,
      classification: 'Normale'
    })
    .exec();

  squealsByDay = this.groupSquealsByDay(squeals);
  const resultNormal = this.fillInGapsForMonth(startOfMonth, endOfDay, squealsByDay);

  /**
   * Popolari
   */
  squeals = await this.squealModel
    .find({
      publicationDate: { $gte: startOfMonth, $lt: endOfDay },
      senderId: userId,
      classification: 'Popolare'
    })
    .exec();

  squealsByDay = this.groupSquealsByDay(squeals);
  const resultPopular = this.fillInGapsForMonth(startOfMonth, endOfDay, squealsByDay);

  /**
   * Controversi
   */
  squeals = await this.squealModel
    .find({
      publicationDate: { $gte: startOfMonth, $lt: endOfDay },
      senderId: userId,
      classification: 'Controverso'
    })
    .exec();

  squealsByDay = this.groupSquealsByDay(squeals);
  const resultControverse = this.fillInGapsForMonth(startOfMonth, endOfDay, squealsByDay);
  return {
    controverse: resultControverse,
    normal: resultNormal,
    popular: resultPopular,
    impopular: resultImpopular
  }
} catch(error){
  console.log(error);
}
}

private groupSquealsByDay(squeals: SquealDocument[]){
  const result = {};

  squeals.forEach((squeal) => {
    const day = squeal.publicationDate.toISOString().slice(8, 10) + '-' + (squeal.publicationDate.getMonth() + 1);

    if (!result[day]) {
      result[day] = [];
    }

    result[day].push(squeal);
  });

  return result;
}

private fillInGapsForMonth(startOfMonth: Date, endOfMonth: Date, squealsByDay: any) {
  const result = [];

  let currentDate = new Date(startOfMonth);

  while (currentDate <= endOfMonth) {
    var dayNumber = currentDate.getDate();
    var trueNumber;
    if (dayNumber < 10) trueNumber = `0${dayNumber}`;
    else trueNumber = `${dayNumber}`
    const day = trueNumber + '-' + (currentDate.getMonth() + 1);

    if (currentDate.getMonth() === startOfMonth.getMonth() && currentDate.getFullYear() === startOfMonth.getFullYear()) {
      const squealsForDay = squealsByDay[day] || [];
      result.push({
        label: day,
        value: squealsForDay.length,
      });
    }

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return result;
}

async getTempChannelsSqueals(keyword: string){
  try{
  const channel = await this.channelsService.getTemporaryChannel(keyword);
  if(!channel) throw new Error("Channel not found");
  const squeals = await this.getSquealsByChannelId(channel._id);

  return squeals;
} catch(error){
  console.log(error);
}
}

async deleteTempChannelSqueals(keyword: string){
  try{
  const channel = await this.channelsService.getTemporaryChannel(keyword);
  if(!channel) throw new Error("Channel not found");
  for(let i = 0; i < channel.squeals.length; i++){
    await this.deleteSqueal(channel.squeals[i]);
  }
  return true;
} catch(error){
  console.log(error);
}
}

   //function to delete every temporary channel that has expired
   async deleteExpiredTemporaryChannels(){
    const channels = await this.channelsService.getAllTemporaryChannels();
    channels.forEach(channel => {
      if(channel.expireAt < new Date()){
        this.deleteTempChannelSqueals(channel.keyword);
        this.channelsService.deleteChannel(channel._id);
      }
    });
  }

  async addSquealsToOfficialChannels(){
    try{

    const channels = await this.channelsService.getAllOfficialChannels();
    if(!channels) throw new Error("Channels not found");
    const squeals = await this.squealModel.find({ publicationDate: { $ne: null }, isPublic: true }) || [];
    for(let i = 0; i < squeals.length; i++){
      if(squeals[i].classification == SQUEAL_CLASSIFICATION.POPOLARE){
        let channel = channels.find(channel => channel.name == 'POPOLARI');
        if(!channel) throw new Error("Channel not found");
        if(channel.squeals.includes(squeals[i]._id)) continue;
        squeals[i].destinationChannels.push(channel._id);
        await this.channelsService.addSquealToChannel(channel._id, squeals[i]._id);
        await squeals[i].save();
      } else if(squeals[i].classification == SQUEAL_CLASSIFICATION.IMPOPOLARE){
        let channel = channels.find(channel => channel.name == 'IMPOPOLARI');
        if(!channel) throw new Error("Channel not found");
        if(channel.squeals.includes(squeals[i]._id)) continue;
        squeals[i].destinationChannels.push(channel._id);
        await this.channelsService.addSquealToChannel(channel._id, squeals[i]._id);
        await squeals[i].save();
      } else if(squeals[i].classification == SQUEAL_CLASSIFICATION.CONTROVERSO){
        let channel = channels.find(channel => channel.name == 'CONTROVERSI');
        if(!channel) throw new Error("Channel not found");
        if(channel.squeals.includes(squeals[i]._id)) continue;
        squeals[i].destinationChannels.push(channel._id);
        await this.channelsService.addSquealToChannel(channel._id, squeals[i]._id);
        await squeals[i].save();
      }  else if(squeals[i].classification == SQUEAL_CLASSIFICATION.NORMALE){
        let channel = channels.find(channel => channel.name == 'RANDOM');
        if(!channel) throw new Error("Channel not found");
        if(channel.squeals.includes(squeals[i]._id)) continue;
          const random = Math.random();
          if(random > 0.8){
            squeals[i].destinationChannels.push(channel._id);
            await this.channelsService.addSquealToChannel(channel._id, squeals[i]._id);
            await squeals[i].save();
          } 
      }
    }
  } catch(error){
    console.log(error);
  }
  }

  async addTrendingSquealsToOfficialChannel(){
    try{
    const trendingChannel = await this.channelsService.getChannelByName('TRENDING');
    if(!trendingChannel) throw new Error("Channel not found");
    const squeals = await this.getTrendingSqueals();
    let squealDocs = [];
    for(let i = 0; i < squeals.length; i++){
      squealDocs.push(squeals[i].squeal);
    }
    for(let i = 0; i < squealDocs.length; i++){
      if(trendingChannel.squeals.includes(squealDocs[i]._id)) continue;
      squealDocs[i].destinationChannels.push(trendingChannel._id);
      await this.channelsService.addSquealToChannel(trendingChannel._id, squealDocs[i]._id);
      await squealDocs[i].save();
    }
  } catch(error){
    console.log(error);
  }
  }


  async postRandomNews() {
    try {
      const response = await axios.get('https://www.boredapi.com/api/activity');
      const activity = response.data;
      const channel = await this.channelsService.getChannelByName('BORED');
      if(!channel) throw new Error("Channel not found");
      const user = await this.userService.getUserByUsername('ccirone_moderator');
      if(!user) throw new Error("User not found");
      const userId = user.id;
      const channelId = channel._id;
      const squealInput = {
        text: activity.activity,
        destinationUserIds: [], 
        destinationChannels: [channelId], 
        typeOfUpload: null, 
        lat: null,
        lng: null,
        keyword: null,
        charactersCost: null, 
      };
  
      const file = null; 
      await this.createSqueal(squealInput, userId, file);
  
    } catch (error) {
      console.error(`Error: ${error}`);
    }
  }

  async notifiyMentions(text: string, senderName: string, senderId: string){
    const mentionRegex = /(?:^|\W)@(\w+(?:\.\w+)?)(?=[\s.,;!?]|$)/g;

    // Array to store matched mentions
    var mentions = [];

    // Executing the regular expression on the text
    let match;
    while ((match = mentionRegex.exec(text)) !== null) {
      mentions.push(match[1]);
    }

    mentions = await this.eliminateDuplicateMentions(mentions);

    for(var mention of mentions){
      try{
        const user = await this.userService.getUserByUsername(mention);
        if(user)  await this.notificationsService.createNewMentionNotification({
          senderId: senderId,
          senderName: senderName,
          senderType: 'user',
          notificationType: NotificationType.MEN,
          receiversId: [user._id.toString()],
        })
      } catch(err){
        continue
      } 
    }

    return true;
  }

  async eliminateDuplicateMentions(mentions) {
    // Use a Set to store unique mentions
    const uniqueMentionsSet = new Set(mentions);
  
    // Convert the Set back to an array
    const uniqueMentionsArray = [...uniqueMentionsSet];
  
    return uniqueMentionsArray;
  }

}



