import { Field, ObjectType } from "@nestjs/graphql";
import { BasicUser } from "src/basicusers/model/basic-user.model";
import { SMMUser } from "../model/smm.model";
import { SmmUserDocument } from "../model/smm.schema";

@ObjectType()
export class SmmProfile{
  @Field(() => SMMUser)
  smm: SMMUser;

  @Field(( ) => [BasicUser], {nullable: true})
  reviewers?: BasicUser[];
}