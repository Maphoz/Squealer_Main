import { Inject, Injectable, InternalServerErrorException, forwardRef } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { UserDocument } from "src/users/models/user.schema";
import { NotificationDocument } from "./notification.schema";
import { NotificationInput } from "./dto/notificationInput";
import { NotificationType } from "./dto/notification.enum";
import { GetUserArgs } from "src/users/dto/args/get-user-args.dto";
import { UsersService } from "src/users/users.service";
import { FriendsService } from "src/friends/friends.service";
import { ChannelService } from "src/channel/channel.service";
import { NotificationFeed } from "./dto/NotificationFeed.args";
import { SmmService } from "src/smm/smm.service";
import { BasicusersService } from "src/basicusers/basicusers.service";



@Injectable()
export class NotificationsService {
    private interatcionNotifications = [NotificationType.POS_REAC, NotificationType.NEG_REAC, NotificationType.NEW_COMM, NotificationType.REV, NotificationType.MEN];

    constructor(
        @InjectModel('Notification') private readonly notificationModel: Model<NotificationDocument>,

        private readonly usersSerivce: UsersService,
        private readonly friendsService: FriendsService,
        private readonly channelsService: ChannelService,
        @Inject(forwardRef( () => BasicusersService)) private readonly basicUserService: BasicusersService,
    ){}



    /**
     * NOTIFICATION CREATION FUNCTIONS
     */


    /**
     * 
     * @param notificationInfo include mittente, destinatari, tipo di notifica e tipo di mittente
     * 
     * Id determinato randomicamente, testo generato in base al tipo di notifica
     */


    /**
     * 
     * FRIEND NOTIFICATION CREATIONS
     */
    async createFriendRequestNotification(notificationInfo: NotificationInput) : Promise<NotificationDocument>{
        try{
        const newFriendReq = new this.notificationModel({
            senderType: 'user',
            active: true,
            senderId: notificationInfo.senderId,
            receiversId: [...notificationInfo.receiversId],
            notificationText: await this.sendFriendRequestText(notificationInfo.senderName),
            notificationType: NotificationType.FR_REQ,
            createdAt: new Date(),
            _id: new Types.ObjectId(),
            senderName: notificationInfo.senderName
        })
        await newFriendReq.save();
        return newFriendReq;
    } catch(error){
        console.log(error);
    }
    }

    async createFriendAcceptedNotification(notificationInfo: NotificationInput) : Promise<NotificationDocument>{
         try{
        const newFriendReq = new this.notificationModel({
            senderType: 'user',
            active: true,
            senderId: notificationInfo.senderId,
            receiversId: [...notificationInfo.receiversId],
            notificationText: await this.friendAcceptedText(notificationInfo.senderName),
            createdAt: new Date(),
            notificationType: NotificationType.FR_ACC,
            _id: new Types.ObjectId(),
            senderName: notificationInfo.senderName
        })
        await newFriendReq.save();
        return newFriendReq;
    } catch(error){
        console.log(error);
    }
    }

    async createFriendRefusedNotification(notificationInfo: NotificationInput) : Promise<NotificationDocument>{
        try{
        const newFriendReq = new this.notificationModel({
            senderType: 'user',
            active: true,
            senderId: notificationInfo.senderId,
            receiversId: [...notificationInfo.receiversId],
            notificationText: await this.friendDeniedText(notificationInfo.senderName),
            createdAt: new Date(),
            notificationType: NotificationType.FR_REF,
            _id: new Types.ObjectId(),
            senderName: notificationInfo.senderName
        })
        await newFriendReq.save(); 
        return newFriendReq;
    } catch(error){
        console.log(error);
    }
    }

    /**
     * CHANNEL NOTIFICATION CREATIONS
     */

    async createChannelRequestNotification(notificationInfo: NotificationInput) : Promise<NotificationDocument>{
        try{
        const newFriendReq = new this.notificationModel({
            senderType: 'user',
            active: true,
            senderId: notificationInfo.senderId,
            receiversId: [...notificationInfo.receiversId],
            notificationText: await this.sendChannelRequestText(notificationInfo.senderName, notificationInfo.channelName),
            notificationType: NotificationType.CH_ADDUSER_REQ,
            createdAt: new Date(),
            _id: new Types.ObjectId(),
            senderName: notificationInfo.senderName,
            channelReceiverId: notificationInfo.channelReceiverId
        })
        await newFriendReq.save();
        return newFriendReq;
    } catch(error){
        console.log(error);
    }
    }

