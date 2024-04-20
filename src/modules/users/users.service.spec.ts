import { MongoMemoryServer } from 'mongodb-memory-server';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { Connection, Model, connect } from 'mongoose';
import { User, UserSchema } from 'src/modules/users/user.schema';
import { getModelToken } from '@nestjs/mongoose';
import { registerUserDtoStub } from 'src/modules/auth/stubs/register-user.stub';
import { HttpException } from '@nestjs/common';
import { BcryptService } from 'src/common/services/bcrypt.service';
import { EnvironmentService } from 'src/common/services/environment.service';
import { ConfigService } from '@nestjs/config';
import { updatePasswordDtoStub } from 'src/modules/auth/dto/stubs/update-password.stub';
import { ObjectId } from 'mongodb';

describe('UsersService', () => {
  let mongoMemory: MongoMemoryServer;
  let connection: Connection;
  let usersService: UsersService;
  let UsersModule: Model<User>;

  beforeAll(async () => {
    mongoMemory = await MongoMemoryServer.create();

    const uri = mongoMemory.getUri();

    connection = (await connect(uri)).connection;
    UsersModule = connection.model(User.name, UserSchema);
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, { provide: getModelToken(User.name), useValue: UsersModule }, EnvironmentService, BcryptService, ConfigService],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
  });

  afterEach(async () => {
    const collections = connection.collections;
    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany({});
    }
  });

  it('update password', async () => {
    const createdUser = await UsersModule.create(registerUserDtoStub);

    expect(await usersService.updatePassword(updatePasswordDtoStub, createdUser._id)).toBeTruthy();
  });

  it('fetch User By Id => truthy scenario', async () => {
    const createdUser = await UsersModule.create(registerUserDtoStub);

    const fetchedUser = await usersService.fetchUserById(createdUser._id);

    expect(fetchedUser.email).toBe(createdUser.email);
  });

  it('fetch User By Id => false scenario', async () => {
    await expect(usersService.fetchUserById(new ObjectId())).rejects.toThrow(HttpException);
  });

  it('fetch User By Email => truthy scenario', async () => {
    const createdUser = await UsersModule.create(registerUserDtoStub);

    const fetchedUser = await usersService.fetchUserByEmail(createdUser.email);

    expect(fetchedUser.email).toBe(createdUser.email);
  });

  it('fetch User By Email => false scenario', async () => {
    await expect(usersService.fetchUserByEmail('random@mail.com')).rejects.toThrow(HttpException);
  });

  it('is Email Not Exists => truthy', async () => {
    await UsersModule.create(registerUserDtoStub);

    expect(usersService.isEmailNotExists(registerUserDtoStub.email)).toBeTruthy();
  });

  it('is Email Not Exists => falsy', async () => {
    await UsersModule.create(registerUserDtoStub);

    await expect(usersService.isEmailNotExists(registerUserDtoStub.email)).rejects.toThrow(HttpException);
  });
});
