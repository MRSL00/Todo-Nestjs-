import {
  Controller,
  Post,
  Body,
  Request,
  UseInterceptors,
  UploadedFile,
  Res,
  Get,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Body('email') email: string,
    @Body('password') password: string,
    @Request() req,
  ) {
    return await this.authService.login(
      email,
      password,
      req.headers.authorization.split(' ')[1],
    );
  }

  @Post('register')
  @UseInterceptors(FileInterceptor('file'))
  async register(
    @UploadedFile() file: Express.Multer.File,
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    return await this.authService.register(email, password, file);
  }

  @Get('profile')
  async getUserProfile(@Res() res: Response, @Request() req) {
    res.set({ 'Content-Type': 'image/png' });
    res.send(
      await this.authService.getUserProfile(
        req.headers.authorization.split(' ')[1],
      ),
    );
  }

  @Post('logout')
  async logout(@Request() req) {
    return this.authService.logout(req.headers.authorization.split(' ')[1]);
  }
}
