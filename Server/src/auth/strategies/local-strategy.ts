import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { UsersService } from "src/users/users.service";
import { AuthService } from "../auth.service";
/*
    LocalStrategy -> Serve per il primo login, prende email e password e se sono giusti fa fare l'accesso
*/

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy){
    constructor(private readonly authService: AuthService){
        super()
    };

    async validate(username: string, password: string){
        const user = await this.authService.validateUser(username, password);
        if(!user){
            throw new UnauthorizedException();
        }
        return user;
    } 

}