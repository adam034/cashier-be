import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerCustomOptions, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule,{
    bodyParser: true,
  });

  app.enableCors();
  app.setGlobalPrefix(process.env.BASE_PATH);
  const config = new DocumentBuilder()
    .setTitle('CASHIER API Docs')
    .setVersion('1.0.0')
    .setBasePath(process.env.BASE_PATH)
    .addBearerAuth()
    .build();
    const document = SwaggerModule.createDocument(app, config);
    const customOptions: SwaggerCustomOptions = {
      swaggerOptions: {
        persistAuthorization: true,
        tagsSorter: 'alpha',
        operationsSorter: 'alpha',
      },
    };
    SwaggerModule.setup(
      process.env.BASE_PATH + '/explorer',
      app,
      document,
      customOptions,
    );
  await app.listen(3000);
}
bootstrap();
