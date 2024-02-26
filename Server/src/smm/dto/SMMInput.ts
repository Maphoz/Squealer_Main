import { InputType, Field, ID, Int, Float } from '@nestjs/graphql';
import { UserType } from 'src/users/user.enum';

@InputType()
export class CreateSMMInput {
  @Field( () => String)
  email: string;

  @Field( () => String)
  password: string;

  @Field( () => String)
  nome: string;

  @Field( () => String)
  cognome: string;

  @Field( () => String)
  username: string;

  @Field( () => String)
  bio: string;

  @Field(() => String)
  typeOfUser: UserType;

  @Field(() => Float)
  price: number;
}
