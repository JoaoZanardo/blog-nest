import { Body, Controller, Delete, Get, Param, Patch, Post, Request, UploadedFile, UploadedFiles, UseGuards, UseInterceptors } from "@nestjs/common";
import { FilesInterceptor } from "@nestjs/platform-express";
import { unlink } from "fs/promises";
import { diskStorage } from "multer";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { UserIsAuthor } from "src/auth/guards/user-is-author-auth.guard";
import { CreatePostDto } from "./dto/create-post.dto";
import { UpdatePostDto } from "./dto/update-post.dto";
import { PostsService } from "./posts.service";

@Controller('posts')
export class PostsController {
	constructor(private readonly postsService: PostsService) {}

	@Get('')
	async getList() {
		try {
			return await this.postsService.getList();
		} catch(e) {
			throw new Error(e);
		}
	}

	@Get(':id')
	async getInfo(@Param('id') id: string) {
		try {
			if (id.length !== 24) return { error: 'Invalid id'};
			return this.postsService.getInfo(id);
		} catch (e) {
			throw new Error(e);
		}
	}


	@UseGuards(JwtAuthGuard)
	@Post('')
	@UseInterceptors(FilesInterceptor('avatar', 3, {
		storage: diskStorage({
			destination: './public/media',
			filename: (req, file, cb) => {
				const rand = Math.floor(Math.random() * 1000);
				cb(null, `${Date.now() + rand}.png`);
			}
		}),
		fileFilter: (req, file, cb) => {
			const allowed: string[] = ['image/jpg', 'image/jpeg', 'image/png'];
			cb(null, allowed.includes( file.mimetype ));
		}
	}))
	async create(@Request() req: any, @Body() body: CreatePostDto, @UploadedFiles() files: Array<Express.Multer.File> ) {
		try {
			const images = [];
			for (const i of files) {
				images.push(i.filename.replace('.png', ''));
			}

			const author_id = req.user.id;
			body.author_id = author_id;
			body.images = images;

			const post = await this.postsService.create(body);
			if (!post) {
				for (const i of files) {
					await unlink(`C:/Users/Zanardo/Desktop/blog-nest-prisma/public/media/${i.filename}`);
				}
				return { error: 'Invalid category' };
			}
			return post;
		} catch(e) {
			for (const i of files) {
				await unlink(`C:/Users/Zanardo/Desktop/blog-nest-prisma/public/media/${i.filename}`); 
			}
			throw new Error(e);
		}
	}

	@UseGuards(JwtAuthGuard, UserIsAuthor)
	@Post('update/:id')
	@UseInterceptors(FilesInterceptor('avatar', 3, {
		storage: diskStorage({
			destination: './public/media',
			filename: (req, file, cb) => {
				const rand = Math.floor(Math.random() * 1000);
				cb(null, `${Date.now() + rand}.png`);
			}
		}),
		fileFilter: (req, file, cb) => {
			const allowed: string[] = ['image/jpg', 'image/jpeg', 'image/png'];
			cb(null, allowed.includes( file.mimetype ));
		}
	}))
	async update(@Param('id') id: string, @Body() body: UpdatePostDto, @UploadedFiles() files: Array<Express.Multer.File>) {
		try {
			const images = [];
			for (const i of files) {
				images.push(i.filename.replace('.png', ''))
			}
			body.images = images;
			const post = await this.postsService.update(id, body);
			if (!post) {
				for (const i of files) {
					await unlink(`C:/Users/Zanardo/Desktop/blog-nest-prisma/public/media/${i.filename}`);
				}
			}
			return post;
		} catch (e) {
			throw new Error(e);
		}
	}

	@UseGuards(JwtAuthGuard, UserIsAuthor)
	@Delete(':id')
	async	delete(@Param('id') id: string) {
		try {
			const post = await this.postsService.delete(id);
			if (!post) return { error: 'Post not found' };
			for (const image of post.images) {
				await unlink(`C:/Users/Zanardo/Desktop/blog-nest-prisma/public/media/${image}.png`);
			}
			
		} catch (e) {
			throw new Error(e);
		}
	}
}