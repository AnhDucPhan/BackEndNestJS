import { IsNotEmpty, IsOptional } from "class-validator";

export class CreateMenuItemDto {
    @IsNotEmpty()
    menu:string
    @IsNotEmpty({ message: "title ko dc để trống" })
    title: string;
    @IsOptional()
    description: string;
    @IsNotEmpty()
    basePrice:number
    @IsNotEmpty()
    image: string;
}
