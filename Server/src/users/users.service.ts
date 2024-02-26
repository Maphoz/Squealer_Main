import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException, UnprocessableEntityException, Inject, forwardRef } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserInput } from './dto/input/create-user-input.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types} from 'mongoose';
import { BasicUserDocument } from 'src/basicusers/model/basic-user.schema';
import { SquealerUserDocument } from 'src/squealer_moderator/model/squealer-moderator.schema';
import { SmmUserDocument } from 'src/smm/model/smm.schema';
import { UserDocument } from './models/user.schema';
import { UserType } from './user.enum';
import { GraphQLUpload, FileUpload, Upload } from 'graphql-upload';
import { createWriteStream } from 'fs';
import { User } from './models/user.model';
import { CompleteRegistrationInput } from './dto/input/completeRegistration.dto';
import { ChannelService } from 'src/channel/channel.service';
import { PotentialReceivers } from './dto/args/PotentialReceivers.args';
import { ActivePath } from 'src/const';
import { Cron, CronExpression } from '@nestjs/schedule';
import { SquealsService } from 'src/squeals/squeals.service';
import { SQUEAL_CLASSIFICATION } from 'src/squeals/types/squeal.classification';
import { UserUnion } from './user-union';



@Injectable()
export class UsersService {
    constructor(
        @InjectModel('User') private readonly user: Model<UserDocument>,
        @InjectModel('BasicUser') private readonly basicUserModel: Model<BasicUserDocument>,
        @InjectModel('SquealerUser') private readonly squealerUserModel: Model<SquealerUserDocument>,
        @InjectModel('SmmUser') private readonly smmUserModel: Model<SmmUserDocument>,
        @Inject(forwardRef( () => ChannelService)) private readonly channelService: ChannelService,
        ){}
        
        /*
          Tested.
        */
          async findUser(model: Model<any>, field: string, content: string) {
            try {
                const query = {};
                query[field] = content;
                return await model.findOne(query);
            } catch (error) {
              console.log(error);
            }
        }
        
    /*
        Controlla in tutti i modelli se c'è già un utente con quell'email o username.
    */
        /*
          Tested.
        */
        async validateCreateUserEmail(createUserData: CreateUserInput) {
          try{
          const field = "email";
          const existingBasicUser = await this.findUser(this.basicUserModel, field, createUserData.email);
          if (existingBasicUser) {
              throw new UnprocessableEntityException('Email already exists.');
          }
      
          const existingSmmUser = await this.findUser(this.smmUserModel, field,createUserData.email);
          if (existingSmmUser) {
              throw new UnprocessableEntityException('Email already exists.');
          }
      
          const existingSquealerUser = await this.findUser(this.squealerUserModel,field, createUserData.email);
          if (existingSquealerUser) {
              throw new UnprocessableEntityException('Email already exists.');
          }
        } catch(error){
          console.log(error);
        }
      }
      
    /*
          Tested.
        */
   async validateCreateUserUsername(username_in: string) {
    try{
    const field = "username"
    let existingUser = await this.findUser(this.basicUserModel,field, username_in);
    if (existingUser) {
        throw new UnprocessableEntityException('Username already exists.');
    }
    existingUser = await  this.findUser(this.smmUserModel, field,username_in);
    if (existingUser) {
        throw new UnprocessableEntityException('Username already exists.');
    }
    existingUser = await this.findUser(this.squealerUserModel, field,username_in);
    if (existingUser) {
        throw new UnprocessableEntityException('Username already exists.');
    }
  } catch(error){
    console.log(error);
  }
    }

