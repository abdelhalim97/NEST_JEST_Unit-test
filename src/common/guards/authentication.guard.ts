import { EnvironmentService } from 'src/common/services/environment.service';
import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { TokenPayloadResponse } from 'src/common/responses/token-payload.response';
import { GetUserAuthInfoRequestI } from 'src/common/interfaces/get-user-auth-info-request.interface';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private readonly environmentService: EnvironmentService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: GetUserAuthInfoRequestI = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) throw new HttpException('Unauthorized!', HttpStatus.UNAUTHORIZED);

    try {
      const payload: TokenPayloadResponse = await this.jwtService.verifyAsync(token, {
        secret: this.environmentService.jasonWebTokenConfig.JWTSecretKey,
      });

      request.user = payload;
    } catch {
      throw new HttpException('Unauthorized!', HttpStatus.UNAUTHORIZED);
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const authorization = request.headers.authorization;

    if (!authorization) throw new HttpException('Unauthorized!', HttpStatus.UNAUTHORIZED);

    const [type, token] = authorization.split(' ');

    return type === 'Bearer' ? token : undefined;
  }
}