    async createChannelAcceptNotification(notificationInfo: NotificationInput) : Promise<NotificationDocument>{
        try{
        const newFriendReq = new this.notificationModel({
            senderType: 'user',
            active: true,
            senderId: notificationInfo.senderId,
            receiversId: [...notificationInfo.receiversId],
            notificationText: await this.channelAcceptedText(notificationInfo.senderName, notificationInfo.channelName),
            notificationType: NotificationType.CH_ADDUSER_ACC,
            createdAt: new Date(),
            _id: new Types.ObjectId(),
            senderName: notificationInfo.senderName
        })
        await newFriendReq.save();
        return newFriendReq;
    } catch(error){
        console.log(error);
    }
    }

    async createChannelRefusedNotification(notificationInfo: NotificationInput) : Promise<NotificationDocument>{
        try{
        const newFriendReq = new this.notificationModel({
            senderType: 'user',
            active: true,
            senderId: notificationInfo.senderId,
            receiversId: [...notificationInfo.receiversId],
            notificationText: await this.channelDeniedText(notificationInfo.senderName, notificationInfo.channelName),
            notificationType: NotificationType.CH_ADDUSER_REF,
            createdAt: new Date(),
            _id: new Types.ObjectId(),
            senderName: notificationInfo.senderName
        })
        await newFriendReq.save();
        return newFriendReq;
    } catch(error){
        console.log(error);
    }
    }

    /**
     * INTERACTION NOTIFICATION CREATION
     */

    async createNewCommentNotification(notificationInfo: NotificationInput) : Promise<NotificationDocument>{
        try{
        const newFriendReq = new this.notificationModel({
            senderType: 'user',
            active: true,
            senderId: notificationInfo.senderId,
            receiversId: [...notificationInfo.receiversId],
            notificationText: await this.newCommentText(notificationInfo.senderName),
            notificationType: NotificationType.NEW_COMM,
            createdAt: new Date(),
            _id: new Types.ObjectId(),
            senderName: notificationInfo.senderName
        })
        await newFriendReq.save();
        return newFriendReq;
    } catch(error){
        console.log(error);
    }
    }

    async createNewMentionNotification(notificationInfo: NotificationInput) : Promise<NotificationDocument>{
        try{
        const newFriendReq = new this.notificationModel({
            senderType: 'user',
            active: true,
            senderId: notificationInfo.senderId,
            receiversId: [...notificationInfo.receiversId],
            notificationText: await this.newMentionText(notificationInfo.senderName),
            notificationType: NotificationType.MEN,
            createdAt: new Date(),
            _id: new Types.ObjectId(),
            senderName: notificationInfo.senderName
        })
        await newFriendReq.save();
        return newFriendReq;
    } catch(error){
        console.log(error);
    }
    }

    async createPositiveReactionNotification(notificationInfo: NotificationInput) : Promise<NotificationDocument>{
        try{
        const newFriendReq = new this.notificationModel({
            senderType: 'user',
            active: true,
            senderId: notificationInfo.senderId,
            receiversId: [...notificationInfo.receiversId],
            notificationText: await this.positiveReactionText(notificationInfo.senderName),
            notificationType: NotificationType.POS_REAC,
            createdAt: new Date(),
            _id: new Types.ObjectId(),
            senderName: notificationInfo.senderName
        })
        await newFriendReq.save();
        return newFriendReq;
    } catch(error){
        console.log(error);
    }
    }

    async createNegativeReactionNotification(notificationInfo: NotificationInput) : Promise<NotificationDocument>{
        try{
        const newFriendReq = new this.notificationModel({
            senderType: 'user',
            active: true,
            senderId: notificationInfo.senderId,
            receiversId: [...notificationInfo.receiversId],
            notificationText: await this.negativeReactionText(notificationInfo.senderName),
            notificationType: NotificationType.NEG_REAC,
            createdAt: new Date(),
            _id: new Types.ObjectId(),
            senderName: notificationInfo.senderName
        })
        await newFriendReq.save();
        return newFriendReq;
    } catch(error){ 
        console.log(error);
    }
    }

    async createReviewNotification(notificationInfo: NotificationInput) : Promise<NotificationDocument>{
        try{
        const newFriendReq = new this.notificationModel({
            senderType: 'user',
            active: true,
            senderId: notificationInfo.senderId,
            receiversId: [...notificationInfo.receiversId],
            notificationText: await this.newReviewText(notificationInfo.senderName),
            notificationType: NotificationType.REV,
            createdAt: new Date(),
            _id: new Types.ObjectId(),
            senderName: notificationInfo.senderName
        })
        await newFriendReq.save();
        return newFriendReq;
    }   catch(error){
        console.log(error);
    }
    }

