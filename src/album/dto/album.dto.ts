import { IsNotEmpty, IsString, IsInt } from "class-validator";

export class AlbumDto {
    @IsNotEmpty()
    @IsString()
    readonly titulo: string;

    @IsNotEmpty()
    @IsInt()
    readonly artistaId: number;
}
