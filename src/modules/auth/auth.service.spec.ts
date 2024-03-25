import { MongoClient, Db } from 'mongodb';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { RegisterUserDto } from 'src/modules/auth/dto/register-user.dto';
import { UsersService } from 'src/modules/users/users.service';

describe('AuthService', () => {
  let db: Db;
  let connection: MongoClient;
  let service: AuthService;

  beforeAll(async () => {
    connection = await MongoClient.connect(String(global.__MONGO_URI__));
    db = connection.db();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, UsersService],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  afterAll(async () => {
    await connection.close();
  });

  it('register user test', async () => {
    const registerUserDto: RegisterUserDto = {
      name: 'John',
      email: 'John@email.com',
      password: '123456',
      confirmPassword: '123456',
      phone: '235689',
    };
    const users = db.collection('users');

    await users.insertOne(registerUserDto);

    expect(service).toBeDefined();
  });
});
