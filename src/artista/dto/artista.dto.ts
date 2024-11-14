import { IsNotEmpty, IsString, IsInt } from "class-validator";

export class ArtistaDto {
    @IsNotEmpty()
    @IsString()
    readonly nombre: string;

    @IsNotEmpty()
    @IsInt()
    readonly generoId: number;
}