    /*
          Tested.
        */
    async createUser(data: CreateUserInput) {
      try{
      await this.validateCreateUserEmail(data);
      await this.validateCreateUserUsername(data.username);
  
      let userType = data.typeOfUser;
      let createdDocument;
      
      switch (userType) {
          case UserType.USER_NORMALE || UserType.VIP:
              createdDocument = await new this.basicUserModel({
                  ...data,
                  _id: new Types.ObjectId(),
                  password: await bcrypt.hash(data.password, 14),
                  caratteri_giornalieri: 800,
                  caratteri_settimanali: 52000,
                  caratteri_mensili: 20000,
                  caratteri_giornalieri_rimanenti: 800,
                  caratteri_settimanali_rimanenti: 52000,
                  caratteri_mensili_rimanenti: 20000,
                  caratteri_acquistabili: 1600,
                  caratteri_acquistabili_rimanenti: 1600,
                  friends: [],
                  popularityIndex: 0,
                  isBlocked: false,
                  channels: [],
                  squeals: [],
                  history: [],
                  bio: '',
                  profileImage:'',
                  temporaryChannels: [],
                  userType: data.typeOfUser,
                  visualizedSqueals: []
              });
              break;
          case UserType.SMM:
              createdDocument = await new this.smmUserModel({
                  ...data,
                  password: await bcrypt.hash(data.password, 14),
                  _id: new Types.ObjectId(),
                  assistedList: [],
                  isBlocked: false
              });
              break;
          case UserType.SQUEALER:
              createdDocument = await new this.squealerUserModel({
                  ...data,
                  _id: new Types.ObjectId(),
                  password: await bcrypt.hash(data.password, 14),
                  channels: [],
                  squeals: []
              });
              break;
      }
  
      if (!createdDocument) {
          throw new InternalServerErrorException('Could not create user');
      }
  
      await createdDocument.save();
      return createdDocument._id;
    } catch(error){
      console.log(error);
    }

  }
  
    /*
        Permette di cercare un utente o tramite username o tramite id 
    */
   /*
    Tested.
   */
    async getUserById( _id: string ){
      const field = "_id"
      const basicUser = await this.findUser(this.basicUserModel,field, _id);
      const smmUser = await this.findUser(this.smmUserModel,field, _id);
      const squealerUser = await this.findUser(this.squealerUserModel,field,_id); 
      
      let userDocument: any;
    
      if (basicUser) {
        userDocument = basicUser;
      }  else if (smmUser) {
        userDocument = smmUser;
      } else if (squealerUser) {
        userDocument = squealerUser;
      } else {
        return null;
      }
      return userDocument;
    }

    /*
      Tested. 
      Misses -> Deve permettere di ritornare l'utente e le sue informazioni
    */
    async getUserByUsername(username_in: string){
        const field = "username"
        const basicUser = await this.findUser(this.basicUserModel,field, username_in);
        const smmUser = await this.findUser(this.smmUserModel, field,username_in);
        const squealerUser = await this.findUser(this.squealerUserModel, field,username_in);
      
        let userDocument: any;
      
        if (basicUser) {
          userDocument = basicUser;
        }  else if (smmUser) {
          userDocument = smmUser;
        } else if (squealerUser) {
          userDocument = squealerUser;
        } else {
          return null;
        }

        return userDocument;
    }

    /*
        Permette di eliminare un utente.
    */
    async deleteUser(_id: string): Promise<Boolean> {
        try{

          const userDocument = await this.getUserById(_id);
          if (!userDocument) {
              throw new NotFoundException('User not found');
          }
          let userType = userDocument.typeOfUser;
          switch (userType) {
              case 'USER_NORMALE' || 'VIP':
                  //check if the user is in any channel
                  const channels = await this.channelService.getAllChannels();
                  for(let i = 0; i < channels.length; i++){
                    if(channels[i].partecipants.includes(userDocument.username)){
                      await this.channelService.removeUserFromChannel(channels[i]._id, userDocument.username);
                    }
                    if(channels[i].owners.includes(_id)){
                      //filter the owners array
                      channels[i].owners = channels[i].owners.filter((owner) => owner != _id);
                    }
                  }
  
                  //check if the user is in any friend list
                  const users = await this.getAllBasicUsers();
                  for(let i = 0; i < users.length; i++){
                    if(users[i].friends.includes(userDocument.username)){
                      users[i].friends = users[i].friends.filter((friend) => friend != userDocument.username);
                    }
                      users[i].history = users[i].history.filter((historyItem) => historyItem.id != _id);
                      await users[i].save();
          
                  }
  
                  //check if the user is in any history 
                  await this.basicUserModel.deleteOne({_id: _id});
  
                  break;
              case 'SMM':
                  await this.smmUserModel.deleteOne({_id: _id});
                  break;
              case 'SQUEALER':
                  await this.squealerUserModel.deleteOne({_id: _id});
                  break;
          }
          return true;
        } catch(err){
          console.log(err);
        }
    }

