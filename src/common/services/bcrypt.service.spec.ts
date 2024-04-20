import { Test, TestingModule } from '@nestjs/testing';
import { EnvironmentService } from 'src/common/services/environment.service';
import { ConfigService } from '@nestjs/config';
import { BcryptService } from 'src/common/services/bcrypt.service';
import { HttpException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

describe('BcryptService', () => {
  let bcryptService: BcryptService;
  const saltOrRounds = Number(process.env.SALT_ROUNDS);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BcryptService, EnvironmentService, ConfigService],
    }).compile();

    bcryptService = module.get<BcryptService>(BcryptService);
  });

  it('hash', async () => {
    expect(await bcryptService.hash('string to hash')).toEqual(expect.any(String));
  });

  it('is Password Correct =>truthy', async () => {
    const password = '123456';
    const hashedPassword = await bcrypt.hash(password, saltOrRounds);
    const isPasswordCorrect = await bcryptService.isPasswordCorrect(password, hashedPassword);
    expect(isPasswordCorrect).toBeTruthy();
  });

  it('is Password Correct =>falsy', async () => {
    const password = '123456';
    const wrongPassword = 'wrongPassword';
    await expect(bcryptService.isPasswordCorrect(password, wrongPassword)).rejects.toThrow(HttpException);
  });
});
