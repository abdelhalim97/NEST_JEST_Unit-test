import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from 'src/modules/users/users.service';
import { ConfigService } from '@nestjs/config';
import { ForgotPasswordsService } from 'src/modules/forgot-passwords/forgot-passwords.service';
import { CommonService } from 'src/common/services/common.service';
import { JwtModule } from '@nestjs/jwt';
import { ForgotPassword, ForgotPasswordSchema } from 'src/modules/forgot-passwords/forgot-password.schema';
import { getModelToken } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/modules/users/user.schema';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Connection, Model, connect } from 'mongoose';
import { registerUserDtoStub } from 'src/modules/auth/stubs/register-user.stub';
import { EnvironmentService } from 'src/common/services/environment.service';
import { jwtConfig } from 'src/common/services/stubs/jwt-config.stub';
import { BcryptService } from 'src/common/services/bcrypt.service';

describe('AuthService', () => {
  let mongoMemory: MongoMemoryServer;
  let connection: Connection;
  let authService: AuthService;
  let forgotPasswordsService: ForgotPasswordsService;
  let UsersModule: Model<User>;
  let ForgotPasswordsModule: Model<ForgotPassword>;

  beforeAll(async () => {
    mongoMemory = await MongoMemoryServer.create();

    const uri = mongoMemory.getUri();

    connection = (await connect(uri)).connection;
    UsersModule = connection.model(User.name, UserSchema);
    ForgotPasswordsModule = connection.model(ForgotPassword.name, ForgotPasswordSchema);
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
        BcryptService,
      ],
      imports: [JwtModule.register(jwtConfig)],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    forgotPasswordsService = module.get<ForgotPasswordsService>(ForgotPasswordsService);
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

  it('register user', async () => {
    const createdUser = await authService.register(registerUserDtoStub);

    expect(createdUser.email).toBe(createdUser.email);
  });

  it('login', async () => {
    //user should exist to pass the test
    await authService.register(registerUserDtoStub);

    const createdUser = await authService.login(registerUserDtoStub);

    expect(createdUser.email).toBe(createdUser.email);
  });

  it('forgot pass', async () => {
    await authService.register(registerUserDtoStub);

    // jest.spyOn(authService.transporter, 'sendPasswordResetEmail').mockImplementation(() => return true);
    const forgotPasswordResponse = await authService.forgotPassword(registerUserDtoStub);

    expect(forgotPasswordResponse.success).toBeTruthy();
  });

  it('reset pass', async () => {
    const createdUser = await authService.register(registerUserDtoStub);

    const createdForgotPassword = await forgotPasswordsService.createForgotPassword(createdUser._id);

    const forgotPasswordResponse = await authService.resetPassword(registerUserDtoStub, createdForgotPassword.ulid);

    expect(forgotPasswordResponse.success).toBeTruthy();
  });

  it('Generate token', async () => {
    const createdUser = await authService.register(registerUserDtoStub);

    const forgotPasswordResponse = await authService.generateBearerToken(createdUser._id);

    expect(forgotPasswordResponse).toBeTruthy();
  });
});
