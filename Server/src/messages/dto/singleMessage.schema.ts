import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { SchemaTypes, Types } from "mongoose";

/*
    Crea un nuovo documento per Mongo
*/

@Schema({versionKey: false})
export class SingleMessageDocument{
    @Prop({type: Date})
    date: Date
    
    @Prop()
    text: string;

    @Prop()
    senderId: string;
}

export const SingleMessageSchema = SchemaFactory.createForClass(SingleMessageDocument)