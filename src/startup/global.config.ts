import { ValidationPipe } from '@nestjs/common';
// import { HttpExceptionFilter } from 'src/common/exception-filters/http-exception.filter';

export function initGlobalConfig(app) {
  // app.useGlobalFilters(new HttpExceptionFilter(), ); //SocketExceptionFilter

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
}
