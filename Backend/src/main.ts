import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const corsOrigins =
    process.env.CORS_ORIGIN?.split(',').map((o) => o.trim()).filter(Boolean) ??
    ['http://localhost:5173'];
  app.enableCors({ origin: corsOrigins, credentials: true });

  const port = Number(process.env.PORT ?? 3000);
  await app.listen(port);
}
bootstrap();
