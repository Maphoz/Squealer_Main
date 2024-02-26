import { BadRequestException, Inject, Injectable, InternalServerErrorException, NotFoundException, forwardRef } from '@nestjs/common';
import { Channel } from './models/channel.model';
import { Model, Types } from 'mongoose';
import { ChannelDocument } from './models/channel.schema';
import { InjectModel } from '@nestjs/mongoose';
import { UsersService } from 'src/users/users.service';
import { ChannelType } from './dto/types/channels.enum';
import { User } from 'src/users/models/user.model';
import { NewChannelArgs } from './dto/input/newChannel.Args';
import { GraphQLUpload, FileUpload, Upload } from 'graphql-upload';
import { createWriteStream } from 'fs';
import { ActivePath } from 'src/const';
import { OnModuleInit } from '@nestjs/common';


@Injectable()
export class ChannelService {
    constructor(
        @InjectModel('Channel') private readonly channelRep: Model<ChannelDocument>,
        @Inject(forwardRef( () => UsersService)) private readonly userService: UsersService
    ) {}
    


    async createChannel(channelInfo: NewChannelArgs, file: FileUpload, userId: string) {
        const name = channelInfo.name;
        const user = await this.userService.getUserById(userId);
        if(!user)
          throw new Error("Utente non trovato")

        var existingChannel;
        try{
          existingChannel = await this.channelRep.findOne({ name: name });
        } catch(err){
          console.log(err);
        }
       
         if (existingChannel) {
           throw new BadRequestException('Name already used');
         }
       
         try {
           const channel = await this.channelRep.create({
             ...channelInfo,
             _id: new Types.ObjectId(),
             createdAt: new Date().toString(),
             squeals: [],
             partecipants: [user.username],
             owners: [userId],
             channelImage: '',
             isBlocked: false,
           });
           
           await channel.save();
           file && await this.uploadChannelImage(channel._id, file);
           await user.channels.push(channel._id);
           await user.save();
           return channel;
         } catch (error) {
          console.log(error);
         }
       }

       async uploadChannelImage(channelId: string, file: FileUpload): Promise<ChannelDocument> {
        const { createReadStream, filename } = await file;
  
        const filePath = `${ActivePath}/channel/uploads/${filename}`;
        await createReadStream()
          .pipe(createWriteStream(filePath));
  
        try {
          const channel = await this.getChannelById(channelId);
      
          if (!channel) {
            throw new Error("User not found");
          }
          channel.channelImage = 'https://site222344.tw.cs.unibo.it/channelUploads/' + filename;
          await channel.save();
          return channel;
        } catch (error) {
         console.log(error);
      }
    }
   
    async deleteChannel(_id: string) : Promise<string>{
      try {
        const channel = await this.channelRep.findOne({_id: _id});
    
        if (!channel){
          throw new NotFoundException('Channel not found');
        }
        const channelOwners= channel.owners;
        const channelPartecipants = channel.partecipants;
        for(let i = 0; i < channelOwners.length; i++){
          const user = await this.userService.getUserById(channelOwners[i]);
          if(!user) continue;
          user.channels = user.channels.filter((channel) => channel != _id);
          await user.save();
        }
        for(let i = 0; i < channelPartecipants.length; i++){
          const user = await this.userService.getUserByUsername(channelPartecipants[i]);
          if(!user) continue;
          user.channels = user.channels.filter((channel) => channel != _id);
          await user.save();
        }
    
        //for each existing user check if the channel is in the user's channels and in the user history and remove it
        const users = await this.userService.getAllBasicUsers();
        users.forEach(async user => {
          if(channel.keyword) {
            user.history = user.history.filter((historyItem) => historyItem.id != channel.keyword);
          } else {
            user.history = user.history.filter((historyItem) => historyItem.id != _id);
          }
         
          await user.save();
        });
    
        await this.channelRep.deleteOne({_id: channel._id});
        return("Channel deleted successfully");
      } catch (error) {
        console.log(error);
      }
    }

     
async addUserToChannel(channelId: string, userId: string){
  try {
    const channel = await this.channelRep.findOne({_id: channelId});
    if( !channel ){
        throw new NotFoundException('Channel not found');
    }
    if(channel.partecipants.includes(userId)){
        throw new BadRequestException('User already in the channel');
    }
    //get the user profile
    const user = await this.userService.getUserById(userId);
    if(!user){
        throw new NotFoundException('User not found');
    }
    channel.partecipants.push(user.username);
    await channel.save();
    const addedUser = await this.userService.addChannelToUser(userId, channelId);
    if(!addedUser){
        throw new InternalServerErrorException('Error adding the user to the channel');
    }
    return channel;
  } catch (error) {
    console.log(error);
  }
}

