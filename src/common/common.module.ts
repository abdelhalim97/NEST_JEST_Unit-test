import { Global, Module } from '@nestjs/common';
import { CommonController } from './common.controller';
import { CommonService } from './services/common.service';
import { EnvironmentService } from 'src/common/services/environment.service';

@Global()
@Module({
  controllers: [CommonController],
  providers: [CommonService, EnvironmentService],
  exports: [CommonService, EnvironmentService],
})
export class CommonModule {}
