import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { RequestMethod, ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get('PORT');

  app.useStaticAssets(
    join(__dirname, '..', 'public'),
    {
      prefix: '/public/', // tuỳ chọn
    },
  );

  app.useGlobalPipes(new ValidationPipe(
    {
      whitelist: true,
      forbidNonWhitelisted: true,
    }
  ));
  
  app.setGlobalPrefix('api/v1',
    {
      exclude: [{ path: '/', method: RequestMethod.GET }],
    });

  app.enableCors(
    {
      "origin": true,
      "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
      "preflightContinue": false,
      credentials: true
    }
  );
  await app.listen(port);
}
bootstrap();
