import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as compression from 'compression';
import { initSecurityConfig } from 'src/startup/security.config';
import { initSwaggerConfig } from 'src/startup/swagger.cofig';
import { initGlobalConfig } from 'src/startup/global.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableShutdownHooks();
  app.enableCors();

  app.use(compression());

  initSecurityConfig(app);

  initSwaggerConfig(app);

  initGlobalConfig(app);
  await app.listen(process.env.PORT);
}
bootstrap();
