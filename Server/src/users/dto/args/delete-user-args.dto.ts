import { IsNotEmpty,  IsString } from "class-validator";
import { ArgsType, Field } from "@nestjs/graphql";

@ArgsType()
export class DeleteUserArgs {
    @Field()
    @IsString()
    @IsNotEmpty()
    _id: string;
}

