import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { SchemaTypes, Types } from "mongoose";

/*
    Crea un nuovo documento per Mongo
*/

@Schema({versionKey: false})
export class NotificationDocument{
    @Prop({type: SchemaTypes.ObjectId})
    _id: Types.ObjectId;
    
    //indica se la notifica è stata generata da un utente o da un canale
    @Prop()
    senderType: string

    //tipo di notifica, utile per il frontend per come rappresentare
    @Prop()
    notificationType: string

    @Prop({nullable: true})
    channelReceiverId?: string

    @Prop()
    senderName: string

    @Prop()
    active: boolean

    @Prop()
    senderId: string

    @Prop()
    receiversId: string[]

    @Prop()
    notificationText: string

    @Prop({type: Date})
    createdAt: Date

    @Prop({nullable: true})
    squealId?: string
}

export const NotificationSchema = SchemaFactory.createForClass(NotificationDocument)