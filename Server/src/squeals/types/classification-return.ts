import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class ClassificationReturn {
  @Field(() => String)
  type: string;

  @Field(() => Int)
  number: number;
}