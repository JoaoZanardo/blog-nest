import { Body, Controller, Delete, Get, Param, Post, UseGuards } from "@nestjs/common";
import { IsAdminAuthGuard } from "src/auth/guards/is-admin-auth.guard";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { CategoriesService } from "./categories.service";
import { CreateCategoryDto } from "./dto/create-category.dto";

@Controller('categories')
export class CategoriesController {
	constructor(private readonly categoriesService: CategoriesService) {}

	@UseGuards(JwtAuthGuard, IsAdminAuthGuard)
	@Get('')
	async getList() {
		try {
			return await this.categoriesService.getList();
		} catch (e) {
			throw new Error(e);
		}
	}

	@UseGuards(JwtAuthGuard, IsAdminAuthGuard)
	@Post('')  
	async create(@Body() body: CreateCategoryDto) {
		try {
			const category = await this.categoriesService.create(body);
			if (!category) return { error: 'This category already exists' };
			return `Category '${category.name}' created successfully`;
		} catch (e) {
			throw new Error(e);
		}
	}

	@UseGuards(JwtAuthGuard, IsAdminAuthGuard)
	@Delete(':id')
	async delete(@Param('id') category_id: string) {
		if (category_id.length !== 24) return { error: 'Invalid id' };
		const category = await this.categoriesService.delete(category_id);
		if (!category) return { error: 'Category not found' };
		return `Category '${category.name}' deleted successfully`;
	}
}