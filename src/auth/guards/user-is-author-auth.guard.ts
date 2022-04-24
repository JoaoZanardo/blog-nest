import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class UserIsAuthor implements CanActivate {
	constructor(private readonly prisma: PrismaService) {}

	async canActivate(context: ExecutionContext,): Promise<boolean> {
		const request = context.switchToHttp().getRequest();
		const user = request.user;
		const post_id = request.params.id;
		if (post_id.length !== 24) return false;
		const post = await this.prisma.post.findUnique({ where: { id: post_id } });
		if (!post) return false;
		return user.id === post.author_id
  }
}