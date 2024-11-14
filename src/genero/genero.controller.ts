import { Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post, Put, UploadedFile, UseInterceptors } from "@nestjs/common";
import { GeneroService } from "./genero.service";
import { Genero } from "./genero.model";
import { GeneroDto } from "./dto/genero.dto";
import { GeneroUpdateDto } from "./dto/genero-update.dto";
import { ArtistaService } from "../artista/artista.service";
import { Artista } from "../artista/artista.model";
import { FileInterceptor } from "@nestjs/platform-express";
import { promisify } from "util";
import { unlink } from "fs";
const unlinkAsync = promisify(unlink);

@Controller("genero")
export class GeneroController {
    constructor(
        private generoService: GeneroService,
        private artistaService: ArtistaService,
    ) {}

    @Get()
    list(): Promise<Genero[]> {
        return this.generoService.findAll();
    }

    @Get(":id")
    async get(@Param("id") id: number): Promise<Genero> {
        const generoDB = await this.generoService.findById(id);
        if (!generoDB) {
            throw new NotFoundException(`Género con id ${id} no encontrado.`);
        }
        return generoDB;
    }

    @Get(":id/artistas")
    async getArtistasByGenero(@Param("id") id: number): Promise<Artista[]> {
        const genero = await this.generoService.findById(id);
        if (!genero) {
            throw new NotFoundException(`Género con id ${id} no encontrado.`);
        }
        return this.artistaService.findByGeneroId(id);
    }

    @Post()
    create(@Body() generoDto: GeneroDto): Promise<Genero> {
        const genero: Genero = {
            id: 0,
            nombre: generoDto.nombre,
            artistas: [],
        };
        return this.generoService.createGenero(genero);
    }

    @Put(":id")
    async update(@Param("id") id: number, @Body() generoUpdateDto: GeneroUpdateDto): Promise<Genero> {
        const generoDB = await this.generoService.findById(id);
        if (!generoDB) {
            throw new NotFoundException(`Género con id ${id} no encontrado.`);
        }
        generoDB.nombre = generoUpdateDto.nombre;
        return this.generoService.updateGenero(generoDB);
    }

    @Patch(":id")
    async partialUpdate(@Param("id") id: number, @Body() generoUpdateDto: GeneroUpdateDto): Promise<Genero> {
        const generoDB = await this.generoService.findById(id);
        if (!generoDB) {
            throw new NotFoundException(`Género con id ${id} no encontrado.`);
        }
        const partialUpdatedGenero: Genero = {
            ...generoDB,
            nombre: generoUpdateDto.nombre ?? generoDB.nombre,
        };
        return this.generoService.updateGenero(partialUpdatedGenero);
    }

    @Delete(":id")
    async delete(@Param("id") id: number): Promise<void> {
        const generoDB = await this.generoService.findById(id);
        if (!generoDB) {
            throw new NotFoundException(`Género con id ${id} no encontrado.`);
        }
        return this.generoService.deleteGenero(id);
    }

    @Patch(":id/artistas")
    async addArtistasToGenero(@Param("id") id: number, @Body() artistaIds: number[]): Promise<Genero> {
        const genero = await this.generoService.findById(id);
        if (!genero) {
            throw new NotFoundException(`Género con id ${id} no encontrado.`);
        }

        const artistas = await this.artistaService.findArtistasByIds(artistaIds);
        if (!artistas || artistas.length === 0) {
            throw new NotFoundException("No se encontraron artistas con los IDs proporcionados.");
        }

        genero.artistas = [...genero.artistas, ...artistas];
        return this.generoService.updateGenero(genero);
    }

    @Post(":id/picture")
    @UseInterceptors(FileInterceptor("image"))
    async uploadFile(@Param("id") id: number, @UploadedFile() image: Express.Multer.File) {
        const generoDB = await this.generoService.findById(id);
        if (!generoDB) {
            await unlinkAsync(image.path);
            throw new NotFoundException(`Género con id ${id} no encontrado.`);
        }
        return {
            filename: image.filename,
            path: image.path,
        };
    }
}
