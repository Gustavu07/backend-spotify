import { IsString, IsInt, IsOptional } from "class-validator";

export class ArtistaUpdateDto {
    @IsOptional()
    @IsString()
    readonly nombre?: string;

    @IsOptional()
    @IsInt()
    readonly generoId?: number;
}
