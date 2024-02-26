import { ObjectType, Field, Int, Float } from "@nestjs/graphql";
import { BasicUser } from "src/basicusers/model/basic-user.model";
import { Channel } from "src/channel/models/channel.model";
import { User } from "src/users/models/user.model";
import { UserUnion } from "src/users/user-union";


@ObjectType()
export class PotentialReceivers{
  @Field(type => [Channel])
  channels: Channel[];

  @Field(type => [BasicUser])
  friends: BasicUser[];
}