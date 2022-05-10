import { Body, Controller, Get, Param, Post, Put, Request, UseGuards } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UsersService } from "./users.service";
import { UserDto } from "./dto/user.dto";
import { Serialize } from "src/interceptors/serialize.interceptor";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { IsAdminAuthGuard } from "src/auth/guards/is-admin-auth.guard";

@Controller('users')
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@Post('create')
	async create(@Body() body: CreateUserDto) {
		try {
			return await this.usersService.create(body);
		} catch (e) {
			throw new Error(e)
		}
	}

	@Get(':id') 
	async getInfo(@Param('id') id: string) {
		try {
			return await this.usersService.getInfo(id);
		} catch (e) {
			throw new Error(e)
		}
	}

	@Put(':id')
	async update(@Param('id') id: string, @Body() body: UpdateUserDto) {
		try {
			return await this.usersService.update(id, body);
		} catch (e) {
			throw new Error(e)
		}
	}
	
	@UseGuards(JwtAuthGuard, IsAdminAuthGuard)
	@Serialize(UserDto)
	@Get('')
	async getList(@Request() req:any) {
		try {
			return await this.usersService.getList()
		} catch (e) {
			throw new Error(e)
		}
	}
}