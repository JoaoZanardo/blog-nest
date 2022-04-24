import { IsNotEmpty } from "class-validator";

export class CreateCategoryDto {
	id: string
	@IsNotEmpty()
	name: string;
}