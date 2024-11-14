import { HttpException, HttpStatus, Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DataSource } from "typeorm";
import { Genero } from "./genero/genero.model";
import { GeneroController } from "./genero/genero.controller";
import { GeneroService } from "./genero/genero.service";
import { Album } from "./album/album.model";
import { Artista } from "./artista/artista.model";
import { Cancion } from "./cancion/cancion.model";
import { AlbumService } from "./album/album.service";
import { ArtistaService } from "./artista/artista.service";
import { AlbumController } from "./album/album.controller";
import { ArtistaController } from "./artista/artista.controller";
import { CancionController } from "./cancion/cancion.controller";
import { CancionService } from "./cancion/cancion.service";
import { MulterModule } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "path";

@Module({
    imports: [
        MulterModule.register({
            storage: diskStorage({
                destination: "./uploads",
                filename: (req, file, callback) => {
                    const idSuffix = req.params.id;
                    const extension = file.originalname.split(".").pop();

                    if (extension !== "jpg") {
                        callback(new HttpException("Only jpg files allowed", HttpStatus.BAD_REQUEST), null);
                    }

                    const filename = idSuffix + "." + extension;
                    callback(null, filename);
                },
            }),
        }),
        ServeStaticModule.forRoot({
            rootPath: join(__dirname, "..", "uploads"),
            serveRoot: "/uploads",
        }),

        TypeOrmModule.forRoot({
            type: "mysql",
            host: "localhost",
            port: 3306,
            username: "root",
            password: "root",
            database: "spotify",
            entities: [Genero, Album, Artista, Cancion],
            synchronize: true,
        }),
        TypeOrmModule.forFeature([Genero, Album, Artista, Cancion]),
    ],
    controllers: [AppController, GeneroController, AlbumController, ArtistaController, CancionController],
    providers: [AppService, GeneroService, AlbumService, ArtistaService, CancionService],
})
export class AppModule {
    constructor(private dataSource: DataSource) {}
}
