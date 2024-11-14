import { Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post, Put } from "@nestjs/common";
import { AlbumService } from "./album.service";
import { Album } from "./album.model";
import { AlbumDto } from "./dto/album.dto";
import { AlbumUpdateDto } from "./dto/album-update.dto";

@Controller("album")
export class AlbumController {
    constructor(private albumService: AlbumService) {}

    @Get()
    list(): Promise<Album[]> {
        return this.albumService.findAll();
    }

    @Get(":id")
    async get(@Param("id") id: number): Promise<Album | null> {
        const albumDB = await this.albumService.findById(id);
        if (!albumDB) {
            throw new NotFoundException();
        }
        return albumDB;
    }

    @Post()
    async create(@Body() albumDto: AlbumDto): Promise<Album> {
        const album = new Album();
        album.titulo = albumDto.titulo;
        album.artista = { id: albumDto.artistaId } as any;
        album.canciones = [];
        return this.albumService.createAlbum(album);
    }

    @Put(":id")
    async update(@Param("id") id: number, @Body() albumDto: AlbumDto): Promise<Album> {
        const albumDB = await this.albumService.findById(id);
        if (!albumDB) {
            throw new NotFoundException();
        }
        albumDB.titulo = albumDto.titulo;
        albumDB.artista = { id: albumDto.artistaId } as any;

        return this.albumService.updateAlbum(albumDB);
    }

    @Patch(":id")
    async partialUpdate(@Param("id") id: number, @Body() albumUpdateDto: AlbumUpdateDto): Promise<Album> {
        const albumDB = await this.albumService.findById(id);
        if (!albumDB) {
            throw new NotFoundException();
        }

        if (albumUpdateDto.titulo !== undefined) {
            albumDB.titulo = albumUpdateDto.titulo;
        }
        if (albumUpdateDto.artistaId !== undefined) {
            albumDB.artista = { id: albumUpdateDto.artistaId } as any;
        }

        return this.albumService.updateAlbum(albumDB);
    }

    @Delete(":id")
    async delete(@Param("id") id: number): Promise<void> {
        const albumDB = await this.albumService.findById(id);
        if (!albumDB) {
            throw new NotFoundException();
        }
        return this.albumService.deleteAlbum(id);
    }
}
