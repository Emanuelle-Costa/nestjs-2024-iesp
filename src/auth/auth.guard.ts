import {
  CanActivate,
  ExecutionContext,
  HttpException,
  Injectable,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;
    const [type, token] = authHeader.split(' ');
    // Bearer token => ['Bearer', 'token']
    if (type !== 'Bearer') {
      throw new HttpException('Invalid token type', 401);
    }

    try {
      request.user = this.jwtService.verify(token);
      return true;
    } catch (e) {
      throw new HttpException('Invalid token', 401);
    }
  }
}
