import { Global, Module } from '@nestjs/common';
import { CommonController } from './common.controller';
import { CommonService } from './services/common.service';
import { EnvironmentService } from 'src/common/services/environment.service';
import { BcryptService } from 'src/common/services/bcrypt.service';

@Global()
@Module({
  controllers: [CommonController],
  providers: [CommonService, EnvironmentService, BcryptService],
  exports: [CommonService, EnvironmentService, BcryptService],
})
export class CommonModule {}
