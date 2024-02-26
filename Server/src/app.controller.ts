import { Controller, Get, Res, UseGuards } from '@nestjs/common';
import { join } from 'path';
import { Response } from 'express';
import { ActiveReactHTML, osamaReactPathFiles, osamaReactPathHTML, pathVueHTML , conoModPathHTMLlogin, conoModPathHTMLUsers, conoModPathHTMLCanUff, conoModPathHTMLCanPriv, conoModPathHTMLTemp, conoModPathHTMLCreate, conoModPathHTMLPubblica, conoModPathHTMLSqueals, conoModPathHTMLAnalisi, conoPathLandingPage, conoPathLandingPageHTML, pathVueHTMLServer, ModPath} from './const';
import { JwtGuard } from './auth/guards/jwt-auth.guard';
import { AuthMiddleware } from './auth/auth.middleware';

@Controller()
export class AppController {
  constructor() {}


  @Get('/app')
  catchApp(@Res() res: Response) {
    res.sendFile(ActiveReactHTML);
  }

  @Get('/app/*')
  catchAll(@Res() res: Response) {
    res.sendFile(ActiveReactHTML);
  }

  @Get('/smm')
  catchSmm(@Res() res: Response) {
    res.sendFile(pathVueHTMLServer);
  }

  @Get('/smm/*')
  catchAllSmm(@Res() res: Response) {
    res.sendFile(pathVueHTMLServer);
  }

  @Get('/mod')
  getLogin(@Res() res: Response) {
    res.sendFile(`${ModPath}/login.html`);
  }
  @Get('/mod/utenti')
  getUtenti(@Res() res: Response) {
    res.sendFile(`${ModPath}/users.html`);
  }

  @Get('/mod/canaliUfficiali')
  getOfficial(@Res() res: Response) {
    res.sendFile(`${ModPath}/canaliUfficiali.html`);
  }

  @Get('/mod/canaliUtente')
  getUserChannels(@Res() res: Response) {
    res.sendFile(`${ModPath}/canaliUtente.html`);
  }

  @Get('/mod/canaliTemporanei')
  getTemp(@Res() res: Response) {
    res.sendFile(`${ModPath}/canaliTemporanei.html`);
  }

  @Get('/mod/creaCanale')
  getCrea(@Res() res: Response) {
    res.sendFile(`${ModPath}/createChannel.html`);
  }

  @Get('/mod/pubblica')
  getPublish(@Res() res: Response) {
    res.sendFile(`${ModPath}/pubblica.html`);
  }
  @Get('/mod/squeals')
  getSqueals(@Res() res: Response) {
    res.sendFile(`${ModPath}/squeals.html`);
  }
  @Get('/mod/analisi')
  getAnalisi(@Res() res: Response) {
    res.sendFile(`${ModPath}/mainPage.html`);
  }
  
}
