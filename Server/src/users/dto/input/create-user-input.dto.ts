import { Field, InputType } from "@nestjs/graphql";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";
import { User } from "src/users/models/user.model";
import { UserType } from "src/users/user.enum";

/*
    Elementi da prendere in considerazione per creare un nuovo utente

*/

@InputType()
export class CreateUserInput {
    @Field()
    readonly email: string; 

    @Field()
    @IsNotEmpty()
    @IsString()
    readonly password: string;


    @Field()
    @IsNotEmpty()
    @IsString()
    readonly username: string;

    @Field()
    @IsNotEmpty()
    @IsString()
    readonly nome: string;

    @Field()
    @IsNotEmpty()
    @IsString()
    readonly cognome: string;

    @Field()
    @IsNotEmpty()
    @IsString()
    readonly recoveryQuestion: string;

    @Field()
    @IsNotEmpty()
    @IsString()
    readonly recoveryAnswer: string;

    @Field()
    @IsNotEmpty()
    @IsString()
    readonly typeOfUser: UserType;
}