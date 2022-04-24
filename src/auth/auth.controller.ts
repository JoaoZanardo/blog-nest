import { Body, Controller, Get, Post, Request, UseGuards } from "@nestjs/common";
import { CreateUserDto } from "src/users/dto/create-user.dto";
import { AuthService } from "./auth.service";
import { LocalAuthGuard } from "./guards/local-auth.guard";

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post('signup')
	async signup(@Body() body: CreateUserDto) {
		try {
			return await this.authService.signup(body);
		} catch (e) {
			throw new Error(e);
		}
	}

	@UseGuards(LocalAuthGuard)
	@Post('signin')
	signin(@Request() req: any) { 
		try {
			if (req.user) return this.authService.login(req.user);
		} catch (e) {
			
		}
	}

	@Get('users') 
	async getUsers() {
		try {
			
		} catch (e) {
			
		}
	}
}