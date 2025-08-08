import { IsNotEmpty, IsOptional } from "class-validator";

export class CreateMenuDto {
    @IsNotEmpty({ message: "title ko dc để trống" })
    title: string;
    @IsOptional()
    image: string;
}
