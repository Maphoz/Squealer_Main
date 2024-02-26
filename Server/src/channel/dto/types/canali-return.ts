import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class ChannelReturn {
  @Field(() => Date)
  date: Date;

  @Field(() => Int)
  number: number;
}
