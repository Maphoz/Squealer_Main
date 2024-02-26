import { Field, ObjectType } from "@nestjs/graphql";
import { BasicUser } from "src/basicusers/model/basic-user.model";
import { Squeal } from "src/squeals/model/squeal.model";

@ObjectType()
export class ClientActivity{
  @Field(() => [Squeal])
  squeals: Squeal[];
  
  @Field(( ) => BasicUser)
  client: BasicUser;
}