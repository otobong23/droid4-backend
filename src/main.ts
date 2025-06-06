import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { config } from 'dotenv';
config()

const port = process.env.PORT || 4000 
console.log(port)

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: ['http://localhost:3000', 'https://droidindex-web4.com', 'https://www.droidindex-web4.com'], // allow requests from your frontend
    credentials: true,               // allow cookies/auth headers if needed
  });
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  await app.listen(port);
}
bootstrap();
