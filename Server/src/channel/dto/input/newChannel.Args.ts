import { Field, InputType, Float, Int } from "@nestjs/graphql";
import { ChannelType } from "../types/channels.enum";
import { GraphQLUpload, FileUpload, Upload } from 'graphql-upload';

@InputType()
export class NewChannelArgs {
  @Field(() => String)
  name: string;

  @Field( () => String, { nullable: true} )
  description?: string;
  
  @Field(() => String)
  channelType: ChannelType;

  @Field(() => String, {nullable: true})
  keyword?: string;
}