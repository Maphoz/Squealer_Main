import { ObjectType, Field } from "@nestjs/graphql";

@ObjectType()
export class RecoverData {
  @Field(() => String)
  recoverQuestion: string;

  @Field(() => String)
  recoverAnswer: string;
}
