import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Swagger API documentation (for easy testing)
  const config = new DocumentBuilder()
    .setTitle('Scholarship Management API')
    .setDescription('RESTful API for Scholarship Management System')
    .setVersion('1.0')
    .addTag('Users')
    .addTag('Scholarships')
    .addTag('Applications')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT ?? 3000;
  await app.listen(port);

  console.log(`🚀 Application: http://localhost:${port}`);
  console.log(`📚 Swagger docs: http://localhost:${port}/api/docs`);
}

void bootstrap();
