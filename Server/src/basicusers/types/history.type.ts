import { ObjectType, Field } from "@nestjs/graphql";

@ObjectType()
export class History {
  @Field(() => String)
  id: string;

  @Field(() => String)
  type: string;
}
