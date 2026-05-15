import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AdminLoginDto } from './dto/admin-login.dto';

@Injectable()
export class AdminAuthService {
  constructor(
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  async login(dto: AdminLoginDto): Promise<{
    access_token: string;
    token_type: 'Bearer';
  }> {
    const expectedUser = this.config.get<string>('ADMIN_USERNAME', 'admin');
    if (dto.username !== expectedUser) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const hash = this.config.get<string>('ADMIN_PASSWORD_HASH');
    const plain = this.config.get<string>('ADMIN_PASSWORD');
    let valid = false;

    if (hash?.length) {
      valid = await bcrypt.compare(dto.password, hash);
    } else if (plain !== undefined && plain !== '') {
      valid = dto.password === plain;
    }

    if (!valid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const access_token = await this.jwt.signAsync({
      sub: dto.username,
      role: 'admin' as const,
    });

    return { access_token, token_type: 'Bearer' };
  }
}
