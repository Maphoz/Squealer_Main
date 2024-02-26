import { Field, ObjectType } from "@nestjs/graphql";
import { BasicUser } from "src/basicusers/model/basic-user.model";

@ObjectType()
export class ClientStats{
  @Field()
  totalPosts: number;

  @Field()
  totalPositive: number;

  @Field()
  totalNegative: number;

  @Field()
  totalComments: number;

  @Field()
  totalViews: number;

  @Field()
  populars: number;

  @Field()
  impopulars: number;

  @Field()
  controverse: number;

  @Field()
  regular: number;

  @Field(( ) => BasicUser)
  client: BasicUser;
}