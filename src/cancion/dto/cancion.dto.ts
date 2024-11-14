import { IsNotEmpty, IsString, IsInt } from "class-validator";

export class CancionDto {
    @IsNotEmpty()
    @IsString()
    readonly titulo: string;

    @IsNotEmpty()
    @IsInt()
    readonly albumId: number;
}
