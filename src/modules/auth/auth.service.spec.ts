import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from 'src/modules/users/users.service';
import { ConfigService } from '@nestjs/config';
import { ForgotPasswordsService } from 'src/modules/forgot-passwords/forgot-passwords.service';
import { CommonService } from 'src/common/services/common.service';
import { JwtModule } from '@nestjs/jwt';
import { ForgotPassword } from 'src/modules/forgot-passwords/forgot-password.schema';
import { ForgotPasswordsModule } from 'src/modules/forgot-passwords/forgot-passwords.module';
import { getModelToken } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/modules/users/user.schema';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Connection, Model, connect } from 'mongoose';
import { HttpException } from '@nestjs/common';
import { registerUserDtoStub } from 'src/modules/auth/stubs/register-user.stub';
import { EnvironmentService } from 'src/common/services/environment.service';
import { jwtConfig } from 'src/common/services/stubs/jwt-config.stub';

describe('AuthService', () => {
  let mongoMemory: MongoMemoryServer;
  let connection: Connection;
  let authService: AuthService;
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
      providers: [
        AuthService,
        UsersService,
        { provide: getModelToken(User.name), useValue: UsersModule },
        ForgotPasswordsService,
        { provide: getModelToken(ForgotPassword.name), useValue: ForgotPasswordsModule },
        EnvironmentService,
        CommonService,
        ConfigService,
      ],
      imports: [JwtModule.register(jwtConfig)],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
  });

  afterEach(async () => {
    const collections = connection.collections;
    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany({});
    }
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
    await mongoMemory.stop();
  });

  it('register user test', async () => {
    const createdUser = await authService.register(registerUserDtoStub);

    expect(createdUser.email).toBe(createdUser.email);
  });

  it('isEmailNotExists ', async () => {
    await UsersModule.create(registerUserDtoStub);

    await expect(usersService.isEmailNotExists(registerUserDtoStub.email)).rejects.toThrow(HttpException);
  });
});
