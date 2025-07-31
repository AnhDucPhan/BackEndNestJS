import { IsNotEmpty, IsOptional } from "class-validator";

export class CreateAuthDto {
    @IsNotEmpty({message:'username ko đc để trống'})
    email: string;
    @IsNotEmpty({message:'password ko đc để trống'})
    password:string
    @IsOptional()
    name: string
}

export class CodeAuthDto {
    @IsNotEmpty({message:'username ko đc để trống'})
    _id: string;
    @IsNotEmpty({message:'password ko đc để trống'})
    code:string
    
}
