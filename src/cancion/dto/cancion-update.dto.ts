import { IsString, IsInt, IsOptional } from "class-validator";

export class CancionUpdateDto {
    @IsOptional()
    @IsString()
    readonly titulo?: string;

    @IsOptional()
    @IsInt()
    readonly albumId?: number;
}
