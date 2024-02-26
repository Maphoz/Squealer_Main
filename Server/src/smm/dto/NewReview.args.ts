import { InputType, Field, ID, Int, Float } from '@nestjs/graphql';
import { UserType } from 'src/users/user.enum';

@InputType()
export class NewReview {
  @Field(() => String)
    text: string;

  @Field(() => Float)
  rating: number
}