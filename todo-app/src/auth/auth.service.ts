import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { sha512 } from 'hash.js';
import { JwtService } from '@nestjs/jwt';
import * as sharp from 'sharp';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async register(email: string, password: string, file) {
    const buffer = await sharp(file.buffer)
      .resize({ width: 550, height: 550 })
      .png()
      .toBuffer();

    password = sha512()
      .update(password)
      .digest('hex');

    return await this.userRepository.save({ email, password, photo: buffer });
  }

  async login(email: string, password: string, header) {
    const user = await this.userRepository.findOne({ email });
    if (!user) {
      throw new UnauthorizedException('user not found');
    }
    

    if (header === user.token) {
      return 'you are login';
    }

    const passwordHash = sha512()
      .update(password)
      .digest('hex');
    if (user.password !== passwordHash) {
      throw new UnauthorizedException('Password is wrong');
    }

    const token = await this.jwtService.signAsync(
      { id: user.id },
      { expiresIn: 3600 * 24 },
    );

    await this.userRepository.save({ ...user, token });

    return { ...user, token };
  }

  async getUserProfile(token) {
    const user = await this.userRepository.findOne({ token });

    return user.photo;
  }

  async logout(token) {
    const user = await this.userRepository.findOne({ token: token });

    if (user) {
      throw new UnauthorizedException('user not found');
    }

    user.token = '';

    await this.userRepository.save(user);

    return 'logout succesfully';
  }

  async getUserById(id: number) {
    return await this.userRepository.findOne(id);
  }
}
