import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { UsersService } from "src/users/users.service";
import { CreatePostDto } from "./dto/create-post.dto";
import { UpdatePostDto } from "./dto/update-post.dto";

@Injectable()
export class PostsRepository {
	constructor(
		private readonly prisma: PrismaService,
		private readonly usersService: UsersService
		) {}

	async getListAction() {
		const postsRaw = await this.prisma.post.findMany();
		let posts = []
		if (postsRaw.length > 0) {
			for (const post of postsRaw) {
				const category = await this.prisma.category.findUnique({ where: { id: post.category_id } });
				if (!category) {
					await this.deleteAciton(post.id);
				} else {
					posts.push({
						id: post.id,
						title: post.title,
						created_at: post.created_at,
					})
				}
			}
		}
		return posts;
	}

	async getInfo(id: string) {
		const post = await this.prisma.post.findUnique({ where: {id} });
		if (!post) return null;
		const author = await this.usersService.getInfo(post.author_id);
		const category = await this.prisma.category.findUnique({ where: { id: post.category_id } });
		if (!author || !category) {
			await this.deleteAciton(post.id);
			return null;
		}
		await this.prisma.post.update({ where: { id }, data: {views: post.views + 1} });
		return {
			id: post.id,
			title: post.title,
			body: post.body,
			category,
			author,
			created_at: post.created_at,
			updated_at: post.updated_at,
			views: post.views
		}
	}

	async createAction(data: CreatePostDto) {
		return await this.prisma.post.create({ data });
	}

	async deleteAciton(id: string)  {
		const post = await this.prisma.post.findUnique({ where: { id } });
		if (!post) return null
		return await this.prisma.post.delete({ where: { id } });
	}

	async updateAction(data: UpdatePostDto, id: string) {
		const oldPost = await this.prisma.post.findUnique({ where: { id } });
		const updatedPost = await this.prisma.post.update({ where: { id }, data });
		return { oldPost, updatedPost };
	}
}