import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Artista } from "./artista.model";
import { In, Repository } from "typeorm";
import { Album } from "../album/album.model";

@Injectable()
export class ArtistaService {
    constructor(
        @InjectRepository(Artista)
        private artistaRepository: Repository<Artista>,
        @InjectRepository(Album)
        private albumRepository: Repository<Album>,
    ) {}

    findAll(): Promise<Artista[]> {
        return this.artistaRepository.find({ relations: ["genero"] });
    }

    findById(id: number): Promise<Artista | null> {
        return this.artistaRepository.findOne({
            where: { id },
            relations: ["genero"],
        });
    }

    findByGeneroId(generoId: number): Promise<Artista[]> {
        return this.artistaRepository.find({
            where: { genero: { id: generoId } },
            relations: ["genero"],
        });
    }

    findArtistasByIds(ids: number[]): Promise<Artista[]> {
        return this.artistaRepository.find({
            where: { id: In(ids) },
            relations: ["genero"],
        });
    }

    createArtista(artista: Artista): Promise<Artista> {
        return this.artistaRepository.save(artista);
    }

    async updateArtista(artista: Artista): Promise<Artista> {
        await this.artistaRepository.update(artista.id, artista);
        return artista;
    }

    async deleteArtista(id: number): Promise<void> {
        await this.albumRepository.delete({ artista: { id } });

        await this.artistaRepository.delete(id);
    }
}
