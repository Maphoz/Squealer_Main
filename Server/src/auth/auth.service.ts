import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { User } from 'src/users/models/user.model';
import { UsersService } from 'src/users/users.service';
import { LoginUserInput } from './dto/login.user.input';
import * as bcrypt from 'bcrypt';
import { userInfo } from 'os';


@Injectable()
export class AuthService {

    constructor(private readonly jwtService: JwtService, private readonly usersService: UsersService) {}

    async validateUser(username: string, pass: string) {
        const user = await this.usersService.validateUser(username);
        if (!user) {
          throw new UnauthorizedException('User Not Found');
        }
        const passwordIsValid = await bcrypt.compare(pass, user.password);
        if (!passwordIsValid) {
          throw new UnauthorizedException('Password Not valid');
        } else {
          const {password, ...result} = user;
          return result;
        }
    }

    async login(loginUserInput: LoginUserInput){
        const username = loginUserInput.username;
        const user = await this.usersService.validateUser(username);
        if (!user) {
            throw new NotFoundException('Utente non trovato');
        }
        const accessToken = this.jwtService.sign({
            username: user.username,
            userType: user.typeOfUser,
            userId: user.id,
        },  {
          expiresIn: '6h'
        });
        const result = {
            accessToken,
            user,
        };
        return result;
    }
    
    /* get current loggedUser */
    async getCurrentUser(token: string){
      const decodedToken = this.jwtService.decode(token);
      return [decodedToken['sub'], decodedToken['username'], decodedToken['userType']];
    }

}
