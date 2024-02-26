import { Inject, Injectable, InternalServerErrorException, NotFoundException,OnModuleInit } from '@nestjs/common';
import { ComparisonExpressionOperatorReturningBoolean, Model, Types } from 'mongoose';
import { CreateUserInput } from 'src/users/dto/input/create-user-input.dto';
import { BasicUserDocument } from './model/basic-user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import { UsersService } from 'src/users/users.service';
import { forwardRef } from '@nestjs/common';
import { UserType } from 'src/users/user.enum';
import { User } from 'src/users/models/user.model';
import { GRAPHQL_MAX_INT } from 'graphql';
import { SQUEAL_CLASSIFICATION } from 'src/squeals/types/squeal.classification';
import { SquealsService } from 'src/squeals/squeals.service';
import { SMMUser } from 'src/smm/model/smm.model';
import { MessagesService } from 'src/messages/messages.service';
import { RecoverData } from './types/RecoverData.args';


@Injectable()
export class BasicusersService {
    constructor(
        @Inject(forwardRef( () => UsersService)) private readonly usersService: UsersService,
        @InjectModel('BasicUser') protected readonly model: Model<BasicUserDocument>,
        @Inject(forwardRef( () => MessagesService)) private readonly messageService: MessagesService
        ){}
        
        

        

        async addVisualizedSqueal(userId: string, squealId: string) : Promise<boolean>{
          try{
          const user = await this.usersService.getUserById(userId);
          if(!user) throw new Error("Utente non trovato");

          const bool = user.visualizedSqueals.includes(squealId);

          if(!bool){
            user.visualizedSqueals.push(squealId);
            await user.save();
          }
          return bool;
        } catch(err){
          console.log(err);
        }
        }

        async addCharacters(userId: string, charactersToAdd: number, period: string){
          try{
          const user = await this.usersService.getUserById(userId);

          if(!user) throw new Error("Utente non trovato");

          if(user.userType == UserType.VIP) return this.addCharactersToVip(user, charactersToAdd, period);

          if(user.caratteri_acquistabili_rimanenti < charactersToAdd) throw new Error("Non puoi acquistare questo numero di caratteri");

          user.caratteri_acquistabili_rimanenti -= charactersToAdd;

          switch(period){
            case "giornalieri":
              user.caratteri_giornalieri_rimanenti += charactersToAdd;
              break;
            case "settimanali":
              user.caratteri_settimanali_rimanenti += charactersToAdd;
              break;
            case "mensili":
              user.caratteri_mensili_rimanenti += charactersToAdd;
              break;
            default:
              break;
          }
          await user.save();
          return user;
        } catch(err){
          console.log(err);
        }
        }

        async addCharactersToVip(user: any, charactersToAdd: number, period: string){
          switch(period){
            case "giornalieri":
              user.caratteri_giornalieri_rimanenti += charactersToAdd;
              break;
            case "settimanali":
              user.caratteri_settimanali_rimanenti += charactersToAdd;
              break;
            case "mensili":
              user.caratteri_mensili_rimanenti += charactersToAdd;
              break;
            default:
              break;
          }
          await user.save();
          return user;
        }


        async addSmm(userId: string, username: string){
          try{
            const currentVipUser = await this.usersService.getUserById(userId);
            if(!currentVipUser){
                throw new Error("User not found");
            }
            const user = await this.usersService.getUserByUsername(username);
            if(!user){
                throw new Error("User not found");
            }
            const smmId = user._id;
            
            currentVipUser.social_media_manager_id = smmId;
            user.assistedList.push(currentVipUser._id);
    
            await currentVipUser.save();
            await user.save();
    
            return true;
          } catch(err){
            console.log(err);
          }

       }
    
       async removeSmm(userId: string, username: string) {
        try{
        const currentVipUser = await this.usersService.getUserById(userId);
        if (!currentVipUser) {
          throw new Error("VIP User not found");
        }
      
        const smmUser = await this.usersService.getUserByUsername(username);
        if (!smmUser) {
          throw new Error("SMM User not found");
        }
      
        if (currentVipUser.social_media_manager_id !== smmUser._id.toString()) {
          throw new Error("VIP User is not assigned to this SMM User");
        }
      
        currentVipUser.social_media_manager_id = '';
        smmUser.assistedList = smmUser.assistedList.filter(
          (userId) => userId !== currentVipUser._id.toString()
        );
      
        await currentVipUser.save();
        await smmUser.save();
      
        return true;
        } catch(err){
          console.log(err);
        }

      }
    
        async upgradeToVip(userId: string){
          try{
          const user = await this.usersService.getUserById(userId);
          if(!user){
                throw new Error("User not found");
            }
          user.userType = UserType.VIP;
          user.caratteri_acquistabili = GRAPHQL_MAX_INT;
          user.caratteri_acquistabili_rimanenti = GRAPHQL_MAX_INT;
          await user.save();
          return user;
        } catch(err){
          console.log(err);
        }
        }

