import { IsOptional, IsString } from "class-validator";

export class GeneroUpdateDto {
    @IsOptional()
    @IsString()
    readonly nombre: string;
}
