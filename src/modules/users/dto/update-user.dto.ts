import { IsMongoId, IsNotEmpty, IsOptional } from "class-validator";


export class UpdateUserDto {
    @IsMongoId({ message: 'id ko đúng định dạng' })
    @IsNotEmpty({ message: 'id ko đc để trống' })
    _id: string;
    @IsOptional()
    name: string;
    @IsOptional()
    phone: string;
    @IsOptional()
    address: string;
    @IsOptional()
    image: string;
}
