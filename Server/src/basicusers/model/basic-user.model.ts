import { Field, Float, Int, ObjectType } from "@nestjs/graphql";
import { type } from "os";
import { User } from "src/users/models/user.model";
import { History } from "src/basicusers/types/history.type";

@ObjectType()
export class BasicUser extends User{
    
    @Field(() => Int)
    caratteri_giornalieri: number;

    @Field(() => Int)
    caratteri_settimanali: number;

    @Field(() => Int)
    caratteri_mensili: number;

    @Field(() => Int)
    caratteri_giornalieri_rimanenti: number;

    @Field(() => Int)
    caratteri_settimanali_rimanenti: number;

    @Field(() => Int)
    caratteri_mensili_rimanenti: number;

    @Field(() => Int)
    caratteri_acquistabili: number;

    @Field(() => Int)
    caratteri_acquistabili_rimanenti: number;

    @Field({ nullable: true })
    profileImage?: string;
   
    @Field(() => [String]) 
    friends: string[]; 

    @Field(() => Float)
    popularityIndex: number;

    @Field(() => Boolean)
    isBlocked: boolean;

    @Field(() => [String])
    channels: string[];

    @Field(() => [String])
    squeals: string[];

    @Field(() => String, {nullable: true})
    bio?: string;

    @Field(type => [History])
    history: History[];

    @Field(() => [String], {nullable: true})
    temporaryChannels?: string[];

    @Field(() => String, {nullable: true})
    social_media_manager_id?: string;
    
    @Field(() => String)
    userType: string;

    @Field(() => [String])
    visualizedSqueals: string[];

    @Field(() => String)
    recoveryQuestion: string;

    @Field(() => String)
    recoveryAnswer: string;
}