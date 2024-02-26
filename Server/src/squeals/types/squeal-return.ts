import { ObjectType, Field } from '@nestjs/graphql';
import { Squeal } from '../model/squeal.model';
import { BasicUser } from 'src/basicusers/model/basic-user.model';

@ObjectType()
export class SquealReturn {
  @Field(() => Squeal)
  squeal: Squeal;

  @Field(() => BasicUser)
  user: BasicUser;
}