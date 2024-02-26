import {Injectable, CanActivate, ExecutionContext} from "@nestjs/common"
import { GqlExecutionContext } from "@nestjs/graphql"
import { jwtConstants } from "../costant";

@Injectable()
export class JwtGuard implements CanActivate{
  async canActivate(context: ExecutionContext): Promise<boolean>{
    const jwt = require('jsonwebtoken');
    const ctx = GqlExecutionContext.create(context).getContext();
    const authorizationHeader = ctx.req.headers.authorization;
    
    if (authorizationHeader){
      const token = authorizationHeader.split(" ")[1];
      try{
        const userId = jwt.verify(token,jwtConstants.secret);
        ctx.userId = userId;
        return true;
      }
      catch(error){
        throw new Error("Invalid Token");
      }
    }
    else{
      return false;
    }
  }
}