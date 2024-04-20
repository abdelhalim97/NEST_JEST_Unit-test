import { Test, TestingModule } from '@nestjs/testing';
import { CommonService } from './common.service';
import { EnvironmentService } from 'src/common/services/environment.service';
import { ConfigService } from '@nestjs/config';

describe('CommonService', () => {
  let commonService: CommonService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CommonService, EnvironmentService, ConfigService],
    }).compile();

    commonService = module.get<CommonService>(CommonService);
  });

  it('remaining Time', () => {
    expect(commonService.remainingTime(new Date())).toEqual(expect.any(Number));
  });

  it('remaining Time =>targetTime>current time', () => {
    const targetTime = new Date();
    targetTime.setHours(targetTime.getHours() + 4);

    expect(commonService.remainingTime(targetTime)).toEqual(expect.any(Number));
  });

  it('milliseconds To Hours', () => {
    expect(commonService.millisecondsToHours(123)).toEqual(expect.any(Number));
  });
});