    async update(userId: string, field: string, newValue: string | number){
      try{

        const userDocument = await this.getUserById(userId);
        if (!userDocument) {
            throw new NotFoundException('User not found');
        }
        let userType = userDocument.typeOfUser;
        const updateQuery = {};
        updateQuery[field] = newValue;
  
        let updatedUser;
        switch (userType) {
          case 'USER_NORMALE' || 'VIP':
              updatedUser = await this.basicUserModel.updateOne(
                  { _id: userId },
                  { $set: updateQuery },
                  { new: true }
              );
              break;
          case 'SMM':
            updatedUser = await this.smmUserModel.updateOne(
              { _id: userId },
              { $set: updateQuery },
              { new: true }
          );
              break;
          case 'SQUEALER':
            updatedUser = await this.squealerUserModel.updateOne(
              { _id: userId },
              { $set: updateQuery },
              { new: true }
          );
              break;
      }
        return updatedUser;
      }catch(err){
        console.log(err);
      }
    }

    /*
      tested
    */
    
    async changeUsername(_id: string, newUsername: string ){
        

        await this.validateCreateUserUsername(newUsername);

        try {
        const field = "username";
        const userDocument = await this.update(_id, field, newUsername);
        const user = await this.getUserById(_id);
        if(!user){
            throw new Error("User not found");
        }
        //check if the user is in any channel
        const channels = await this.channelService.getAllChannels();
        for(let i = 0; i < channels.length; i++){
          if(channels[i].partecipants.includes(userDocument.username)){
            await this.channelService.removeUserFromChannel(channels[i]._id, userDocument.username);
            await this.channelService.addUserToChannel(channels[i]._id, newUsername);
          }
        }
        //check if the user is in any friend list
        const users = await this.getAllBasicUsers();
        for(let i = 0; i < users.length; i++){
          if(users[i].friends.includes(userDocument.username)){
            users[i].friends = users[i].friends.filter((friend) => friend != userDocument.username);
            users[i].friends.push(newUsername);
          }
            await users[i].save();
        }
        const squeals = user.squeals;





        if(userDocument){
          return true;
        } else {
          return false;
        }
        
      } catch(error){
        console.log(error);
      }
    }
    /*
      tested
    */
    
    async changeProfilePicture( _id: string, newPath: string){
        const  field = "profileImage";
        try{
        const userDocument =  await this.update(_id, field, newPath);
        if(userDocument){
          return true;
        } else {
          return false;
        }
      } catch(error){
        console.log(error);
      }

    }
    /*
      tested
    */
    
    async changeFirstName(_id: string, newFirstName: string){
        const field = "nome";
        try{
        const userDocument = await this.update(_id, field, newFirstName);
        if(userDocument){
          return true;
        } else {
          return false;
        }
      } catch(error){
        console.log(error);
      }

    }

    async changeLastName(_id: string, newLastName: string){
        const field = "cognome";
        try{
        const userDocument = await this.update(_id, field, newLastName);
        if(userDocument){
          return true;
        } else {
          return false;
        }
      } catch(error){
        console.log(error);
      }

    }




    async changePassword(_id: string, newPassword: string, newPassword2: string){
        let userDocument = await this.getUserById(_id);
        if (!userDocument) {
            throw new NotFoundException('User not found');
        }
        if(newPassword != newPassword2){
            throw new BadRequestException('Le password non coincidono');
        }
        const field = "password";
        try {
        userDocument = await this.update(_id, field, await bcrypt.hash(newPassword, 14));
        if(userDocument){
          return true;
        } else {
          return false;
        }
      } catch(error){
        console.log(error);
      }

    }

