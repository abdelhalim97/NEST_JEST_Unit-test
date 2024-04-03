import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { EnvironmentService } from 'src/common/services/environment.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class CommonService {
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

  adjustDate(): Date {
    const givenDate = new Date();

    givenDate.setTime(givenDate.getTime() - new Date().getTimezoneOffset() * 60 * 1000);
    return givenDate;
  }

  remainingTime(date: Date): number {
    const currentTime = new Date();
    const targetTime = new Date(date);

    if (targetTime > currentTime) {
      const timeDifference = Number(targetTime) - Number(currentTime);
      return timeDifference;
    }

    const timeDifference = Number(currentTime) - Number(targetTime);
    return timeDifference;
  }

  millisecondsToHours(milliseconds: number): number {
    return milliseconds / (1000 * 60 * 60);
  }
}