        async downgradeFromVip(userId: string){
          try{
          const user = await this.usersService.getUserById(userId);
          if(!user){
                throw new Error("User not found");
            }
          
          if(user.social_media_manager_id !== null){
            console.log(user.social_media_manager_id);
            try{
              await this.removeSmmFromVip(userId, user.social_media_manager_id);
            } catch(err){
              console.log(err);
            }
          }
          user.userType = UserType.USER_NORMALE;
          user.caratteri_acquistabili = 1600;
          user.caratteri_acquistabili_rimanenti = 1600;
          await user.save();
          return user;
          } catch(err){
            console.log(err);
          }

        }


        async addSmmToVip(smmId: string, vipId: string) : Promise<SMMUser>{
          try{
          const vip = await this.usersService.getUserById(vipId);
          if(!vip || vip.userType !== UserType.VIP) throw new Error("Utente vip non trovato.");

          const smm = await this.usersService.getUserById(smmId);
          if(!smm || smm.typeOfUser !== UserType.SMM) throw new Error("Social media manager non trovato.");

          smm.assistedList.push(vipId);
          vip.social_media_manager_id = smmId;
          await this.messageService.createMessageChannel(smmId, vipId);

          await smm.save();
          await vip.save();

          return smm;
        } catch(err){
          console.log(err);
        }
        }

        async removeSmmFromVip(vipId: string, smmId: string) : Promise<boolean>{
          try{
          const vip = await this.usersService.getUserById(vipId);
          if(!vip || vip.userType !== UserType.VIP) throw new Error("Utente vip non trovato.");

          if(vip.social_media_manager_id == smmId){
            vip.social_media_manager_id = null;
            await vip.save();
          }
          const smmUser = await this.usersService.getUserById(smmId);
          if (!smmUser) {
            throw new Error("SMM User not found");
          }
          smmUser.assistedList = smmUser.assistedList.filter(
                    (userId) => userId !== vip._id.toString()
                  );
          await smmUser.save();
          return vip;
          } catch(err){
            console.log(err);
          }
        }

        async removeSmmFromVips(smmId: string) : Promise<boolean>{
          try{
          const vips = await this.model.find({social_media_manager_id: smmId});

          for(const vip of vips){
            vip.social_media_manager_id = null;
            await vip.save();
          }
          return true;
        } catch(err){
          console.log(err);
        }
        }

      /**
       * 
       * @param userId 
       * 
       * aggiunge mezzo squeal stimato al giorno, uno squeal a settimana e due squeal al mese
       */
      async incrementBaseQuota(userId: string){
        try{
        const user = await this.usersService.getUserById(userId);
        if(!user){
          throw new Error("User not found");
        }
        
        user.caratteri_giornalieri += 40;
        user.caratteri_settimanali += 160;
        user.caratteri_mensili += 320;
    
        await user.save();
        return user;
      } catch(err){
        console.log(err);
      }

      }

      /**
       * 
       * @param userId 
       * 
       * togle 1/8 squeal stimato al giorno, 1/4 squeal a settimana e 1/2 squeal al mese
       * 
       * Vogliamo più incentivare il positivo rispetto a punire il negativo
       */
      async decrementBaseQuota(userId: string){
        try{
        const user = await this.usersService.getUserById(userId);
        if(!user){
          throw new Error("User not found");
        }
    
        user.caratteri_giornalieri = Math.max(user.caratteri_giornalieri - 20, 0);
        user.caratteri_settimanali -=  Math.max(user.caratteri_settimanali - 80, 0);
        user.caratteri_mensili -=  Math.max(user.caratteri_mensili - 160, 0);
        await user.save();
        return user;
      } catch(err){
        console.log(err);
      }
      }

      async decresePurchasable(userId: string, chars: number){
        try{
        const user = await this.usersService.getUserById(userId);
        if(!user){
          throw new Error("User not found");
        }

        user.caratteri_acquistabili_rimanenti -= chars;
        await user.save();
        return true;
      } catch(err){
        console.log(err);
      }
      }

      @Cron(CronExpression.EVERY_1ST_DAY_OF_MONTH_AT_MIDNIGHT, {name: 'monthlyCharactersUpdate'})
      async monthlyCharUpdate(){
        try {
        const users = await this.model.find().exec();
        if(!users) throw new Error("Nessun utente trovato");
        for(const user of users){
          user.caratteri_mensili_rimanenti = user.caratteri_mensili;
          if (user.userType !== 'VIP')  user.caratteri_acquistabili_rimanenti = user.caratteri_acquistabili;
          await user.save();
        }
      } catch(err){
        console.log(err);
      }
      }

      /**
       * ogni settimana alle 00:10 per permettere a month update di cambiare
       */
      @Cron('10 0 * * 0', {name: 'weeklyCharactersUpdate'})
      async weeklyCharUpdate(){
        try{ 
        const users = await this.model.find().exec();
        if(!users) throw new Error("Nessun utente trovato");
        for(const user of users){ 
          user.caratteri_settimanali_rimanenti = Math.min(user.caratteri_settimanali, user.caratteri_mensili_rimanenti);
          await user.save();
        }
      } catch(err){
        console.log(err);
      }
      }

