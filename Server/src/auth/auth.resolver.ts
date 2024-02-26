import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { Res, UseGuards } from '@nestjs/common';
import { CurrentUser } from './current-user.decorator';
import { AuthService } from './auth.service';
import { User } from 'src/users/models/user.model';
import { Response } from 'express';
import { LoginResponse } from './dto/login.response';
import { LoginUserInput } from './dto/login.user.input';
import { GqlAuthGuard } from './guards/gql-auth.guards';
import { JwtGuard } from './guards/jwt-auth.guard';
import { UserUnion } from 'src/users/user-union';
@Resolver()
export class AuthResolver {

    constructor(private readonly authService: AuthService) {}

    @Mutation(() => LoginResponse)
    @UseGuards(GqlAuthGuard)
    async login(@Args('loginUserInput') loginUserInput: LoginUserInput, @Context(){req, res}: {req: Request, res: Response}) {
        const { accessToken, user } = await this.authService.login(loginUserInput);

       if(user){
        if(user.isBlocked === true){
            throw new Error("User is blocked");
        }
        
        const expires = new Date();
        expires.setHours(
            expires.getHours() + 16,
        );
        res.cookie('Authentication', accessToken, {
            expires,
            httpOnly: true
        });
       }
       return { accessToken, user };
    }
    
    @UseGuards(JwtGuard)
    @Mutation(() => Boolean)
    async logout( @Context(){req, res}: {req: Request, res: Response}){
        res.cookie('Authentication', '');
        return true;
    }

    @Query(() => [String])
    async getCurrentUser(@Args('token') token: string){
        return await this.authService.getCurrentUser(token);
    }

}
