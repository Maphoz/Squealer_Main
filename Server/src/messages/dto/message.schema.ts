import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { SchemaTypes, Types } from "mongoose";
import { SingleMessage } from "./singleMessage.model";

/*
    Crea un nuovo documento per Mongo
*/

@Schema({versionKey: false})
export class MessageDocument{
    @Prop({type: SchemaTypes.ObjectId})
    _id: Types.ObjectId;
    
    @Prop()
    smmId: string

    @Prop()
    clientId: string

    @Prop()
    texts: SingleMessage[];
}

export const MessageSchema = SchemaFactory.createForClass(MessageDocument)