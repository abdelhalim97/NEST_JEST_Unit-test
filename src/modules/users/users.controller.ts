import { Body, Controller, Put } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/common/class-decorators/jwt-auth.decorator';
import { User } from 'src/common/parameter-decorators/user.decorator';
import { SuccessResponse } from 'src/common/responses/success.response';
import { TokenPayloadResponse } from 'src/common/responses/token-payload.response';
import { UpdatePasswordDto } from 'src/modules/auth/dto/update-password.dto';
import { UsersService } from 'src/modules/users/users.service';

@Controller('users')
@ApiTags('Users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Auth()
  @Put('password')
  @ApiOkResponse({ type: SuccessResponse })
  async updatePassword(@Body() updatePasswordDto: UpdatePasswordDto, @User() user: TokenPayloadResponse): Promise<SuccessResponse> {
    return await this.usersService.updatePassword(updatePasswordDto, user.id);
  }
}
