import { Body, Controller, Post, HttpException, HttpStatus } from '@nestjs/common';
import { AuthRequest, AuthResponse, AuthService } from './auth.service';

interface IAuthController {
  login(body: AuthRequest): Promise<AuthResponse>;
  signup(body: AuthRequest): AuthResponse;
}

@Controller('auth')
export class AuthController implements IAuthController {
  constructor(private authService: AuthService) {}

  // TODO: Implement signup
  @Post('signup')
  signup(@Body() body: AuthRequest): AuthResponse {
    console.log('Received signup');
    return this.authService.signup(body);
  }

  @Post('login')
  async login(@Body() body: AuthRequest): Promise<AuthResponse> {
    try {
      console.log('Attempting login');
      return await this.authService.login(body);
    } catch (error) {
      console.error('Login failed:', error.message);
      throw new HttpException('Invalid username or password', HttpStatus.UNAUTHORIZED);
    }
  }
}
