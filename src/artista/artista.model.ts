import { Album } from "src/album/album.model";
import { Genero } from "src/genero/genero.model";
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, OneToMany } from "typeorm";

@Entity()
export class Artista {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nombre: string;

    @ManyToOne(() => Genero, genero => genero.artistas)
    genero: Genero;

    @OneToMany(() => Album, album => album.artista)
    albums: Album[];
}
