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

  it('isEmailNotExists ', async () => {
    await UsersModule.create(registerUserDtoStub);

    await expect(usersService.isEmailNotExists(registerUserDtoStub.email)).rejects.toThrow(HttpException);
  });
});
