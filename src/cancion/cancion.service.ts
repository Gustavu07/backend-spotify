import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Cancion } from "./cancion.model";
import { Album } from "../album/album.model";
import { Repository } from "typeorm";

@Injectable()
export class CancionService {
    constructor(
        @InjectRepository(Cancion)
        private cancionRepository: Repository<Cancion>,
        @InjectRepository(Album)
        private albumRepository: Repository<Album>,
    ) {}

    findAll(): Promise<Cancion[]> {
        return this.cancionRepository.find({
            relations: ["album", "album.artista"],
        });
    }

    findById(id: number): Promise<Cancion | null> {
        return this.cancionRepository.findOne({
            where: { id },
            relations: ["album", "album.artista"],
        });
    }

    async findByAlbum(albumId: number): Promise<Cancion[]> {
        return this.cancionRepository.find({
            where: { album: { id: albumId } },
            relations: ["album", "album.artista"],
        });
    }

    async createCancion(cancionData: Partial<Cancion>): Promise<Cancion> {
        const album = await this.albumRepository.findOne({
            where: { id: cancionData.album.id },
        });
        if (!album) {
            throw new NotFoundException("Album not found");
        }

        const cancion = this.cancionRepository.create({
            ...cancionData,
            album,
        });
        return this.cancionRepository.save(cancion);
    }

    async updateCancion(id: number, cancionData: Partial<Cancion>): Promise<Cancion> {
        const cancion = await this.cancionRepository.findOne({
            where: { id },
            relations: ["album"],
        });
        if (!cancion) {
            throw new NotFoundException("Cancion not found");
        }

        if (cancionData.album) {
            const album = await this.albumRepository.findOne({
                where: { id: cancionData.album.id },
            });
            if (!album) {
                throw new NotFoundException("Album not found");
            }
            cancion.album = album;
        }

        cancion.titulo = cancionData.titulo ?? cancion.titulo;
        return this.cancionRepository.save(cancion);
    }

    async deleteCancion(id: number): Promise<void> {
        await this.cancionRepository.delete(id);
    }
}
