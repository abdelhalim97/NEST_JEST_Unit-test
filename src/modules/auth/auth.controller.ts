import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import * as bcrypt from 'bcrypt';
import { EnvironmentService } from 'src/common/services/environment.service';

@Controller('auth')
@ApiTags('Authentication')
export class AuthController {
  constructor(private readonly EnvironmentService: EnvironmentService) {}

  async register(): Promise<any> {}
}
