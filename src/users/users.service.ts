import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";

@Injectable()
export class UsersService {
	constructor(private readonly prisma: PrismaService) {}

	async create(data: CreateUserDto) {
		const emailExists = await this.prisma.user.findUnique({ where: { email: data.email } });
		if (emailExists) return null;
		return await this.prisma.user.create({ data });
	}

	async update(id: string, data: UpdateUserDto) {
		if (id.length !== 24) return { error: 'Invalid id' };
		const user = await this.prisma.user.findUnique({ where: { id } });
		if (!user) return null
		return await this.prisma.user.update({ where: { id }, data });
	}

	async getList() {
		return await this.prisma.user.findMany();
	}

	async findByEmail(email: string) {
		const user = await this.prisma.user.findUnique({ where: { email } });
		if (!user) return null
		return user;
	}

	async getInfo(id: string) {
		if (id.length !== 24) return null;
		const user = await this.prisma.user.findUnique({ where: { id } });
		if (!user) return { error: 'User not found' };
		return {
			name: user.name,
			email: user.email,
			isAdmin: user.isAdmin
		};
	}
}