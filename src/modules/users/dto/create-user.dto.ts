import { IsEmail, IsEmpty, IsNotEmpty, IsNumber } from "class-validator";

export class CreateUserDto {
    @IsNotEmpty({ message: "Name ko dc để trống" })
    name: string;
    @IsNotEmpty()
    @IsEmail({}, { message: 'Email ko đúng định dạng' })
    email: string;
    @IsNotEmpty()
    password: string;
    // @IsNotEmpty()
    // @IsNumber()
    phone: string;
    // @IsNotEmpty()
    address: string;
    image: string;
}
