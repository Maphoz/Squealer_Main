import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { UserDocument } from "src/users/models/user.schema";
import { History } from "src/basicusers/types/history.type";
import { HistorySchema } from "../types/history.schema";

@Schema({versionKey: false})
export class BasicUserDocument extends UserDocument{
    @Prop()
    caratteri_giornalieri: number;

    @Prop()
    caratteri_settimanali: number;

    @Prop()
    caratteri_mensili: number;

    @Prop()
    caratteri_giornalieri_rimanenti: number;

    @Prop()
    caratteri_settimanali_rimanenti: number;

    @Prop()
    caratteri_mensili_rimanenti: number;

    @Prop()
    caratteri_acquistabili: number;

    @Prop()
    caratteri_acquistabili_rimanenti: number;

    @Prop()
    profileImage?: string; 

    @Prop()
    friends: string[];

    @Prop()
    popularityIndex: number;

    @Prop()
    isBlocked: boolean

    @Prop()
    channels: string[]

    @Prop()
    squeals: string[]

    @Prop()
    bio?: string;

    @Prop()
    history: History[];

    @Prop()
    temporaryChannels?: string[];

    @Prop({nullable: true})
    social_media_manager_id?: string;

    @Prop()
    userType: string;

    @Prop()
    visualizedSqueals: string[];

    @Prop()
    recoveryQuestion: string;

    @Prop()
    recoveryAnswer: string;
}

export const BasicUserSchema = SchemaFactory.createForClass(BasicUserDocument).add({
    caratteri_giornalieri: Number,
    caratteri_settimanali: Number,
    caratteri_mensili: Number,
    profileImage: String,
    friends: [String],
    popularityIndex: Number,
    isBlocked: Boolean,
    channels: [String],
    squeals: [String],
    bio: String,
    history: [HistorySchema],
    temporaryChannels: [String],
    social_media_manager_id: String,
  });