     async removeUserFromChannel(channelId: string, username: string){
      try{

      const channel = await this.channelRep.findOne({_id: channelId});
      if( !channel ){
          throw new NotFoundException('Channel not found');
      }
      if(!channel.partecipants.includes(username)){
          throw new BadRequestException('User not in the channel');
      }
      channel.partecipants = channel.partecipants.filter(user => user !== username);
      await channel.save();
      const user = await this.userService.getUserByUsername(username);
      if(!user){
          throw new NotFoundException('User not found');
      }
      user.channels = user.channels.filter((channel) => channel != channelId);
      await user.save();
      return channel;
    } catch (error) {
      console.log(error);
    }
      }
   
     async addAdminToChannel(channelId: string, username: string) : Promise<string>{
      try{
       const channel = await this.channelRep.findOne({_id: channelId});
   
       if (!channel){
         throw new NotFoundException('Channel not found');
       }
       
       const user = await this.userService.getUserByUsername(username);
        if(!user){
          throw new NotFoundException('User not found');
        }
        let userId = user._id;
   
       channel.owners.push(userId);
       await channel.save();
   
   
       return("Amministratore aggiunto con successo");
      } catch (error) {
        console.log(error);
      }
     }
   
     async getChannelUsers(_id: string)  : Promise<User[]>{
      try {
       const channel = await this.channelRep.findOne({_id: _id});
   
       if (!channel){
         throw new NotFoundException('Channel not found');
       }
   
       var users = [];
       for(let i = 0; i < channel.partecipants.length; i++){
         var user = this.userService.getUserById(channel.partecipants[i]);
         users.push(user);
       }
       return [...users];
      } catch (error) {
        console.log(error);
      }
     }
   
   
     async getChannelAdmins(_id: string)   : Promise<User[]>{
      try {
       const channel = await this.channelRep.findOne({_id: _id});
   
       if (!channel){
         throw new NotFoundException('Channel not found');
       }
   
       var owners = [];
       for(let i = 0; i < channel.partecipants.length; i++){
         var user = this.userService.getUserById(channel.owners[i]);
         if(!user || user === null) continue;
         owners.push(user);
       }
       return [...owners];
      } catch (error) {
        console.log(error);
      }
     }
   
     async getChannelById(id: string){
      try {
       const channel = await this.channelRep.findOne({_id: id});
        if (!channel) {
          //throw new NotFoundException('No channel found with this id');
          return null;
        }
        return channel;
      } catch (error) {
        console.log(error);
      }
     } 
   
     
   
     async getChannelByName(name: string) : Promise<Channel>{
      try {
       const channel = await this.channelRep.findOne({name: name});
   
       if (!channel) {
         throw new NotFoundException('No channel found with this name');
       }
   
       return channel;
      } catch (error) {
        console.log(error);
      }
     }
   
     async getAllChannels(): Promise<ChannelDocument[]>{
      try {
        
       const channels = await this.channelRep.find().exec();
      //filter the temporary channels
      if (!channels){
        throw new InternalServerErrorException("Error loading the channels");
      }
      
      const filteredChannels = channels.filter(channel => channel.channelType !== ChannelType.CANALE_TEMPORANEO);
      return filteredChannels;
    } catch (error) {
      console.log(error);
    }
     }
   
     async getChannelsByType(channelType: ChannelType): Promise<ChannelDocument[]>{
      try {
       const channels = await this.channelRep.find({channelType}).exec();
   
       if (!channels){
         throw new InternalServerErrorException("Error loading the channels");
       }
       
       return channels;    
      } catch (error) {
        console.log(error);
      }
     }
   
