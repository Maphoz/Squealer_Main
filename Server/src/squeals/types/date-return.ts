import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class DateReturn {
  @Field(() => Date)
  date: Date;

  @Field(() => Int)
  number: number;
}