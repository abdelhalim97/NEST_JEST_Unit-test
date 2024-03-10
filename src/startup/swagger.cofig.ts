import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { CommonModule } from 'src/common/common.module';
import { EnvironmentService } from 'src/common/services/environment.service';

export function initSwaggerConfig(app) {
  const environmentService = app.select(CommonModule).get(EnvironmentService);

  app.setGlobalPrefix('api-docs/v1');
  const config = new DocumentBuilder()
    .setTitle('Kataa API')
    .setDescription('Kataa API description')
    .setVersion('1.0')
    .addBearerAuth()
    .addApiKey(
      {
        type: 'apiKey',
        name: 'Accept-Language',
        in: 'header',
      },
      'Accept-Language',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  if (!environmentService.isProduction)
    SwaggerModule.setup('api-docs', app, document);
}
