"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = __importDefault(require("path"));
var fs_1 = __importDefault(require("fs"));
var FileSystem = /** @class */ (function () {
    function FileSystem() {
    }
    ;
    FileSystem.prototype.guardarImagenTemporal = function (file, userId, nombreFoto) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            // Crear carpetas
            var path = _this.crearCarpetaUsuario(userId);
            // Nombre archivo
            var nombreArchivo = _this.generarNombreUnico(file.name, nombreFoto);
            // Mover el archivo del Temp a nuestra carpeta
            file.mv(path + "/" + nombreArchivo, function (err) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve();
                }
            });
        });
    };
    FileSystem.prototype.guardarImagenTemporalV = function (file, userId, nombreFoto) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            // Crear carpetas
            var path = _this.crearCarpetaUsuarioV(userId);
            // Nombre archivo
            var nombreArchivo = _this.generarNombreUnico(file.name, nombreFoto);
            // Mover el archivo del Temp a nuestra carpeta
            file.mv(path + "/" + nombreArchivo, function (err) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve();
                }
            });
        });
    };
    FileSystem.prototype.generarNombreUnico = function (nombreOriginal, nombre) {
        // 6.copy.jpg
        var nombreArr = nombreOriginal.split('.');
        var extension = nombreArr[nombreArr.length - 1];
        // const idUnico = uniqid();
        var idUnico = nombre;
        return idUnico + "." + extension;
    };
    FileSystem.prototype.crearCarpetaUsuario = function (userId) {
        var pathUser = path_1.default.resolve(__dirname, '../uploads/', userId);
        var pathUserTemp = pathUser + '/temp';
        //console.log(pathUser);
        var existe = fs_1.default.existsSync(pathUser);
        if (!existe) {
            fs_1.default.mkdirSync(pathUser);
            fs_1.default.mkdirSync(pathUserTemp);
        }
        return pathUserTemp;
    };
    FileSystem.prototype.crearCarpetaUsuarioV = function (userId) {
        var pathUser = path_1.default.resolve(__dirname, '../uploadsV/', userId);
        var pathUserTemp = pathUser + '/tempV';
        //console.log(pathUser);
        var existe = fs_1.default.existsSync(pathUser);
        if (!existe) {
            fs_1.default.mkdirSync(pathUser);
            fs_1.default.mkdirSync(pathUserTemp);
        }
        return pathUserTemp;
    };
    FileSystem.prototype.imagenesDeTempHaciaFoto = function (userId) {
        var pathTemp = path_1.default.resolve(__dirname, '../uploads/', userId, 'temp');
        var pathFoto = path_1.default.resolve(__dirname, '../uploads/', userId, 'fotos');
        if (!fs_1.default.existsSync(pathTemp)) {
            return [];
        }
        if (!fs_1.default.existsSync(pathFoto)) {
            fs_1.default.mkdirSync(pathFoto);
        }
        var imagenesTemp = this.obtenerImagenesEnTemp(userId);
        imagenesTemp.forEach(function (imagen) {
            fs_1.default.renameSync(pathTemp + "/" + imagen, pathFoto + "/" + imagen);
        });
        return imagenesTemp;
    };
    FileSystem.prototype.imagenesDeTempHaciaVehiculo = function (userId) {
        var pathTemp = path_1.default.resolve(__dirname, '../uploadsV/', userId, 'tempV');
        var pathVehiculo = path_1.default.resolve(__dirname, '../uploadsV/', userId, 'vehiculo');
        if (!fs_1.default.existsSync(pathTemp)) {
            return [];
        }
        if (!fs_1.default.existsSync(pathVehiculo)) {
            fs_1.default.mkdirSync(pathVehiculo);
        }
        var imagenesTemp = this.obtenerImagenesEnTempV(userId);
        imagenesTemp.forEach(function (imagen) {
            fs_1.default.renameSync(pathTemp + "/" + imagen, pathVehiculo + "/" + imagen);
        });
        return imagenesTemp;
    };
    FileSystem.prototype.obtenerImagenesEnTemp = function (userId) {
        var pathTemp = path_1.default.resolve(__dirname, '../uploads/', userId, 'temp');
        return fs_1.default.readdirSync(pathTemp) || [];
    };
    FileSystem.prototype.obtenerImagenesEnTempV = function (userId) {
        var pathTemp = path_1.default.resolve(__dirname, '../uploadsV/', userId, 'tempV');
        return fs_1.default.readdirSync(pathTemp) || [];
    };
    FileSystem.prototype.getFotoUrl = function (userId, img) {
        var pathFoto = path_1.default.resolve(__dirname, '../uploads/', userId, 'fotos', img);
        var existe = fs_1.default.existsSync(pathFoto);
        if (!existe) {
            return path_1.default.resolve(__dirname, '../assets/400x250.jpg');
        }
        return pathFoto;
    };
    FileSystem.prototype.getVehiculoUrl = function (userId, img) {
        var pathVehiculo = path_1.default.resolve(__dirname, '../uploadsV/', userId, 'vehiculo', img);
        var existe = fs_1.default.existsSync(pathVehiculo);
        if (!existe) {
            return path_1.default.resolve(__dirname, '../assets/400x250.jpg');
        }
        return pathVehiculo;
    };
    return FileSystem;
}());
exports.default = FileSystem;
