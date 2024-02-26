import { Inject, Injectable, forwardRef } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { MessageDocument } from "./dto/message.schema";
import { BasicusersService } from "src/basicusers/basicusers.service";
import { UsersService } from "src/users/users.service";
import { ChatReturn } from "./dto/ChatReturn.args";
import { BasicUser } from "src/basicusers/model/basic-user.model";
import { Message } from "./dto/message.model";



@Injectable()
export class MessagesService {

    constructor(
        @InjectModel('Message') private readonly messageModel: Model<MessageDocument>,
        @Inject(forwardRef( () => UsersService)) private readonly userService: UsersService,

    ){}


    async createMessageChannel(smmId: string, clientId: string) : Promise<MessageDocument> {
      const newMessage = new this.messageModel({
        _id: new Types.ObjectId(),
        clientId: clientId,
        smmId: smmId,
        texts: []
      });

      await newMessage.save();
      return newMessage;
    }

    async deleteMessageChannel(channelId: string) : Promise<boolean>{
      const message = await this.messageModel.findById(channelId);
      if(!message) throw new Error("Canale di messaggi non trovato");

      await message.deleteOne();
      return true;
    }

    async addMessage(senderId: string, text: string, channelId: string) : Promise<MessageDocument> {
      const channel = await this.messageModel.findById(channelId);
      if(!channel) throw new Error("Canale di messaggi non trovato");

      await channel.texts.push({
        text: text,
        senderId: senderId,
        date: new Date()
      })
      await channel.save();
      return channel;
    }

    async getChatsSmm(userId: string) : Promise<ChatReturn>{
      const channels = await this.messageModel.find({smmId: userId});
      if(!channels) return null;

      var users = [];
      for (const channel of channels){
        const user = await this.userService.getUserById(channel.clientId);
        users.push(user);
      }
      return({
        chats: channels as unknown as Message[],
        clients: users as unknown as BasicUser[]
      })
    }
}


