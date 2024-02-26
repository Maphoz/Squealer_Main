import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { SquealerUserDocument } from './model/squealer-moderator.schema';
import { InjectModel } from '@nestjs/mongoose';
import { UserType } from 'src/users/user.enum';
import { BasicUserDocument } from 'src/basicusers/model/basic-user.schema';
import { SmmUserDocument } from 'src/smm/model/smm.schema';
import { UsersService } from 'src/users/users.service';



@Injectable()
export class SquealerModeratorService {
    constructor(
        @InjectModel('BasicUser') private readonly basicUserModel: Model<BasicUserDocument>,
        @InjectModel('SquealerUser') private readonly squealerUserModel: Model<SquealerUserDocument>,
        @InjectModel('SmmUser') private readonly smmUserModel: Model<SmmUserDocument>,
        private readonly usersService: UsersService
        ) { }

        /*
            getUserByType -> Dato un tipo ti restituisce la lista di utenti di quel tipo
        */

        async getUserByType(userType: string){
            try{
            switch(userType){
                case 'USER_NORMALE' || 'VIP':
                    return await this.basicUserModel.find({typeOfUser: userType}).exec();
                case 'SMM':
                      return await this.smmUserModel.find({typeOfUser: userType}).exec();
                case 'SQUEALER':
                    return await this.squealerUserModel.find({typeOfUser: userType}).exec();
            }
        }  catch(error){
            console.error('Error saving changes:', error);
            throw new InternalServerErrorException('Error saving changes');
        }
        }

        /*
            getAllUser -> restituisce una lista di tutti gli utenti.
        */
        
            async getAllUsers(){
             
                  const basicUsers = await this.getUserByType('USER_NORMALE');
                  const smmUsers = await this.getUserByType('SMM');
                  const squealerUsers = await  this.getUserByType('SQUEALER');
            
                  return [...basicUsers,  ...smmUsers, ...squealerUsers];
               
              }

               /*
                 filterUserByPopularity -> in base all'indice di popolarità filtra i BasicUser o i VipUser.
               */
                 async filterUsersByPopularity(popularityThreshold: number) {
                    try{
                    const basicUsers = await this.basicUserModel.find({typeOfUser: 'USER_NORMALE'});
                    const vipUsers = await this.basicUserModel.find({typeOfUser: 'VIP'});
                    
                    const filteredBasicUsers = basicUsers.filter(user => user.popularityIndex >= popularityThreshold);
                    const filteredVipUsers = vipUsers.filter(user => user.popularityIndex >= popularityThreshold);
                    
                    return [...filteredBasicUsers, ...filteredVipUsers];
                    } catch(error){
                        console.log(error);
                    }
                    
                  }
                  
                /*
                    BlockUser-> Lo squealer moderator può manualmente bloccare un utente
                */

                async blockUser(_id: string){
                    try{
                    let user = await this.usersService.getUserById(_id);
                    if (!user || user.typeofUser === 'SQUEALER') {
                        throw new NotFoundException('Impossible to block');
                    }
                    user.isBlocked = true;
                    await user.save();
                    return true;
                } catch(error){
                    console.log(error);
                }
                }

                /*
                    UnblockUser
                */
               async unblockUser(_id:string){
                try{
                const user = await this.usersService.getUserById(_id);
                    if (!user || user.typeofUser === 'SQUEALER') {
                        throw new Error('Impossible to unblock');
                    }
                    user.isBlocked = false;
                    await user.save();
                    return true;
                } catch(error){
                    console.log(error);
                }

               }

               /*
                    addCharacter(toAdd, typeOfCharactersNeeded, _id) -> permette di aumentare i caratteri residui giornalieri
               */
              async addCharacter(toAdd: number, typeOfCharactersNeeded: string, _id: string){
                try{
                const user = await this.usersService.getUserById(_id);
                if (!user || user.typeofUser === 'SQUEALER' || user.typeOfUser === 'SMM') {
                    throw new Error('Impossible to add characters');
                }
                
                switch(typeOfCharactersNeeded){
                    case 'GIORNALIERI':
                        user.caratteri_giornalieri_rimanenti += toAdd
                        break;
                    case 'SETTIMANALI':
                        user.caratteri_settimanali_rimanenti += toAdd
                        break;
                    case 'MENSILI':
                        user.caratteri_mensili_rimanenti += toAdd
                        break;
                    default:
                        break;
                }
                await user.save();
                return true;
            } catch(error){
                console.log(error);
            }
              }

              async removeCharacter(toRemove: number, typeOfCharactersNeeded: string, _id: string){
                try{
                const user = await this.usersService.getUserById(_id);
                if (!user || user.typeofUser === 'SQUEALER' || user.typeOfUser === 'SMM') {
                    throw new Error('Impossible to remove characters');
                }
                
                switch(typeOfCharactersNeeded){
                    case 'GIORNALIERI':
                        user.caratteri_giornalieri_rimanenti -= toRemove
                        break;
                    case 'SETTIMANALI':
                        user.caratteri_settimanali_rimanenti -= toRemove
                        break;
                    case 'MENSILI':
                        user.caratteri_mensili_rimanenti -= toRemove
                        break;
                    default:
                        break;
                }
                await user.save();
                return true;
            } catch(error){
                console.log(error);
            }
              }

              /*
                    TODO -> Aggiungere funzioni riguardanti canali e squeals.
              */
            }
        
        

    

