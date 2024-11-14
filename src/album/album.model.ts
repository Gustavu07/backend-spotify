/* eslint-disable prettier/prettier */
import { Artista } from "src/artista/artista.model";
import { Cancion } from "src/cancion/cancion.model";
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, OneToMany } from "typeorm";

@Entity()
export class Album {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    titulo: string;

    @ManyToOne(() => Artista, artista => artista.albums)
    artista: Artista;

    @OneToMany(() => Cancion, cancion => cancion.album)
    canciones: Cancion[];
}