    async createSmmRequestNotification(notificationInfo: NotificationInput) : Promise<NotificationDocument>{
        try{
        const newFriendReq = new this.notificationModel({
            senderType: 'user',
            active: true,
            senderId: notificationInfo.senderId,
            receiversId: [...notificationInfo.receiversId],
            notificationText: await this.sendSmmText(notificationInfo.senderName),
            notificationType: NotificationType.SMM_REQ,
            createdAt: new Date(),
            _id: new Types.ObjectId(),
            senderName: notificationInfo.senderName,
        })
        await newFriendReq.save();
        return newFriendReq;
    } catch(error){
        console.log(error);
    }
    }

    async createSmmAcceptedNotification(notificationInfo: NotificationInput) : Promise<NotificationDocument>{
        try{
        const newFriendReq = new this.notificationModel({
            senderType: 'user',
            active: true,
            senderId: notificationInfo.senderId,
            receiversId: [...notificationInfo.receiversId],
            notificationText: await this.smmAcceptedText(notificationInfo.senderName),
            createdAt: new Date(),
            notificationType: NotificationType.SMM_ACC,
            _id: new Types.ObjectId(),
            senderName: notificationInfo.senderName
        })
        await newFriendReq.save();
        return newFriendReq;
    } catch(error){
        console.log(error);

    }
    }

    async createSmmRefusedNotification(notificationInfo: NotificationInput) : Promise<NotificationDocument>{
        try{
        const newFriendReq = new this.notificationModel({
            senderType: 'user',
            active: true,
            senderId: notificationInfo.senderId,
            receiversId: [...notificationInfo.receiversId],
            notificationText: await this.smmDeniedText(notificationInfo.senderName),
            createdAt: new Date(),
            notificationType: NotificationType.SMM_REF,
            _id: new Types.ObjectId(),
            senderName: notificationInfo.senderName
        })
        await newFriendReq.save(); 
        return newFriendReq;
    } catch(error){
        console.log(error);
    }
    }

    /**
     * GENERAL NOTIFICATIONS QUERIES
     */




    async getNotifications(userId: string) : Promise<NotificationFeed>{
        try{
        const interactiveNot = await this.notificationModel.find({ receiversId: { $in: userId }, notificationType: {
            $in: this.interatcionNotifications
          }}).exec();
        

        const relationalNot =  await this.notificationModel.find({ receiversId: { $in: userId }, notificationType: {
            $nin: this.interatcionNotifications
          }
          }).exec();


        return {
            relationalNotifications: relationalNot.reverse(),
            interactiveNotifications: interactiveNot.reverse()
        };
    } catch(error){
        console.log(error);
    }
    }


    async sendFriendRequest(userId: string, friendId: string){
        try{
        const user = await this.usersSerivce.getUserById(userId);

        if(!user){
            throw new Error("User not found");
        }

        const friend = await this.usersSerivce.getUserById(friendId);

        if(!friend){
            throw new Error("User not found");
        }

        const notification = await this.createFriendRequestNotification({
            senderId: userId,
            receiversId: [friendId],
            senderType: 'user',
            notificationType: NotificationType.FR_REQ,
            senderName: user.username
        })

        if(!notification){
            throw new Error("Errore nella richiesta");
        }

        return(`richiesta ${notification._id} inviata`);
    } catch(error){
        console.log(error);
    }
    }


    async acceptFriendRequest(userId: string, notificationId: string) : Promise<NotificationFeed>{
        try{
        const notification = await this.notificationModel.findOne({_id: notificationId});
        if(!notification){
            throw Error("Errore con la notifica");
        }

        const user = await this.usersSerivce.getUserById(userId);
        if(!user){
            throw new Error("Utente non trovato")
        }

        await this.friendsService.addFriend(notification.senderName, user.username);


        notification.active = false;
        notification.notificationText = `Hai accettato la richiesta di amicizia di ${notification.senderName}!`;
        await notification.save();

        const newNotification = await this.createFriendAcceptedNotification({
            senderId: userId,
            receiversId: [notification.senderId],
            senderName: user.username,
            senderType: 'user',
            notificationType: 'boh'
        });

        return await this.getNotifications(userId);
    } catch(error){ 
        console.log(error);
    }
    } 


    async refuseFriendRequest(userId: string, notificationId: string) : Promise<NotificationFeed>{
        try{
        const notification = await this.notificationModel.findOne({_id: notificationId});
        if(!notification){
            throw Error("Errore con la notifica");
        }

        const user = await this.usersSerivce.getUserById(userId);
        if(!user){
            throw new Error("Utente non trovato")
        }


        notification.active = false;
        notification.notificationText = `Hai rifiutato la richiesta di amicizia di ${notification.senderName}!`;
        await notification.save();

        const newNotification = await this.createFriendRefusedNotification({
            senderId: userId,
            receiversId: [...notification.senderId],
            senderName: user.username,
            senderType: 'user',
            notificationType: 'boh'
        });

        return await this.getNotifications(userId);
    } catch(error){
        console.log(error);
    }
    }


