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
var sequelize_1 = require("sequelize");
var sequelize = new sequelize_1.Sequelize('mysql::memory:');
var Op = require('sequelize').Op;
var conductorRoutes = express_1.Router();
var modelos = require('../models');
var fileSystem = new file_system_1.default();
conductorRoutes.post('/create', [autenticacion_1.verificaToken], function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var body, fotoImg, i;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                body = req.body;
                body.idConductor = req.usuario.idUsuario;
                return [4 /*yield*/, fileSystem.imagenesDeTempHaciaFoto(String(req.usuario.idUsuario))];
            case 1:
                fotoImg = _a.sent();
                i = 1;
                if (!(fotoImg.length > 0)) return [3 /*break*/, 3];
                return [4 /*yield*/, fotoImg.forEach(function (element) {
                        if (element.includes("foto1Licencia")) {
                            body.foto1Licencia = element;
                        }
                        else if (element.includes("foto2Licencia")) {
                            body.foto2Licencia = element;
                        }
                        if (i == fotoImg.length) {
                            modelos.Conductores.create(body).then(function (conductorDB) {
                                res.json({
                                    ok: true,
                                    conductor: conductorDB
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
                modelos.Conductores.create(body).then(function (conductorDB) {
                    res.json({
                        ok: true,
                        conductor: conductorDB
                    });
                }).catch(function (err) {
                    res.json(err);
                });
                _a.label = 4;
            case 4: return [2 /*return*/];
        }
    });
}); });
// verificar conductor
conductorRoutes.get('/buscar/:idUsuario', function (req, res) {
    //const body = req.body;
    var idUsuario = req.params.idUsuario;
    console.log(idUsuario);
    modelos.Conductores.findOne({ where: { idConductor: idUsuario } }).then(function (conductorDB) {
        if (!conductorDB) {
            return res.json({
                ok: false,
                mensaje: 'No es un conductor registrado'
            });
        }
        else {
            return res.json({
                ok: true,
                mensaje: 'Es un conductor',
                conductor: conductorDB
            });
        }
    })
        .catch(function (err) {
        console.log(err);
        throw err;
    });
});
// Vehiculos del conductor
conductorRoutes.get('/buscarVehiculoConductor/:idUsuario', function (req, res) {
    //const body = req.body;
    var idUsuario = req.params.idUsuario;
    console.log(idUsuario);
    modelos.ConductorVehiculos.findAll({ where: { codConductor: idUsuario } }).then(function (vehiculosDB) {
        if (!vehiculosDB) {
            return res.json({
                ok: false,
                mensaje: 'no se encontraron vehiculos'
            });
        }
        else {
            return res.json({
                ok: true,
                vehiculos: vehiculosDB
            });
        }
    })
        .catch(function (err) {
        console.log(err);
        throw err;
    });
});
// Buscar ofertas conductor
conductorRoutes.get('/buscar-ofertas-conductor/:idUsuario', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var idUsuario, pagina, offset, ofertasDB;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                idUsuario = req.params.idUsuario;
                pagina = Number(req.query.pagina) || 1;
                offset = pagina - 1;
                offset = offset * 10;
                return [4 /*yield*/, modelos.OfertaConductores.findAll({
                        where: {
                            codConductor: idUsuario, terminada: 0
                        },
                        order: sequelize.literal('createdAt DESC'),
                        offset: offset,
                        limit: 10
                    })];
            case 1:
                ofertasDB = _a.sent();
                res.json({
                    ok: false,
                    pagina: pagina,
                    ofertas: ofertasDB
                });
                return [2 /*return*/];
        }
    });
}); });
//servicio para subir archivos
conductorRoutes.post('/upload/:nombre', [autenticacion_1.verificaToken], function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var file, nombreFoto;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!req.files) {
                    return [2 /*return*/, res.status(400).json({
                            ok: false,
                            mensaje: 'No se subió ningun archivo'
                        })];
                }
                file = req.files.imagen;
                //const file: FileUpload[] = [req.files.foto1Licencia, req.files.foto2Licencia];
                //const nombres: string[] = ["foto1Licencia","foto2Licencia"]
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
                //console.log('los datos son', file , ' otro ', nombreFoto);
                return [4 /*yield*/, fileSystem.guardarImagenTemporal(file, String(req.usuario.idUsuario), nombreFoto)];
            case 1:
                //console.log('los datos son', file , ' otro ', nombreFoto);
                _a.sent();
                res.json({
                    ok: true,
                    file: file.mimetype
                });
                return [2 /*return*/];
        }
    });
}); });
conductorRoutes.get('/fotos/:userid/:img', function (req, res) {
    var userId = req.params.userid;
    var img = req.params.img;
    var pathFoto = fileSystem.getFotoUrl(userId, img);
    res.sendFile(pathFoto);
});
// enlazar conductor con vehiculo
conductorRoutes.post('/conductor-vehiculo', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var body;
    return __generator(this, function (_a) {
        body = req.body;
        modelos.ConductorVehiculos.create(body).then(function (CvehiculoDB) {
            res.json({
                ok: true,
                vehiculo: CvehiculoDB
            });
        }).catch(function (err) {
            res.json(err);
        });
        return [2 /*return*/];
    });
}); });
// Crear la oferta del conductor
conductorRoutes.post('/oferta-conductor', [autenticacion_1.verificaToken], function (req, res) {
    var body = req.body;
    body.codConductor = req.usuario.idUsuario;
    modelos.OfertaConductores.create(body).then(function (ofertaCDB) {
        res.json({
            ok: true,
            conductor: ofertaCDB
        });
    }).catch(function (err) {
        res.json(err);
    });
});
// cuando el conductor acepta la oferta del pasajero
conductorRoutes.post('/conductor-oferta-pasajero', [autenticacion_1.verificaToken], function (req, res) {
    var body = req.body;
    body.codConductor = req.usuario.idUsuario;
    modelos.ConductorOfertaPasajero.create(body).then(function (ofertaCDB) {
        res.json({
            ok: true,
            conductor: ofertaCDB
        });
    }).catch(function (err) {
        res.json(err);
    });
});
// Buscar las ofertas que el usuario ha aceptado
conductorRoutes.get('/buscar-poc/:idOferta', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var idOferta;
    return __generator(this, function (_a) {
        idOferta = req.params.idOferta;
        console.log(idOferta);
        modelos.PasajeroOfertaConductores.findAll({
            where: {
                codOfertaConductor: idOferta, estado: 0
            },
            order: sequelize.literal('createdAt ASC')
        }).then(function (ofertasDB) {
            if (!ofertasDB) {
                return res.json({
                    ok: false,
                    mensaje: 'no se encontraron ofertas'
                });
            }
            else {
                return res.json({
                    ok: true,
                    ofertas: ofertasDB
                });
            }
        })
            .catch(function (err) {
            console.log(err);
            throw err;
        });
        return [2 /*return*/];
    });
}); });
// rechazar oferta aceptada
conductorRoutes.post('/update-poc/:id', autenticacion_1.verificaToken, function (req, res) {
    var datos = {
        estado: req.body.estado,
        aceptada: req.body.aceptada
    };
    modelos.PasajeroOfertaConductores.update(datos, { where: { idPasajeroOfertaConductor: req.params.id } }, { new: true }).then(function (resp) {
        if (!resp) {
            return res.json({
                ok: false,
                mensaje: 'No se encontraron datos'
            });
        }
        else {
            res.json({
                ok: true,
                respuesta: resp
            });
        }
    })
        .catch(function (err) {
        console.log(err);
        throw err;
    });
});
// Terminar Oferta
conductorRoutes.post('/terminar-oferta/:id', autenticacion_1.verificaToken, function (req, res) {
    var user = {
        terminada: true,
    };
    modelos.OfertaConductores.update(user, { where: { idOfertaConductor: req.params.id } }, { new: true }).then(function (resp) {
        if (!resp) {
            return res.json({
                ok: false,
                mensaje: 'No se encontraron datos'
            });
        }
        else {
            res.json({
                ok: true,
                respuesta: resp
            });
        }
    })
        .catch(function (err) {
        console.log(err);
        throw err;
    });
});
// cuando el usuario pasajero acepta la oferta del conductor
conductorRoutes.post('/conductor-oferta-pasajero', [autenticacion_1.verificaToken], function (req, res) {
    var body = req.body;
    body.codConductor = req.usuario.idUsuario;
    modelos.ConductorOfertaPasajero.create(body).then(function (ofertaCDB) {
        res.json({
            ok: true,
            respuesta: ofertaCDB
        });
    }).catch(function (err) {
        res.json(err);
    });
});
// Ofertas publicadas por los pasajeros
conductorRoutes.get('/buscarOfertasPasajeros/:esInterUrbado', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var esInterUrbano, ciudad1, ciudad2, idConductor, pagina, offset, ofertaC, of1, oferta_1, _loop_1, i, of1, oferta_2, _loop_2, i, of1, oferta_3, _loop_3, i;
    var _a, _b, _c, _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                esInterUrbano = req.params.esInterUrbado;
                ciudad1 = req.query.ciudad1;
                ciudad2 = req.query.ciudad2;
                idConductor = req.query.idConductor;
                pagina = Number(req.query.pagina) || 1;
                offset = pagina - 1;
                offset = offset * 10;
                ofertaC = [];
                if (!(esInterUrbano == '1')) return [3 /*break*/, 5];
                if (!(ciudad1 != null && ciudad2 != null)) return [3 /*break*/, 2];
                return [4 /*yield*/, modelos.OfertaPasajeros.findAndCountAll({
                        where: (_a = {},
                            _a[Op.and] = [
                                { terminada: 0 },
                                { origen: ciudad1 },
                                { destino: ciudad2 }
                            ],
                            _a.codTipoServicio = (_b = {},
                                _b[Op.or] = [2, 4],
                                _b),
                            _a),
                        order: sequelize.literal('createdAt DESC'),
                        offset: offset,
                        limit: 10
                    })];
            case 1:
                of1 = _e.sent();
                oferta_1 = of1.rows;
                if (oferta_1.length != 0) {
                    _loop_1 = function (i) {
                        var _a;
                        var ofta = oferta_1[i];
                        // obtener si el conductor ha hecho mas de dos contraoferta
                        modelos.ConductorOfertaPasajero.findAll({
                            attributes: [
                                [sequelize.fn('COUNT', sequelize.col('idConductorOfertaPasajero')), 'cant']
                            ],
                            where: (_a = {},
                                _a[Op.and] = [
                                    { codOfertaPasajero: ofta.idOfertaPasajero },
                                    { codConductor: idConductor }
                                ],
                                _a),
                            group: 'codOfertaPasajero'
                        }).then(function (r) {
                            var cant = '0';
                            if (r.length != 0) {
                                cant = r[0].dataValues.cant;
                                // cant = 0;
                            }
                            modelos.Usuarios.findOne({ where: { idUsuario: ofta.codPasajero } }).then(function (usuarioDB) {
                                var o = {
                                    oferta: ofta,
                                    usuario: usuarioDB
                                };
                                if (cant <= '1') {
                                    ofertaC.push(o);
                                }
                                if (i >= oferta_1.length - 1) {
                                    return res.json({
                                        ok: true,
                                        ofertas: ofertaC
                                    });
                                }
                            });
                        });
                    };
                    for (i = 0; i < oferta_1.length; i++) {
                        _loop_1(i);
                    }
                }
                else {
                    res.json({
                        ok: false,
                        pagina: pagina,
                        ofertas: ofertaC
                    });
                }
                return [3 /*break*/, 4];
            case 2: return [4 /*yield*/, modelos.OfertaPasajeros.findAndCountAll({
                    where: {
                        terminada: 0,
                        codTipoServicio: (_c = {},
                            _c[Op.or] = [2, 4],
                            _c)
                    },
                    order: sequelize.literal('createdAt DESC'),
                    offset: offset,
                    limit: 10
                })];
            case 3:
                of1 = _e.sent();
                oferta_2 = of1.rows;
                if (oferta_2.length != 0) {
                    _loop_2 = function (i) {
                        var _a;
                        var ofta = oferta_2[i];
                        // obtener si el conductor ha hecho mas de dos contraoferta
                        modelos.ConductorOfertaPasajero.findAll({
                            attributes: [
                                [sequelize.fn('COUNT', sequelize.col('idConductorOfertaPasajero')), 'cant']
                            ],
                            where: (_a = {},
                                _a[Op.and] = [
                                    { codOfertaPasajero: ofta.idOfertaPasajero },
                                    { codConductor: idConductor }
                                ],
                                _a),
                            group: 'codOfertaPasajero'
                        }).then(function (r) {
                            var cant = '0';
                            if (r.length != 0) {
                                cant = r[0].dataValues.cant;
                                // cant = 0;
                            }
                            modelos.Usuarios.findOne({ where: { idUsuario: ofta.codPasajero } }).then(function (usuarioDB) {
                                var o = {
                                    oferta: ofta,
                                    usuario: usuarioDB
                                };
                                if (cant <= '1') {
                                    ofertaC.push(o);
                                }
                                if (i >= oferta_2.length - 1) {
                                    return res.json({
                                        ok: true,
                                        ofertas: ofertaC
                                    });
                                }
                            });
                        });
                    };
                    for (i = 0; i < oferta_2.length; i++) {
                        _loop_2(i);
                    }
                }
                else {
                    res.json({
                        ok: false,
                        pagina: pagina,
                        ofertas: ofertaC
                    });
                }
                _e.label = 4;
            case 4: return [3 /*break*/, 7];
            case 5: return [4 /*yield*/, modelos.OfertaPasajeros.findAndCountAll({
                    where: {
                        terminada: 0,
                        codTipoServicio: (_d = {},
                            _d[Op.or] = [1, 3],
                            _d)
                    },
                    order: sequelize.literal('createdAt DESC'),
                    offset: offset,
                    limit: 10
                })];
            case 6:
                of1 = _e.sent();
                oferta_3 = of1.rows;
                if (oferta_3.length != 0) {
                    _loop_3 = function (i) {
                        var _a;
                        var ofta = oferta_3[i];
                        // obtener si el conductor ha hecho mas de dos contraoferta
                        modelos.ConductorOfertaPasajero.findAll({
                            attributes: [
                                [sequelize.fn('COUNT', sequelize.col('idConductorOfertaPasajero')), 'cant']
                            ],
                            where: (_a = {},
                                _a[Op.and] = [
                                    { codOfertaPasajero: ofta.idOfertaPasajero },
                                    { codConductor: idConductor }
                                ],
                                _a),
                            group: 'codOfertaPasajero'
                        }).then(function (r) {
                            var cant = '0';
                            if (r.length != 0) {
                                cant = r[0].dataValues.cant;
                                // cant = 0;
                            }
                            modelos.Usuarios.findOne({ where: { idUsuario: ofta.codPasajero } }).then(function (usuarioDB) {
                                var o = {
                                    oferta: ofta,
                                    usuario: usuarioDB
                                };
                                if (cant <= '1') {
                                    ofertaC.push(o);
                                }
                                //  console.log(ofertaC);
                                if (i >= oferta_3.length - 1) {
                                    return res.json({
                                        ok: true,
                                        ofertas: ofertaC
                                    });
                                }
                            });
                        });
                    };
                    for (i = 0; i < oferta_3.length; i++) {
                        _loop_3(i);
                    }
                }
                else {
                    res.json({
                        ok: false,
                        pagina: pagina,
                        ofertas: ofertaC
                    });
                }
                _e.label = 7;
            case 7: return [2 /*return*/];
        }
    });
}); });
// Buscar las ofertas que acepto el pasajero 
conductorRoutes.get('/buscarOfertasAceptadas/:codConductor', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var codConductor, pagina, offset, ofertaC, of1, oferta, _loop_4, i;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                codConductor = req.params.codConductor;
                pagina = Number(req.query.pagina) || 1;
                offset = pagina - 1;
                offset = offset * 10;
                ofertaC = [];
                return [4 /*yield*/, modelos.ConductorOfertaPasajero.findAndCountAll({
                        where: {
                            codConductor: codConductor, estado: 0
                        },
                        order: sequelize.literal('createdAt DESC'),
                        offset: offset,
                        limit: 10
                    })];
            case 1:
                of1 = _a.sent();
                oferta = of1.rows;
                if (oferta.length != 0) {
                    _loop_4 = function (i) {
                        var ofta = oferta[i];
                        // Buscar los datos del pasajero y su nnombre
                        modelos.OfertaPasajeros.findOne({ where: { idOfertaPasajero: ofta.codOfertaPasajero } }).then(function (ofertaDB) {
                            // modelos.Usuarios.findOne({ where: {idUsuario: ofta.codPasajero}}).then(function(usuarioDB:any) {
                            modelos.Usuarios.findOne({ where: { idUsuario: ofertaDB.codPasajero } }).then(function (usuarioDB) {
                                var o = {
                                    completa: ofta,
                                    usuario: usuarioDB,
                                    oferta: ofertaDB
                                };
                                ofertaC.push(o);
                                if (i >= oferta.length - 1) {
                                    console.log(ofertaC.length);
                                    return res.json({
                                        ok: true,
                                        ofertas: ofertaC
                                    });
                                }
                            });
                        });
                    };
                    for (i = 0; i < oferta.length; i++) {
                        _loop_4(i);
                    }
                }
                else {
                    res.json({
                        ok: false,
                        pagina: pagina,
                        ofertas: ofertaC
                    });
                }
                return [2 /*return*/];
        }
    });
}); });
// Buscar las ofertas que el conductor ha aceptado
conductorRoutes.get('/buscar-cop', [autenticacion_1.verificaToken], function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var idUsuario;
    return __generator(this, function (_a) {
        idUsuario = req.usuario.idUsuario;
        console.log(idUsuario);
        modelos.ConductorOfertaPasajero.findAll({
            where: {
                codConductor: idUsuario, estado: 0
            },
            order: sequelize.literal('createdAt DESC')
        }).then(function (ofertasDB) {
            if (!ofertasDB) {
                return res.json({
                    ok: false,
                    mensaje: 'no se encontraron ofertas'
                });
            }
            else {
                return res.json({
                    ok: true,
                    ofertas: ofertasDB
                });
            }
        })
            .catch(function (err) {
            console.log(err);
            throw err;
        });
        return [2 /*return*/];
    });
}); });
//Guardar calificacion 
conductorRoutes.post('/calificar', [autenticacion_1.verificaToken], function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var body;
    return __generator(this, function (_a) {
        body = req.body;
        // body.idConductor = req.usuario.idUsuario;
        modelos.CalificacionConductor.create(body).then(function (conductorDB) {
            res.json({
                ok: true,
                conductor: conductorDB
            });
        }).catch(function (err) {
            res.json(err);
        });
        return [2 /*return*/];
    });
}); });
//Ver calificacion
conductorRoutes.get('/ver-calificacion/:codConductor', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var codConductor, c, p, a, v, puntualidad, atencion, vehiculo;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                codConductor = req.params.codConductor;
                return [4 /*yield*/, modelos.CalificacionConductor.count({
                        where: {
                            codConductor: codConductor
                        }
                    })];
            case 1:
                c = _a.sent();
                return [4 /*yield*/, modelos.CalificacionConductor.sum('puntualidad', {
                        where: {
                            codConductor: codConductor
                        }
                    })];
            case 2:
                p = _a.sent();
                return [4 /*yield*/, modelos.CalificacionConductor.sum('atencion', {
                        where: {
                            codConductor: codConductor
                        }
                    })];
            case 3:
                a = _a.sent();
                return [4 /*yield*/, modelos.CalificacionConductor.sum('vehiculo', {
                        where: {
                            codConductor: codConductor
                        }
                    })];
            case 4:
                v = _a.sent();
                puntualidad = Math.round(p / c) || 0;
                atencion = Math.round(a / c) || 0;
                vehiculo = Math.round(v / c) || 0;
                res.json({
                    ok: true,
                    puntualidad: puntualidad,
                    atencion: atencion,
                    vehiculo: vehiculo
                });
                return [2 /*return*/];
        }
    });
}); });
exports.default = conductorRoutes;
