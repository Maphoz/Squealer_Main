import { Field, InputType } from "@nestjs/graphql";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";
import { User } from "src/users/models/user.model";
import { UserType } from "src/users/user.enum";
import { GraphQLUpload, FileUpload, Upload } from 'graphql-upload';

/*
    Elementi da prendere in considerazione per creare un nuovo utente

*/

@InputType()
export class CompleteRegistrationInput {
    @Field(type => FileUpload)
    readonly profileImage?: FileUpload;

    @Field()
    @IsString()
    readonly bio?: string;


}