    async sendChannelRequest(userId: string, channelId: string){
        try{
        const user = await this.usersSerivce.getUserById(userId);

        if(!user){
            throw new Error("User not found");
        }

        const channel = await this.channelsService.getChannelById(channelId);

        if(!channel){
            throw new Error("Channel not found");
        }

        const notification = await this.createChannelRequestNotification({
            senderId: userId,
            receiversId: [...channel.owners],
            senderType: 'user',
            notificationType: NotificationType.CH_ADDUSER_REQ,
            senderName: user.username,
            channelReceiverId: channelId,
            channelName: channel.name
        })

        if(!notification){
            throw new Error("Errore nella richiesta");
        }

        return(`richiesta ${notification._id} inviata`);
    } catch(error){
        console.log(error);
    }
    }

    async acceptChannelRequest(userId: string, notificationId: string) : Promise<NotificationFeed>{
        try{
        const notification = await this.notificationModel.findOne({_id: notificationId});
        if(!notification){
            throw Error("Errore con la notifica");
        }

        const user = await this.usersSerivce.getUserById(userId);
        if(!user){
            throw new Error("Utente non trovato")
        }

        const channel = await this.channelsService.getChannelById(notification.channelReceiverId);
        if(!channel)
            throw new Error("Canale non trovato!");
        await this.channelsService.addUserToChannel(notification.channelReceiverId, notification.senderId);

        notification.active = false;
        notification.notificationText = `Hai aggiunto ${notification.senderName} al canale ${channel.name}!`;
        await notification.save();

        const newNotification = await this.createChannelAcceptNotification({
            senderId: userId,
            receiversId: [notification.senderId],
            senderName: user.username,
            senderType: 'user',
            notificationType: 'boh',
            channelName: channel.name
        });

        return await this.getNotifications(userId);
    } catch(error){
        console.log(error);
    }
    } 

    async refuseChannelRequest(userId: string, notificationId: string) : Promise<NotificationFeed>{
        try{
        const notification = await this.notificationModel.findOne({_id: notificationId});
        if(!notification){
            throw Error("Errore con la notifica");
        }

        const user = await this.usersSerivce.getUserById(userId);
        if(!user){
            throw new Error("Utente non trovato")
        }

        const channel = await this.channelsService.getChannelById(notification.channelReceiverId);
        if(!channel)
            throw new Error("Canale non trovato!");


        notification.active = false;
        notification.notificationText = `Hai rifiutato l'aggiunta di ${notification.senderName} al canale ${channel.name}.`;
        await notification.save();

        const newNotification = await this.createChannelRefusedNotification({
            senderId: userId,
            receiversId: [notification.senderId],
            senderName: user.username,
            senderType: 'user',
            notificationType: 'boh',
            channelName: channel.name
        });

        return await this.getNotifications(userId);
    } catch(error){
        console.log(error);
    }
    } 

    async sendSmmRequest(userId: string, smmId: string){
        try{
        const user = await this.usersSerivce.getUserById(userId);

        if(!user){
            throw new Error("User not found");
        }

        const smm = await this.usersSerivce.getUserById(smmId);

        if(!smm){
            throw new Error("User not found");
        }

        const notification = await this.createSmmRequestNotification({
            senderId: userId,
            receiversId: [smmId],
            senderType: 'user',
            notificationType: NotificationType.SMM_REQ,
            senderName: user.username
        })

        if(!notification){
            throw new Error("Errore nella richiesta");
        }

        return(`richiesta ${notification._id} inviata`);
    } catch(error){
        console.log(error);
    }
    }

    async acceptSmmRequest(userId: string, notificationId: string) : Promise<NotificationFeed>{
        try{
        const notification = await this.notificationModel.findOne({_id: notificationId});
        if(!notification){
            throw Error("Errore con la notifica");
        }

        const smm = await this.usersSerivce.getUserById(userId);
        if(!smm){
            throw new Error("Utente non trovato")
        }

        await this.basicUserService.addSmmToVip(userId, notification.senderId);


        notification.active = false;
        notification.notificationText = `Sei diventato il Social Media Manager di ${notification.senderName}!`;
        await notification.save();

        const newNotification = await this.createSmmAcceptedNotification({
            senderId: userId,
            receiversId: [notification.senderId],
            senderName: smm.nome + " " + smm.cognome,
            senderType: 'user',
            notificationType: 'boh'
        });

        return await this.getNotifications(userId);
    } catch(error){
        console.log(error);
    }
    } 


