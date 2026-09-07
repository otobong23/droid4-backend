import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { config } from 'dotenv';
import * as bodyParser from 'body-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
config()

const port = process.env.PORT || 4000
console.log(port)

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const httpAdapter = app.getHttpAdapter().getInstance(); // Express instance
  httpAdapter.set('etag', false);

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Droid Index API')
    .setDescription('API documentation for Droid Index')
    .setVersion('1.0')
    .build();

  const documentFactory = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api-docs', app, documentFactory);



  app.use(bodyParser.json({ limit: '10mb' }));      // for JSON bodies
  app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

  app.enableCors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        'http://localhost:3000',
        'http://localhost:3001',
        'https://droidindex-web4.com',
        'https://www.droidindex-web4.com',
        'https://web4droid.com',
        'https://www.web4droid.com'
      ];
      if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']
  });

  app.use((req, res, next) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    next();
  });

  //   app.useGlobalPipes(
  //   new ValidationPipe({
  //     whitelist: true,
  //     forbidNonWhitelisted: true,
  //     transform: true,
  //   }),
  // );

  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  await app.listen(port);
}
bootstrap();
