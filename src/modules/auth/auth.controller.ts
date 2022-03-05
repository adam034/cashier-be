import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { ChangePassword } from './dto/change-password.dto';
import { CreateAuthDto } from './dto/create-auth.dto';
import { RefreshToken } from './dto/token.dto';


@Controller('auth')
@ApiTags('CASHIER - Auth')
@ApiBearerAuth()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  async login(@Body() createAuthDto: CreateAuthDto){
    return this.authService.login(createAuthDto)
  }

  @Post('/changepassword')
  async changePassword(@Body() changePassword: ChangePassword, @Req() req:any){
    const { ID } = req.user;
    return this.authService.changePassword(changePassword,ID)
  }

  @Post('/refreshtoken')
  async refreshToken(@Body() refreshToken: RefreshToken){
    return this.authService.refreshToken(refreshToken)
  }

  @Get('/user')
  async verifUser(@Req() req:any){
    const authHeaders = req.headers.authorization;
    if (authHeaders && (authHeaders as string).split(' ')[1]) {
      const token = (authHeaders as string).split(' ')[1]
      return this.authService.verifyUser(token)
    }
  }
}
