import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
		private readonly usersService: UsersService,
		private readonly jwtService: JwtService
		) {}

  async validateUser(email: string, pass: string) {
    const user = await this.usersService.findByEmail(email);
    if (user && user.password === pass) {
			return user;
		} else {
			throw new NotFoundException('Incorrect email or password')
		};
  }

	async signup(data: CreateUserDto) {
		const user = await this.usersService.create(data);
		if (!user) return { error: 'This email already exists' };
		return this.login(user);
	}

	login(user: User) {
		const payload = { sub: user.id, email: user.email, isAdmin: user.isAdmin };
		return {
			accessToken: this.jwtService.sign(payload)
		}
	}
}