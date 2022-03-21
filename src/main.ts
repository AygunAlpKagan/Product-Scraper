import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as admin from 'firebase-admin';

async function bootstrap() {


console.log(admin.SDK_VERSION, "app")

  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
