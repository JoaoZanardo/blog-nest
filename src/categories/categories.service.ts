import { Injectable } from "@nestjs/common";
import { Category } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateCategoryDto } from "./dto/create-category.dto";

@Injectable()
export class CategoriesService {
	constructor(private prisma: PrismaService) {}

	async create(data: CreateCategoryDto) {
		const nameExists = await this.prisma.category.findUnique({ where: { name: data.name } });
		if (nameExists) return null;
		return await this.prisma.category.create({ data });
	}

	async getList(): Promise<Category[]> {
		return await this.prisma.category.findMany();
	}

	async delete(id: string) {
		const category = await this.prisma.category.findUnique({ where: { id } });
		if (!category) return null;
		return await this.prisma.category.delete({ where: { id } });
	}

	async getInfo(id: string) {
		if (id.length !== 24) return null;
		return await this.prisma.category.findUnique({ where: { id } });
	}
}