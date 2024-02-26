import { Field, InputType, Int, ObjectType } from "@nestjs/graphql";
import { UserType } from "../user.enum";

@ObjectType()
export class User {
    @Field()
    _id: string;

    @Field()
    readonly email: string;

    @Field()
    username: string;

    @Field()
    nome: string;

    @Field()
    cognome: string;

    @Field()
    typeOfUser: UserType;

}