      /*
      tested
    */
    
      async validateUser(value: string): Promise<any> {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isEmail = emailRegex.test(value);
      
        const basicUser = await this.findUser(this.basicUserModel, isEmail ? 'email' : 'username', value);
        const smmUser = await this.findUser(this.smmUserModel, isEmail ? 'email' : 'username', value);
        const squealerUser = await this.findUser(this.squealerUserModel, isEmail ? 'email' : 'username', value);
      
        let userDocument: any;
      
        if (basicUser) {
          userDocument = basicUser;
        } else if (smmUser) {
          userDocument = smmUser;
        } else if (squealerUser) {
          userDocument = squealerUser;
        } else {
          return null;
        }   
        return userDocument;
      }
      


      async addChannelToUser(userId: string, channelId: string){
        try{
        const user = await this.getUserById(userId);
        if(!user){
            throw new Error("User not found");
        }
        if(user.channels.includes(channelId)){
          return false;
        }
        user.channels.push(channelId);
        user.save();
        return true;
      } catch(error){
        console.log(error);
      }
      }

      async removeChannelFromUser(userId: string, channelId: string){
        try{
        const user = await this.getUserById(userId);
        if(!user){
            throw new Error("User not found");
        }
        if(!user.channels.includes(channelId)){
          return false;
        }
        user.channels = user.channels.filter((channel) => channel != channelId);
        user.save();
        return true;
      } catch(error){
        console.log(error);
      }
      }

      async setBio(userId: string, bio: string){
        try{
        const user = await this.getUserById(userId);
        if(!user){
            throw new Error("User not found");
        }
        user.bio = bio;
        await user.save();
        return true;
      } catch(error){
        console.log(error);
      }
    }

    async uploadProfileImage(userId: string, file: FileUpload): Promise<boolean> {
        const { createReadStream, filename } = await file;

        const filePath = `${ActivePath}/users/uploads/${filename}`;
        await createReadStream()
          .pipe(createWriteStream(filePath));

        try {
          const user = await this.getUserById(userId);
      
          if (!user) {
            throw new Error("User not found");
          }
          user.profileImage = 'https://site222344.tw.cs.unibo.it/uploads/' + filename;
          await user.save();
          return true;
        } catch (error) {
          console.error('Error uploading image:', error);
          return false;
      }

  }

  async addSquealToUser(userId: string, squealId: string, squealCost: number){
    try{
    const user = await this.getUserById(userId);
    if(!user){
        throw new Error("User not found");
    }
    user.squeals.push(squealId);
    user.caratteri_giornalieri_rimanenti -= squealCost;
    user.caratteri_settimanali_rimanenti -= squealCost;
    user.caratteri_mensili_rimanenti -= squealCost;
    await user.save();
    return true;
  } catch(error){
    console.log(error);
  }
  }

  /* Function that takes the type and the id */
  async addHistoryToUser(userId: string, id: string, type: string){
    try{
    const user = await this.getUserById(userId);
    if(!user){
        throw new Error("User not found");
    }
    //check if the history is already in the history array
    const history = user.history.find((history) => history.id == id);
    //if it is not in the history array
    if(!history){
      //add at the beginning of the array
      user.history.unshift({id, type});
      await user.save();
      return true;
    } else {
      return false;
    }
  } catch(error){
    console.log(error);
  }
  }

  async clearHistory(userId: string){
    try{
    const user = await this.getUserById(userId);
    if(!user){
        throw new Error("User not found");
    }
    user.history = [];
    await user.save();
    return true;
  }   catch(error){
    console.log(error);
  }
  }

  async clearOneHistory(userId: string, id: string){
    try{
    const user = await this.getUserById(userId);
    if(!user){
        throw new Error("User not found");
    }
    user.history = user.history.filter((history) => history.id != id);
    await user.save();
    return true;
  } catch(error){
    console.log(error);
  }
  }

  
  async completeRegistration(userId: string, file: FileUpload, bio: string) : Promise<boolean>{
    if (file){
      try{
        await this.uploadProfileImage(userId, file);
      } catch(error){
        console.log(error);
      }
    }

    if (bio){
      try{
        await this.setBio(userId, bio);
      } catch(error){
        console.log(error);
      }
    }

    return true;
  }