      /**
       * ogni giorno alle 00:20 per permettere a month update di cambiare
       */
      @Cron('20 0 * * *', {name: 'dailyCharactersUpdate'})
      async dailyCharUpdate(){
        try{
          const users = await this.model.find().exec();
          if(!users) throw new Error("Nessun utente trovato");
          for(const user of users){
            user.caratteri_giornalieri_rimanenti = Math.min(user.caratteri_giornalieri, user.caratteri_settimanali_rimanenti, user.caratteri_mensili_rimanenti);
            await user.save();
          }
        } catch(err){
          console.log(err);
        }
      }


      async getAllNonVipUsers(popularityIndex: number){
        try{
          if(popularityIndex === 0) return await this.model.find({userType: UserType.USER_NORMALE}).exec();
          if(popularityIndex < 10){
            return await this.model.find({userType: UserType.USER_NORMALE, popularityIndex: {$lt: 10}}).exec();
          } else if(popularityIndex < 30){
            return await this.model.find({userType: UserType.USER_NORMALE, popularityIndex: {$gte: 10, $lt: 30}}).exec();
          } else {
            return await this.model.find({userType: UserType.USER_NORMALE, popularityIndex: {$gte: 30}}).exec();
          }
        } catch(err){
          console.log(err);
        }
      }
      async getAllVipUsers(popularityIndex: number){
        try{
          if(popularityIndex === 0) return await this.model.find({userType: UserType.VIP}).exec();
          if(popularityIndex < 10){
            return await this.model.find({userType: UserType.VIP, popularityIndex: {$lt: 10}}).exec();
          } else if(popularityIndex < 30){
            return await this.model.find({userType: UserType.VIP, popularityIndex: {$gte: 10, $lt: 30}}).exec();
          } else {
            return await this.model.find({userType: UserType.VIP, popularityIndex: {$gte: 30}}).exec();
          }
        } catch(err){
          console.log(err);
        }
      }

      async getMostActiveUsers(){
        try{
        const users = await this.model.find().exec();
        if(!users) throw new Error("Nessun utente trovato");
        let mostActiveUsers = [];
        //based on the number of squeals and visualized squeals
        for(let i = 0; i < users.length; i++){
          let user = users[i];
          let userScore = user.squeals.length + user.visualizedSqueals.length;
          mostActiveUsers.push({user: user, score: userScore});
        }
        let sortedUsers = mostActiveUsers.sort((a, b) => b.score - a.score);
        let newUser = [];
        for(let i = 0; i < 5; i++){
          newUser.push(sortedUsers[i].user);
        }
        return newUser;
      } catch(err){
        console.log(err);
      }
      }
      
      async getMostUnpopularUser(){
        try{
        const users = await this.model.find().exec();
        if(!users) throw new Error("Nessun utente trovato");
        let mostImpopularUsers = [];
       for(let i = 0; i < users.length; i++){
          let user = users[i];
          if(user.squeals.length > 10){
            let userScore = user.popularityIndex;
            mostImpopularUsers.push({user: user, score: userScore});
          }
        }
        let sortedUsers = mostImpopularUsers.sort((a, b) => a.score - b.score);
        let impopular = []
        for(let i = 0; i < sortedUsers.length && i < 5; i++){
          impopular.push(sortedUsers[i].user);
        }
        return impopular;
      } catch(err){
        console.log(err);
      }
       }

       async getMostFriends(){
        try {
        const users = await this.model.find().exec();
        if(!users) throw new Error("Nessun utente trovato");
        let mostFriendsUsers = [];
        for(let i = 0; i < users.length; i++){
          let user = users[i];
          let userScore = user.friends.length;
          mostFriendsUsers.push({user: user, score: userScore});
        }
        let sortedUsers = mostFriendsUsers.sort((a, b) => b.score - a.score);
        let newUser = [];
        for(let i = 0; i < 3 && i < sortedUsers.length; i++){
          newUser.push(sortedUsers[i].user);
        }
        return newUser;
      } catch(err){
        console.log(err);
      }
       }


       async getRecoveryData(email: string) : Promise<RecoverData>{
        try { 
        const user = await this.model.findOne({email: email});

        if(!user) throw new Error("Nessun utente con questa email");
        
        return{
          recoverAnswer: user.recoveryAnswer,
          recoverQuestion: user.recoveryQuestion
        }
      } catch(err){
        console.log(err);
      }
       }
       
       async verifyData(email: string, recoverAnswer: string) : Promise<boolean>{
        try{
        const user = await this.model.findOne({ email: email });

        if(!user) throw new Error("Nessun utente con questa email");

        return(user.recoveryAnswer == recoverAnswer)
        } catch(err){
          console.log(err);
        }

       }

       async newPassword(email: string, newPassword: string) : Promise<boolean>{
        try{
        const user = await this.model.findOne({ email: email });

        if(!user) throw new Error("Nessun utente con questa email");
        return await this.usersService.changePassword(user._id.toString(), newPassword, newPassword);
        } catch(err){
          console.log(err);
        }
        
       }
}


