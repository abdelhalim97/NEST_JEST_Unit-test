import { MongoMemoryServer } from 'mongodb-memory-server';
import { Test, TestingModule } from '@nestjs/testing';
import { Connection, Model, connect } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { ForgotPasswordsService } from 'src/modules/forgot-passwords/forgot-passwords.service';
import { ForgotPassword, ForgotPasswordSchema } from 'src/modules/forgot-passwords/forgot-password.schema';
import { CommonService } from 'src/common/services/common.service';
import { HttpException } from '@nestjs/common';

describe('UsersService', () => {
  let mongoMemory: MongoMemoryServer;
  let connection: Connection;
  let forgotPasswordsService: ForgotPasswordsService;
  let ForgotPasswordsModel: Model<ForgotPassword>;

  beforeAll(async () => {
    mongoMemory = await MongoMemoryServer.create();

    const uri = mongoMemory.getUri();

    connection = (await connect(uri)).connection;
    ForgotPasswordsModel = connection.model(ForgotPassword.name, ForgotPasswordSchema);
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ForgotPasswordsService, { provide: getModelToken(ForgotPassword.name), useValue: ForgotPasswordsModel }, CommonService],
    }).compile();

    forgotPasswordsService = module.get<ForgotPasswordsService>(ForgotPasswordsService);
  });

  afterEach(async () => {
    jest.useRealTimers(); //to restore timers after each test
    const collections = connection.collections;
    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany({});
    }
  });

  it('create Forgot Password', async () => {
    const userId = new ObjectId();
    expect((await forgotPasswordsService.createForgotPassword(userId)).userId).toBe(userId);
  });

  it('find Forgot Password By Ulid =>truthy', async () => {
    const userId = new ObjectId();
    const forgetPassword = await forgotPasswordsService.createForgotPassword(userId);

    expect((await forgotPasswordsService.findForgotPasswordByUlid(forgetPassword.ulid)).ulid).toBe(forgetPassword.ulid);
  });

  it('find Forgot Password By Ulid =>falsy', async () => {
    const currentDate = new Date();
    const userId = new ObjectId();

    const forgetPassword = await forgotPasswordsService.createForgotPassword(userId);

    const dateAfterHour = currentDate.setHours(currentDate.getHours() + 1);

    jest.useFakeTimers({ advanceTimers: true }).setSystemTime(dateAfterHour); //more than 1 hour

    await expect(forgotPasswordsService.findForgotPasswordByUlid(forgetPassword.ulid)).rejects.toThrow(HttpException);
  });

  it('delete Forgot Password By Ulid', async () => {
    const userId = new ObjectId();

    const forgotPassword = await ForgotPasswordsModel.create({ userId, ulid: 'random ulid' });

    expect((await forgotPasswordsService.deleteForgotPasswordByUlid(forgotPassword.ulid)).success).toBeTruthy();
  });

  it('is Forgot Password By Ulid Exists =>truthy', async () => {
    const userId = new ObjectId();
    const forgetPassword = await forgotPasswordsService.createForgotPassword(userId);

    expect((await forgotPasswordsService.isForgotPasswordByUlidExists(forgetPassword.ulid)).ulid).toBe(forgetPassword.ulid);
  });

  it('is Forgot Password By Ulid Exists =>falsy', async () => {
    await expect(forgotPasswordsService.isForgotPasswordByUlidExists('random ulid')).rejects.toThrow(HttpException);
  });
});
