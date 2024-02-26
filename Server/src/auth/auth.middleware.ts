import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import { jwtConstants } from './costant';
@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const token = req.cookies['AccessTokenMod'];
    if (!token) {
      return res.status(401).send('Access Denied');
    }
    try {
      const verified = verify(token, jwtConstants.secret);
      next();
    } catch (err) {
      res.status(400).send('Invalid Token');
    }
  }
}