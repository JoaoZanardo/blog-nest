import { Injectable } from "@nestjs/common";
import { CreatePostDto } from "./dto/create-post.dto";
import { UpdatePostDto } from "./dto/update-post.dto";
import { PostsRepository } from "./posts.repository";
import { CategoriesService } from "src/categories/categories.service";
import { unlink } from "fs/promises";


@Injectable()
export class PostsService {
	constructor(
		private readonly postsRepository: PostsRepository,
		private readonly categoryService: CategoriesService
		) {}

	async getList() {
		return await this.postsRepository.getListAction();
	}

	async getInfo(post_id: string) {
		const post = await this.postsRepository.getInfo(post_id);
		if (!post) return { error: 'Post not found' };
		return post;
	}

	async create(data: CreatePostDto){
		const category = await this.categoryService.getInfo(data.category_id);
		if (!category) return null;

		return await this.postsRepository.createAction(data);
	}

	async delete(post_id: string) {
		const post = await this.postsRepository.deleteAciton(post_id);
		if (!post) return null;
		return post;
	}

	async update(post_id: string, data: UpdatePostDto) {
		const category = await this.categoryService.getInfo(data.category_id);
		if (!category) return null;

		const { oldPost, updatedPost } = await this.postsRepository.updateAction(data, post_id);
		for (const image of oldPost.images) {
			console.log(image)
			await unlink(`C:/Users/Zanardo/Desktop/blog-nest-prisma/public/media/${image}.png`);
		}
		return updatedPost;
	}
}