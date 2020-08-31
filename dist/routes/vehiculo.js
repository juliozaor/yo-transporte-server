"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var autenticacion_1 = require("../middlewares/autenticacion");
var file_system_1 = __importDefault(require("../clasess/file-system"));
var vehiculoRoutes = express_1.Router();
var modelos = require('../models');
var fileSystem = new file_system_1.default();
vehiculoRoutes.post('/create', [autenticacion_1.verificaToken], function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var body, fotoImg, i;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                body = req.body;
                body.codPropietario = req.usuario.idUsuario;
                return [4 /*yield*/, fileSystem.imagenesDeTempHaciaVehiculo(String(req.usuario.idUsuario))];
            case 1:
                fotoImg = _a.sent();
                i = 1;
                if (!(fotoImg.length > 0)) return [3 /*break*/, 3];
                return [4 /*yield*/, fotoImg.forEach(function (element) {
                        if (element.includes("foto1")) {
                            body.foto1 = element;
                        }
                        else if (element.includes("foto2")) {
                            body.foto2 = element;
                        }
                        else if (element.includes("foto3")) {
                            body.foto3 = element;
                        }
                        else if (element.includes("foto4")) {
                            body.foto4 = element;
                        }
                        else if (element.includes("foto5")) {
                            body.foto5 = element;
                        }
                        else if (element.includes("f1Soat")) {
                            body.f1Soat = element;
                        }
                        else if (element.includes("f2Soat")) {
                            body.f2Soat = element;
                        }
                        else if (element.includes("f1TP")) {
                            body.f1TP = element;
                        }
                        else if (element.includes("f2TP")) {
                            body.f2TP = element;
                        }
                        if (i == fotoImg.length) {
                            modelos.Vehiculos.create(body).then(function (vehiculoDB) {
                                res.json({
                                    ok: true,
                                    vehiculo: vehiculoDB
                                });
                            }).catch(function (err) {
                                res.json(err);
                            });
                        }
                        i++;
                    })];
            case 2:
                _a.sent();
                return [3 /*break*/, 4];
            case 3:
                modelos.Vehiculos.create(body).then(function (vehiculoDB) {
                    res.json({
                        ok: true,
                        vehiculo: vehiculoDB
                    });
                }).catch(function (err) {
                    res.json(err);
                });
                _a.label = 4;
            case 4: return [2 /*return*/];
        }
    });
}); });
//servicio para subir archivos
vehiculoRoutes.post('/upload/:nombre', [autenticacion_1.verificaToken], function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var idUsuario, file, nombreFoto;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                idUsuario = req.usuario.idUsuario;
                if (!req.files) {
                    return [2 /*return*/, res.status(400).json({
                            ok: false,
                            mensaje: 'No se subió ningun archivo'
                        })];
                }
                file = req.files.imagen;
                //const file: FileUpload[] = [req.files.foto1Licencia, req.files.foto2Licencia];
                //const nombres: string[] = ["foto1Licencia","foto2Licencia"]
                console.log(req.files.imagen);
                if (!file) {
                    return [2 /*return*/, res.status(400).json({
                            ok: false,
                            mensaje: 'No se subió ningun archivo - image'
                        })];
                }
                if (!file.mimetype.includes('image')) {
                    return [2 /*return*/, res.status(400).json({
                            ok: false,
                            mensaje: 'Lo que subió no es una imagen'
                        })];
                }
                nombreFoto = req.params.nombre;
                return [4 /*yield*/, fileSystem.guardarImagenTemporalV(file, String(req.usuario.idUsuario), nombreFoto)];
            case 1:
                _a.sent();
                res.json({
                    ok: true,
                    file: file.mimetype
                });
                return [2 /*return*/];
        }
    });
}); });
vehiculoRoutes.get('/fotos/:userid/:img', function (req, res) {
    var userId = req.params.userid;
    var img = req.params.img;
    var pathFoto = fileSystem.getVehiculoUrl(userId, img);
    res.sendFile(pathFoto);
});
// buscar Vehiculos
vehiculoRoutes.get('/buscarVehiculo/:idVehiculo', function (req, res) {
    //const body = req.body;
    var idVehiculo = req.params.idVehiculo;
    modelos.Vehiculos.findOne({ where: { idVehiculo: idVehiculo } }).then(function (vehiculo) {
        if (!vehiculo) {
            return res.json({
                ok: false,
                mensaje: 'no se encontro el vehiculos'
            });
        }
        else {
            return res.json({
                ok: true,
                vehiculos: vehiculo
            });
        }
    })
        .catch(function (err) {
        console.log(err);
        throw err;
    });
});
exports.default = vehiculoRoutes;