     //function to get the squeals in a channel
     async getChannelSqueals(_id: string){
      try{
       const channel = await this.channelRep.findOne({_id: _id});
       if( !channel ){
         throw new NotFoundException('Channel not found');
       }
       return channel.squeals;
      } catch (error) {
        console.log(error);
      }
     }

     async addSquealToChannel(_id: string, squealId: string){
      try {
        const channel = await this.channelRep.findOne({_id: _id});
        if( !channel ){
            throw new NotFoundException('Channel not found');
        }
        if(channel.isBlocked){
          throw new Error("Canale bloccato");
        }
        channel.squeals.push(squealId);
        await channel.save();
        return true;
      } catch (error) {
        console.log(error);
      }
    }

      //get the five most popular channels based on the number of users
      async getMostPopularChannels(){
        try{
          const channels =  await this.channelRep.find().exec();
          if(channels.length < 5){
            return channels;
          } 
          channels.sort((a, b) => (a.partecipants.length < b.partecipants.length) ? 1 : -1);
          return channels.slice(0, 5);
        } catch(err){
          console.log(err);
        }
      }

      //function to create a temporary channel
      async createTemporaryChannel(keyword: string, userId: string, squealId:string){
        try {
          const user = await this.userService.getUserById(userId);
          if(!user){
            throw new NotFoundException("Utente non trovato");
          }
          //check if a temporary channel with the same keyword already exists
          const existingChannel = await this.channelRep.findOne({ keyword: keyword });
          if (existingChannel) {
            throw new BadRequestException('Keyword already used');
          }
          //create the temporary channel
          const channel = await this.channelRep.create({
            _id: new Types.ObjectId(),
            createdAt: new Date().toString(),
            squeals: [],  
            channelType: ChannelType.CANALE_TEMPORANEO,
            keyword: keyword,
            expireAt: new Date(Date.now() + 43200 * 1000),
          });
          await this.addSquealToTemporaryChannel(keyword, squealId);
          await channel.save();
      
          await user.temporaryChannels.push(channel.keyword);
          await user.save();
          return channel;
        } catch (error) {
          if (error instanceof NotFoundException) {
            console.log(error);
          } else if (error instanceof BadRequestException) {
            console.log(error);
          } else {
            console.log(error);
          }
        }
      }

      //function to get a temporary channel by keyword
      async getTemporaryChannel(keyword: string){
        try{
        const temporaryChannel = await this.channelRep.findOne({keyword: keyword});
        if(!temporaryChannel){
          return null;
        }
        return temporaryChannel;
      } catch (error) {
        console.log(error);
      }
      }

      //function to delete every temporary channel that has expired
      async deleteExpiredTemporaryChannels(){
        try {
        const channels = await this.channelRep.find({channelType: ChannelType.CANALE_TEMPORANEO}).exec();
        channels.forEach(channel => {
          //check if the channel has expired
          if(channel.expireAt < new Date()){
            this.deleteChannel(channel._id);
          }
        });
      } catch (error) {
        console.log(error);
      }
      }

      //function to add a squeal to a temporary channel
      async addSquealToTemporaryChannel(keyword: string, squealId: string){
        try {
        const channel = await this.channelRep.findOne({keyword: keyword});
        if( !channel ){
            throw new NotFoundException('Channel not found');
        }
        channel.expireAt = new Date(Date.now() + 43200 * 1000);
        channel.squeals.push(squealId);
        await channel.save();
        return true;
      } catch (error) {
        console.log(error);
      }
      }

      async changeChannelDescription(channelId: string, newDescription: string){
        try {
        const channel = await this.channelRep.findOne({_id: channelId});
        if( !channel ){
            throw new NotFoundException('Channel not found');
        }
        channel.description = newDescription;
        await channel.save();
        return channel;
      } catch (error) {
        console.log(error);
      }
      }

      async deleteSquealFromChannel(squealId: string, channelId: string){
        const channel = await this.getChannelById(channelId);
        if(!channel) return null;
        channel.squeals = channel.squeals.filter(squeal => squeal.toString() !== squealId);
        await channel.save();
        return true;
      }

