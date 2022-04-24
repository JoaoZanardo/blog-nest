import { IsNotEmpty } from "class-validator";

export class CreatePostDto {
	id: string;
	author_id: string;
	images: string[];
	@IsNotEmpty()
	title: string;	
	@IsNotEmpty()			
	body: string;		
	@IsNotEmpty()		
	category_id: string;	
}