import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { SchemaTypes, Types } from "mongoose";

/*
    Crea un nuovo documento per Mongo
*/

@Schema({versionKey: false})
export class UserDocument{
    @Prop({type: SchemaTypes.ObjectId})
    _id: Types.ObjectId;
    
    @Prop()
    email: string;

    @Prop()
    password: string;
    
    @Prop()
    username: string;

    @Prop()
    nome: string;

    @Prop()
    cognome: string;

    @Prop()
    typeOfUser: string;
}

export const UserSchema = SchemaFactory.createForClass(UserDocument)