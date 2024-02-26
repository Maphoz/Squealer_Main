import { Field, Int, ObjectType } from "@nestjs/graphql";
@ObjectType()
export class lineData{
  @Field(() => String)
  label: string;

  @Field(() => Int)
  value: number;
}