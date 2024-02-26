import { InputType, Field, ID, Int, Float } from '@nestjs/graphql';

@InputType()
export class CreateSquealInput {
  @Field( () => String, {nullable: true})
  typeOfUpload?: string;

  @Field( () => String, {nullable: true})
  text?: string;

  @Field(() => [ID], { nullable: true })
  destinationChannels?: string[];

  @Field(() => [ID], { nullable: true })
  destinationUserIds?: string[];

  @Field(() => [ID], { nullable: true })
  mentionedUserIds?: string[];

  @Field(() => String, { nullable: true })
  keyword?: string;

  @Field(() => Float, { nullable: true })
  lat?: number;

  @Field(() => Float, { nullable: true })
  lng?: number;

  @Field(() => Int, { nullable: true })
  delay?: number;

  @Field(() => Int, { nullable: true })
  repetitions?: number;

  @Field(() => Int, { nullable: true })
  charactersCost?: number
}
