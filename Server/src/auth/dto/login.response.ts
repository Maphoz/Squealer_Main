import { Field, ObjectType } from "@nestjs/graphql";
import { User } from "src/users/models/user.model";

@ObjectType()
export class LoginResponse{
    @Field()
    accessToken: string;

    @Field(() => User)
    user: User;
}