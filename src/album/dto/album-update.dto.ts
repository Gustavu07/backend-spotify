import { IsString, IsInt, IsOptional } from "class-validator";

export class AlbumUpdateDto {
    @IsOptional()
    @IsString()
    readonly titulo?: string;

    @IsOptional()
    @IsInt()
    readonly artistaId?: number;
}
