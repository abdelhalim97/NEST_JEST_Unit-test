import { Injectable } from '@nestjs/common';

@Injectable()
export class CommonService {
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
