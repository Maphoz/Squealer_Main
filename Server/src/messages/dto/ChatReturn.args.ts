import { Field, ObjectType } from "@nestjs/graphql";
import { BasicUser } from "src/basicusers/model/basic-user.model";
import { Squeal } from "src/squeals/model/squeal.model";
import { Message } from "./message.model";
import { MessageDocument } from "./message.schema";

@ObjectType()
export class ChatReturn{
  @Field(() => [Message])
  chats: Message[];
  
  @Field(( ) => [BasicUser])
  clients: BasicUser[];
}