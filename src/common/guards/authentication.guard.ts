import { EnvironmentService } from 'src/common/services/environment.service';
import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { TokenPayloadResponse } from 'src/common/responses/token-payload.response';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private readonly environmentService: EnvironmentService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) throw new HttpException('Unauthorized!', HttpStatus.UNAUTHORIZED);

    try {
      const payload: TokenPayloadResponse = await this.jwtService.verifyAsync(token, {
        secret: this.environmentService.jasonWebTokenConfig.JWTSecretKey,
      });

      request['user'] = payload;
    } catch {
      throw new HttpException('Unauthorized!', HttpStatus.UNAUTHORIZED);
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
