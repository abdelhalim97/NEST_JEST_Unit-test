import { UseGuards, applyDecorators } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from 'src/common/guards/authentication.guard';

export function Auth() {
  return applyDecorators(UseGuards(AuthGuard), ApiBearerAuth());
}
