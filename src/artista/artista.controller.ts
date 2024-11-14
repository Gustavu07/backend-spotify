import { Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post, Put } from "@nestjs/common";
import { ArtistaService } from "./artista.service";
import { Artista } from "./artista.model";
import { ArtistaDto } from "./dto/artista.dto";
import { ArtistaUpdateDto } from "./dto/artista-update.dto";
import { Genero } from "../genero/genero.model";

@Controller("artista")
export class ArtistaController {
    constructor(private readonly artistaService: ArtistaService) {}

    @Get()
    list(): Promise<Artista[]> {
        return this.artistaService.findAll();
    }

    @Get(":id")
    async get(@Param("id") id: number): Promise<Artista | null> {
        const artistaDB = await this.artistaService.findById(id);
        if (!artistaDB) {
            throw new NotFoundException(`Artista con id ${id} no encontrado.`);
        }
        return artistaDB;
    }

    @Post()
    async create(@Body() artistaDto: ArtistaDto): Promise<Artista> {
        const newArtista = new Artista();
        newArtista.nombre = artistaDto.nombre;
        newArtista.genero = { id: artistaDto.generoId } as Genero;
        newArtista.albums = [];

        return this.artistaService.createArtista(newArtista);
    }

    @Put(":id")
    async update(@Param("id") id: number, @Body() artistaDto: ArtistaDto): Promise<Artista> {
        const artistaDB = await this.artistaService.findById(id);
        if (!artistaDB) {
            throw new NotFoundException(`Artista con id ${id} no encontrado.`);
        }

        artistaDB.nombre = artistaDto.nombre;
        artistaDB.genero = { id: artistaDto.generoId } as Genero;

        return this.artistaService.updateArtista(artistaDB);
    }

    @Patch(":id")
    async partialUpdate(@Param("id") id: number, @Body() artistaUpdateDto: ArtistaUpdateDto): Promise<Artista> {
        const artistaDB = await this.artistaService.findById(id);
        if (!artistaDB) {
            throw new NotFoundException(`Artista con id ${id} no encontrado.`);
        }

        // Actualizar solo los campos que fueron proporcionados en el DTO
        if (artistaUpdateDto.nombre !== undefined) {
            artistaDB.nombre = artistaUpdateDto.nombre;
        }
        if (artistaUpdateDto.generoId !== undefined) {
            artistaDB.genero = { id: artistaUpdateDto.generoId } as Genero;
        }

        return this.artistaService.updateArtista(artistaDB);
    }

    // Eliminar un artista por ID
    @Delete(":id")
    async delete(@Param("id") id: number): Promise<void> {
        const artistaDB = await this.artistaService.findById(id);
        if (!artistaDB) {
            throw new NotFoundException(`Artista con id ${id} no encontrado.`);
        }
        return this.artistaService.deleteArtista(id);
    }

    /*@Post(":id/picture")
    @UseInterceptors(FileInterceptor("image"))
    async uploadFile(@Param("id") id: number, @UploadedFile() image: Express.Multer.File) {
        const artistaDB = await this.artistaService.findById(id);
        if (!artistaDB) {
            // Elimina el archivo si no se encuentra el artista
            await unlinkAsync(image.path);
            throw new NotFoundException(`Artista con id ${id} no encontrado.`);
        }

        return {
            filename: image.filename,
            path: image.path,
        };
    }*/
}