    async refuseSmmRequest(userId: string, notificationId: string) : Promise<NotificationFeed>{
        try{
        const notification = await this.notificationModel.findOne({_id: notificationId});
        if(!notification){
            throw Error("Errore con la notifica");
        }

        const smm = await this.usersSerivce.getUserById(userId);
        if(!smm){
            throw new Error("Utente non trovato")
        }


        notification.active = false;
        notification.notificationText = `Hai rifiutato di lavorare con ${notification.senderName}!`;
        await notification.save();

        const newNotification = await this.createSmmRefusedNotification({
            senderId: userId,
            receiversId: [...notification.senderId],
            senderName: smm.nome + " " + smm.cognome,
            senderType: 'user',
            notificationType: 'boh'
        });

        return await this.getNotifications(userId);
    } catch(error){
        console.log(error);
    }
    }


    /**
     * 
     * NOTIFICATION TEXT GENERATION
     */


    async sendSmmText(username: string){
        return `${username} ti ha chiesto se vuoi diventare il suo Social Media Manager!`;
    }

    async smmAcceptedText(username: string){
        return `${username} è ufficialmente il tuo Social Media Manager!`
    }

    async smmDeniedText(username: string){
        return `${username} si è rifiutato di diventare il tuo Social Media Manager!`
    }

    async sendFriendRequestText(username: string){
        return `${username} ti ha inviato una richiesta di amicizia!`;
    }

    async friendAcceptedText(username: string){
        return `${username} ha accettato la tua richiesta di amicizia!`
    }

    async friendDeniedText(username: string){
        return `${username} ha rifiutato la tua richiesta di amicizia.`
    }

    async sendChannelRequestText(username: string, channelName: string){
        return `${username} ha inviato una richiesta per unirsi al canale ${channelName}!`;
    }

    async channelDeniedText(username: string, channelName: string){
        return `${username} ha rifiutato la tua richiesta per unirsi al canale ${channelName}.`;
    }

    async channelAcceptedText(username: string, channelName: string){
        return `${username} ha accettato la tua richiesta per unirsi al canale ${channelName}!`;
    }

    async newCommentText(username: string){
        return `${username} ha commentato il tuo post!`;
    }

    async newMentionText(username: string){
        return `${username} ti ha menzionato in un suo post!`;
    }

    async positiveReactionText(username: string){
        return `${username} ha reagito positivamente al tuo post!`;
    }

    async negativeReactionText(username: string){
        return `${username} ha reagito negativamente al tuo post!`;
    }

    async newReviewText(username: string){
        return `${username} ti ha lasciato una recensione!`;
    }
    /**
     * CHECKS FOR EXISTING NOTIFICATIONS
     * 
     */

    async checkFriendRequest(userId1: string, userId2: string) : Promise<boolean>{
        //check if there is a notification of type FR_REQ from userId1 to userId2
        try{
        const notification = await this.notificationModel.findOne({ 
            senderId: userId1, 
            receiversId: { $in: userId2 },
            notificationType: NotificationType.FR_REQ,
            active: true
        });
        if(notification){
            return true;
        }
        return false;
    } catch(error){
        console.log(error);
    }
    }

    async deleteSmmRequest(userId: string) : Promise<boolean>{
        try{
        const notification = await this.notificationModel.findOne({ 
            senderId: userId,
            notificationType: NotificationType.SMM_REQ,
            active: true
        });
        if(!notification){
            throw new Error("Non hai nessuna richiesta!")
        }
        await notification.deleteOne();
        return true
    } catch(error){ 
        console.log(error);
    }
    }

    async checkSmmRequest(userId: string) : Promise<boolean>{
        //check if there is a notification of type FR_REQ from userId1 to userId2
        try{
        const notification = await this.notificationModel.findOne({ 
            senderId: userId,
            notificationType: NotificationType.SMM_REQ,
            active: true
        });
        if(notification){
            return true;
        }
        return false;
    } catch(error){
        console.log(error);
    }
    }

    async checkChannelRequest(userId: string, channelId: string) : Promise<boolean>{
        //check if there is a notification of type CH_REQ from userId to channelId
        try{
        const notification = await this.notificationModel.findOne({ 
            senderId: userId, 
            channelReceiverId: channelId,
            notificationType: NotificationType.CH_ADDUSER_REQ,
            active: true
        });
        if(notification){
            return true;
        }
        return false;
    } catch(error){
        console.log(error);
    }
    }
}


