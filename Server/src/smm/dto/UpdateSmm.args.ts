import { InputType, Field, ID, Int, Float } from '@nestjs/graphql';
import { UserType } from 'src/users/user.enum';

@InputType()
export class UpdateSmm {
  @Field( () => String, {nullable: true})
  email?: string;

  @Field( () => String, {nullable: true})
  username?: string;

  @Field( () => String, {nullable: true})
  bio?: string;

  @Field(() => Float, {nullable: true})
  price?: number;
}