      async getAllOfficialChannels(){
        const channels = await this.getAllChannels();
        if(!channels) return null;
        const officialChannels = channels.filter(channel => channel.channelType === ChannelType.CANALE_SQUEALER);
        return officialChannels;
      }
      
      async handleOwnerAdd(channelId: string, usernames: string[]){
        const channel = await this.getChannelById(channelId);
        if(!channel) return null;
        for(let i = 0; i < usernames.length; i++){
          const user = await this.userService.getUserByUsername(usernames[i]);
          if(!user) return null;
          
          channel.owners.push(user._id);
          channel.partecipants.push(user.username);
          await channel.save();
        }
        return channel;
      }

      async handleOwnerRemove(channelId: string, usernames: string[]){
        const channel = await this.getChannelById(channelId);
        if(!channel) return null;
        for(let i = 0; i < usernames.length; i++){
          const user = await this.userService.getUserByUsername(usernames[i]);
          if(!user) return null;
          //take only the id string not 'new ObjectId'
          let userId = user._id;
          //split the id string to take only the id
          for(let i = 0; i < channel.owners.length; i++){
            if(channel.owners[i].toString() === userId.toString()){
              channel.owners.splice(i, 1);
            }
          }
          await channel.save();
        }
        return channel;
      }

      async blockChannel(channelId: string){
        const channel = await this.getChannelById(channelId);
        if(!channel) return null;
        channel.isBlocked = true;
        await channel.save();
        return channel;
      }

      async unblockChannel(channelId: string){
        const channel = await this.getChannelById(channelId);
        if(!channel) return null;
        channel.isBlocked = false;
        await channel.save();
        return channel;
      }

      async changeChannelName(channelId: string, newName: string){
        const channel = await this.getChannelById(channelId);
        if(!channel) return null;
        const checkChannel = await this.getAllChannels();
        if(checkChannel.find(channel => channel.name === newName)) return null;
        channel.name = newName;
        await channel.save();
        return channel;
      }

      //for each day of the week return the number of channels created
      async getChannelsCreatedPerDay() {
        try{
        const numberOfChannelsPerWeek = [];
      
        for (let i = 6; i >= 0; i--) {
          const date = new Date();
          date.setUTCHours(0, 0, 0, 0);
          date.setUTCDate(date.getUTCDate() - i);
      
          const channels = await this.channelRep.find({
            createdAt: {
              $gte: date,
              $lt: new Date(date.getTime() + 24 * 60 * 60 * 1000),
            },
          });
      
          numberOfChannelsPerWeek.push({
            date: date,
            number: channels.length,
          });
        }
      
        return numberOfChannelsPerWeek;
      } catch (error) {
        console.log(error);
      }
      }
      

      async getAllTemporaryChannels(){
        try{
          const channels = await this.channelRep.find({channelType: ChannelType.CANALE_TEMPORANEO});
          if(!channels) return null;
          return channels;
        } catch (error) {
          console.log(error);
        }
      }

      async save(channelId: string){
        const channel = await this.getChannelById(channelId);
        if(!channel) return null;
        await channel.save();
      
      }
      
      async getAllChannelsPaginated(pageNumber: number) : Promise<ChannelDocument[]>{
        const channelsPerPage = 18;
        try{
          const channels = await this.channelRep
            .find({ channelType: { $ne: 'canale_temporaneo' } })
            .sort({ name: 1}) // Sorting in ascending order by the 'name' field (change it to the actual field you want to sort by)
            .limit(channelsPerPage)
            .skip(channelsPerPage * pageNumber)
            .exec();
          return channels;
        } catch(error){
          console.log(error)
        }
      }




      
}

/**
 * NOTE PER CONO
 * 

 */

 /**
  * NOTE PER OSAMA
  * 
  * 
  * 
  * 
  */

 /*

  PROBLEMI :
   1 -> ChangeFirstName e CHnageLastName non esistono (EditProfile) -> done 
   2 -> in trending channel prende per forza 5 canali anche se non sa da dove prendere i dati 
   3 -> squealshower non aggiorna immagine di profilo e username quando si cambiano
   4 -> quando si elimina un canale o un utente resta nella history, va eliminato anche da là -> done
 */
