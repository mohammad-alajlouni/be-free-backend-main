import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import { validationPipe } from './pipes/validation.pipe';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
    rawBody: true,
  });

  // ✅ استخدم WebSocket adapter
  app.useWebSocketAdapter(new IoAdapter(app));

  app.enableCors({
    origin: true,
    credentials: true,
    methods: ['GET', 'PATCH', 'POST', 'DELETE', 'PUT'],
    preflightContinue: false,
    optionsSuccessStatus: 200,
  });

  // Global Validation Pipe
  app.useGlobalPipes(validationPipe);

  // Build Swagger Configs
  const config = new DocumentBuilder()
    .setTitle('Be Free')
    .setDescription('Be Free API Documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  // Create Swagger Document
  const document = SwaggerModule.createDocument(app, config, {});

  // Start Docs
  SwaggerModule.setup('apis/docs', app, document, {
    swaggerOptions: { persistAuthorization: true },
  });

  app.use(helmet());

  await app.listen(8080, () => {
    console.log('Server on port 8080');
  });
}
bootstrap();
