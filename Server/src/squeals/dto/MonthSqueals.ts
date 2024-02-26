import { Field, ObjectType } from "@nestjs/graphql";
import { BasicUser } from "src/basicusers/model/basic-user.model";
import { lineData } from "./lineData";

@ObjectType()
export class MonthSqueals{
  @Field(() => [lineData])
  controverse: lineData[];

  @Field(() => [lineData])
  popular: lineData[];
  
  @Field(() => [lineData])
  impopular: lineData[];

  @Field(() => [lineData])
  normal: lineData[];
}