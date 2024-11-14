import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Genero } from "./genero.model";

@Injectable()
export class GeneroService {
    constructor(
        @InjectRepository(Genero)
        private generoRepository: Repository<Genero>,
    ) {}

    findAll(): Promise<Genero[]> {
        return this.generoRepository.find();
    }

    async findById(id: number): Promise<Genero | null> {
        return this.generoRepository.findOne({
            where: { id },
            relations: ["artistas"],
        });
    }

    createGenero(genero: Genero): Promise<Genero> {
        return this.generoRepository.save(genero);
    }

    async updateGenero(genero: Genero): Promise<Genero> {
        await this.generoRepository.update(genero.id, {
            nombre: genero.nombre,
        });

        return this.generoRepository.findOne({
            where: { id: genero.id },
            relations: ["artistas"],
        });
    }

    async deleteGenero(id: number): Promise<void> {
        await this.generoRepository.delete(id);
    }
}
