import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { SchemaTypes, Types } from "mongoose";
import { ChannelType } from "../dto/types/channels.enum";

/*
    Crea un nuovo documento per Mongo
*/

export type ChannelDocument = Channel & Document;

@Schema()
export class Channel{
  @Prop({required: true})
  _id: string;

 @Prop({nullable: true})
  name: string;

 @Prop({nullable: true})
  description?: string;

  @Prop({type: String})
  channelType: ChannelType;

  @Prop({nullable: true})
  channelImage?: string;

  @Prop({nullable: true})
  keyword?: string;

  @Prop({nullable: true})
  owners?: string[];

  @Prop()
  createdAt: string;

  @Prop({nullable: true})
  partecipants?: string[];

  @Prop()
  squeals: string[];

  @Prop({nulalble: true})
  expireAt?: Date;

  @Prop()
  isBlocked: boolean;

}

export const ChannelSchema = SchemaFactory.createForClass(Channel)