  /**
   * function that returns potential destinatari for squeal
   */

  async getReceivers(userId: string) : Promise<PotentialReceivers>{
    const channels = await this.getChannelsOfUser(userId);
    const friends = await this.getFriendsDocuments(userId);

    return({
      channels: channels,
      friends: friends
    })
  }

  async getFriendsDocuments(userId: string){
    try{
    const user = await this.getUserById(userId);
    
    if(!user){
      throw new Error("Couldn't find user");
    }

    var friendsDocuments = [];

    for (let i = 0; i < user.friends.length; i++){
      friendsDocuments.push(this.getUserByUsername(user.friends[i]));
    };

    return friendsDocuments;
  } catch(error){
    console.log(error);
  }
  }


  async getChannelsOfUser(userId: string){
    try{
    const user = await this.getUserById(userId);
    
    if(!user){
      throw new Error("Couldn't find user");
    }

    var channelsDocuments = [];

    for (let i = 0; i < user.channels.length; i++){
      channelsDocuments.push(this.channelService.getChannelById(user.channels[i]));
    };

    return channelsDocuments;
  }   catch(error){
    console.log(error);
  }
  }

  //get the five most popular users
  async getMostPopularUsers(){
    try {
    const basicUsers = await this.basicUserModel.find().exec();
    basicUsers.sort((a, b) => (a.popularityIndex < b.popularityIndex) ? 1 : -1);
    return basicUsers.slice(0, 5);
    } catch(error){
      console.log(error);
    }
  }

  /**
   * 
   * @param userId 
   * 
   * calcola la quota limite rimanente. 
   * 
   * Es: giornalieri_rimanenti: 100, settimanali: 80, mensili 200. Risultato: 80, quindi si può postare massimo uno squeal di costo 80;
   */
  async getCharLimit(userId: string) : Promise<number>{
    try{
    const user = await this.getUserById(userId);
    if(!user) throw new Error("User not found");

    return Math.min(user.caratteri_giornalieri_rimanenti, user.caratteri_mensili_rimanenti, user.caratteri_settimanali_rimanenti);
    } catch(error){
      console.log(error);
    }
  }

  async getAllBasicUsers(){
    try{
        return await this.basicUserModel.find().exec();
    } catch(error){
      console.log(error);
    }
  }



  async getAllSmmUsers(){
    try {
    return await this.smmUserModel.find().exec();
    } catch(error){
      console.log(error);
    }
  }

  async getAllSquealerUsers(){
    try{
    return await this.squealerUserModel.find().exec();
    } catch(error){
      console.log(error);
    }
  }

  async getUserForGraph(){
    let userNumber = [];
    let basicUsers = await this.getAllBasicUsers();
    let totalBasicUsers = 0;
    let totalVipUsers = 0; 
    let totalSmmUsers = 0;
    let totalSquealerUsers = 0;
    for(let i = 0; i < basicUsers.length; i++){
      if(basicUsers[i].userType == "USER_NORMALE"){
        totalBasicUsers++;
      } else if(basicUsers[i].userType == "VIP"){
        totalVipUsers++;
      }
    }
    userNumber.push({userType: "USER_NORMALE", number: totalBasicUsers});

    userNumber.push({userType: "VIP", number: totalVipUsers});
    let smmUsers = await this.getAllSmmUsers();
    totalSmmUsers = smmUsers.length;
    userNumber.push({userType: "SMM", number: totalSmmUsers});
    let squealerUsers = await this.getAllSquealerUsers();
    totalSquealerUsers = squealerUsers.length;
    userNumber.push({userType: "SQUEALER", number: totalSquealerUsers});
    return userNumber;
  }



  }






/*
  Entità reazione -> tipo reazione, documento utente che ha reagito, squeal a cui ha reagito
  Entità commento -> testo, documento utente che ha commentato, squeal a cui ha commentato
*/

