import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class UserTypeReturn {
  @Field(() => String)
  userType: string;

  @Field(() => Int)
  number: number;
}

