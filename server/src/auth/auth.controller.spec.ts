import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginAuthDto } from './dto/login-auth.dto';
import { RegisterAuthDto } from './dto/register-auth.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;
  const existingEmail = 'existing@example.com';

  const mockAuthService = {
    login: jest.fn(),
    register: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should login successfully with valid credentials', async () => {
      const loginDto: LoginAuthDto = { email: 'test@example.com' };
      const expectedResponse = { id: 'user-id', apiKey: 'test-api-key' };

      mockAuthService.login.mockResolvedValue(expectedResponse);

      const result = await controller.login(loginDto);

      expect(mockAuthService.login).toHaveBeenCalledWith(loginDto);
      expect(result).toEqual(expectedResponse);
    });

    it('should throw NotFoundException when user does not exist', async () => {
      const loginDto: LoginAuthDto = { email: 'nonexistent@example.com' };

      mockAuthService.login.mockRejectedValue(
        new NotFoundException('User not found'),
      );

      await expect(controller.login(loginDto)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockAuthService.login).toHaveBeenCalledWith(loginDto);
    });
  });

  describe('register', () => {
    it('should register successfully with new user', async () => {
      const registerDto: RegisterAuthDto = { email: existingEmail };
      const expectedResponse = { id: 'new-user-id', apiKey: 'test-api-key' };

      mockAuthService.register.mockResolvedValue(expectedResponse);

      const result = await controller.register(registerDto);

      expect(mockAuthService.register).toHaveBeenCalledWith(registerDto);
      expect(result).toEqual(expectedResponse);
    });

    it('should register successfully with existing user (login)', async () => {
      const registerDto: RegisterAuthDto = { email: existingEmail };
      const expectedResponse = {
        id: 'existing-user-id',
        apiKey: 'test-api-key',
      };

      mockAuthService.register.mockResolvedValue(expectedResponse);

      const result = await controller.register(registerDto);

      expect(mockAuthService.register).toHaveBeenCalledWith(registerDto);
      expect(result).toEqual(expectedResponse);
    });
  });
});
