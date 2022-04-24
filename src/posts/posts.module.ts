import { Module } from "@nestjs/common";
import { CategoriesService } from "src/categories/categories.service";
import { PrismaService } from "src/prisma/prisma.service";
import { UsersService } from "src/users/users.service";
import { PostsController } from "./posts.controllers";
import { PostsRepository } from "./posts.repository";
import { PostsService } from "./posts.service";

@Module({
	imports: [],
	controllers: [PostsController],
	providers: [
		PostsService, 
		PostsRepository, 
		PrismaService, 
		CategoriesService, 
		UsersService
	]
})
export class PostsModule {}
