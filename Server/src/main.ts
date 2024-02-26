import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { Logger, ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { graphqlUploadExpress } from 'graphql-upload';
import { ExpressAdapter } from '@nestjs/platform-express';

import { join } from 'path';
import * as express from 'express';
import { ActiveReactFiles, ModPath, landing_page, pathVueFiles, pathVueFilesServer } from './const';
import { conoPathLandingPage } from './const';
import { GraphQLSchemaHost } from '@nestjs/graphql';
import { writeFileSync } from 'fs';
import { printSchema } from 'graphql';

async function bootstrap() {
  dotenv.config();
  const logger = new Logger('App');
  console.log(join(__dirname, '..', '..', '..',  '..', 'squealer_webapp', 'build'));

  try {
    const app = await NestFactory.create(AppModule, new ExpressAdapter());
    app.useLogger(['log', 'error', 'warn']);
    app.use(graphqlUploadExpress({ maxFileSize: 1000000000, maxFiles: 10 }));
    app.use(cookieParser());
    app.useGlobalPipes(new ValidationPipe());

    app.use(express.static(landing_page));
    app.use(express.static(ActiveReactFiles));
    app.use(express.static(pathVueFilesServer));
  
    app.enableCors(); 
    await app.listen(8000);
    //allow access-control-allow-origin
  } catch (error) {
    logger.error(error);
  }
}

bootstrap().catch((err) => {
  console.error('Error during application bootstrap:', err);
  process.exit(1);
});
