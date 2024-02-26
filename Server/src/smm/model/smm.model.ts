import { Field, Float, ObjectType } from "@nestjs/graphql";
import { User } from "src/users/models/user.model";
import { Review } from "../dto/review.model";

@ObjectType()
export class SMMUser extends User{
    @Field(() => [String])
    assistedList: string[];

    @Field(() => Boolean)
    isBlocked: boolean;

    @Field(() => String, { nullable: true })
    profileImage?: string;

    @Field(() => String, {nullable: true})
    bio?: string;

    @Field(() => Float, {nullable: true})
    price?: number;

    @Field(() => Float)
    rating: number;

    @Field(() => [Review])
    reviews: Review[];

    @Field(() => Float)
    income: number;
}
