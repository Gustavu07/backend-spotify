import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Put } from "@nestjs/common";
import { CancionService } from "./cancion.service";
import { Cancion } from "./cancion.model";
import { CancionDto } from "./dto/cancion.dto";
//import { CancionUpdateDto } from './dto/cancion-update.dto';
import { Artista } from "../artista/artista.model";
@Controller("cancion")
export class CancionController {
    constructor(private cancionService: CancionService) {}

    @Get()
    list(): Promise<Cancion[]> {
        return this.cancionService.findAll();
    }

    @Get(":id")
    async get(@Param("id") id: number): Promise<Cancion | null> {
        const cancionDB = await this.cancionService.findById(id);
        if (!cancionDB) {
            throw new NotFoundException();
        }
        return cancionDB;
    }
    @Get("album/:albumId")
    async getByAlbum(@Param("albumId") albumId: number): Promise<Cancion[]> {
        return this.cancionService.findByAlbum(albumId);
    }

    @Post()
    create(@Body() cancionDto: CancionDto): Promise<Cancion> {
        return this.cancionService.createCancion({
            titulo: cancionDto.titulo,
            album: {
                id: cancionDto.albumId,
                titulo: "",
                artista: new Artista(),
                canciones: [],
            },
        });
    }

    @Put(":id")
    async update(@Param("id") id: number, @Body() cancionDto: CancionDto): Promise<Cancion> {
        const cancion = await this.cancionService.findById(id);
        if (!cancion) {
            throw new NotFoundException();
        }
        return this.cancionService.updateCancion(id, {
            titulo: cancionDto.titulo,
            album: {
                id: cancionDto.albumId,
                titulo: "",
                artista: new Artista(),
                canciones: [],
            },
        });
    }

    /*@Patch(":id")
    async partialUpdate(@Param("id") id: number, @Body() cancionUpdateDto: CancionUpdateDto): Promise<Cancion> {
        const cancion = await this.cancionService.findById(id);
        if (!cancion) {
            throw new NotFoundException();
        }
        return this.cancionService.updateCancion(id, {
            titulo: cancionUpdateDto.titulo,
            album: cancionUpdateDto.albumId ? { id: cancionUpdateDto.albumId } : undefined,
        });
    }*/

    @Delete(":id")
    async delete(@Param("id") id: number): Promise<void> {
        const cancionDB = await this.cancionService.findById(id);
        if (!cancionDB) {
            throw new NotFoundException();
        }
        return this.cancionService.deleteCancion(id);
    }
}
