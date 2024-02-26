import { Field, ObjectType } from "@nestjs/graphql";
import { User } from "src/users/models/user.model";

@ObjectType()
export class SquealerUser extends User{

    @Field(() => [String])
    channels: string[]

    @Field(() => [String])
    squeals: string[]

}