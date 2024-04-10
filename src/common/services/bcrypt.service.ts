import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { EnvironmentService } from 'src/common/services/environment.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class BcryptService {
  constructor(private readonly environmentService: EnvironmentService) {}

  private saltOrRounds = this.environmentService.jasonWebTokenConfig.saltRounds;

  async hash(hashedVariable: string): Promise<string> {
    return await bcrypt.hash(hashedVariable, this.saltOrRounds);
  }

  async isPasswordCorrect(typedPassword: string, userPassword: string): Promise<boolean> {
    const hashedPassword = await bcrypt.compare(typedPassword, userPassword);

    if (!hashedPassword) throw new HttpException('Wrong credentials!', HttpStatus.UNAUTHORIZED);

    return true;
  }
}
