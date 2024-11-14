import { IsNotEmpty, IsString } from "class-validator";

export class GeneroDto {
    @IsNotEmpty()
    @IsString()
    readonly nombre: string;
}
