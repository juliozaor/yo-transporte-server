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
var bcrypt_1 = __importDefault(require("bcrypt"));
var token_1 = __importDefault(require("../clasess/token"));
var autenticacion_1 = require("../middlewares/autenticacion");
var sequelize_1 = require("sequelize");
var sequelize = new sequelize_1.Sequelize('mysql::memory:');
var Op = require('sequelize').Op;
var userRoutes = express_1.Router();
var modelos = require('../models');
// Login
userRoutes.post('/login', function (req, res) {
    var body = req.body;
    modelos.Usuarios.findOne({ where: { email: body.email } }).then(function (userDB) {
        if (!userDB) {
            return res.json({
                ok: false,
                mensaje: 'Usuario/contraseña no son correctos'
            });
        }
        else {
            console.log('Usuario encontrado. Seguimos procesando');
            var hashed_password = userDB.password;
            if (bcrypt_1.default.compareSync(body.password, hashed_password)) {
                console.log('login coorrecto');
                var tokenUser = token_1.default.getJwtToken({
                    idUsuario: userDB.idUsuario,
                    nombre: userDB.nombre,
                    cedula: userDB.cedula,
                    email: userDB.email,
                    telefono: userDB.telefono,
                    foto: userDB.foto
                });
                res.json({
                    ok: true,
                    token: tokenUser
                });
            }
            else {
                console.log('Login incorrecto');
                return res.json({
                    ok: false,
                    mensaje: 'Usuario/contraseña no son correctos ***'
                });
            }
        }
    })
        .catch(function (err) {
        console.log(err);
        throw err;
    });
});
userRoutes.post('/create', function (req, res) {
    var user = {
        nombre: req.body.nombre,
        cedula: req.body.cedula,
        telefono: req.body.telefono,
        email: req.body.email,
        password: bcrypt_1.default.hashSync(req.body.password, 10),
        foto: req.body.foto,
        idSignal: req.body.idSignal,
        codCiudad: req.body.codCiudad
    };
    // Crear el usuario
    modelos.Usuarios.create(user).then(function (userDB) {
        // Tomar datos para crear el conductor
        var pasajero = {
            idPasajero: userDB.idUsuario,
            estado: true
        };
        //Crear el pasajero con el id del usuario
        modelos.Pasajeros.create(pasajero).then(function (userPDB) {
            var tokenUser = token_1.default.getJwtToken({
                idUsuario: userDB.idUsuario,
                nombre: userDB.nombre,
                cedula: userDB.cedula,
                email: userDB.email,
                telefono: userDB.telefono,
                foto: userDB.foto,
                idSignal: req.body.idSignal,
                codCiudad: req.body.codCiudad
            });
            res.json({
                ok: true,
                token: tokenUser,
                mensaje: "Usuario creado"
            });
        });
    }).catch(function (err) {
        res.json({
            ok: false,
            err: err
        });
    });
});
// Actualizar usuario
userRoutes.post('/update', autenticacion_1.verificaToken, function (req, res) {
    var user = {
        nombre: req.body.nombre,
        cedula: req.body.cedula,
        telefono: req.body.telefono,
        email: req.body.email,
        password: bcrypt_1.default.hashSync(req.body.password, 10),
        foto: req.body.foto,
        idSignal: req.body.idSignal,
        codCiudad: req.body.codCiudad
    };
    console.log("El usuario que viene : ", user.nombre, " ", user.email);
    modelos.Usuarios.update(user, { where: { id: req.usuario.idUsuario } }, { new: true }).then(function (userDB) {
        console.log("El usuario de DB : ", userDB);
        if (!userDB) {
            return res.json({
                ok: false,
                mensaje: 'No existe un usuario con ese ID'
            });
        }
        else {
            console.log('Usuario encontrado. Seguimos procesando');
            var tokenUser = token_1.default.getJwtToken({
                idUsuario: userDB.idUsuario,
                nombre: userDB.nombre,
                cedula: userDB.cedula,
                email: userDB.email,
                telefono: userDB.telefono,
                foto: userDB.foto,
                idSignal: req.body.idSignal,
                codCiudad: req.body.codCiudad
            });
            res.json({
                ok: true,
                token: tokenUser
            });
        }
    })
        .catch(function (err) {
        console.log(err);
        throw err;
    });
});
userRoutes.get('/', [autenticacion_1.verificaToken], function (req, res) {
    var usuario = req.usuario;
    res.json({
        ok: true,
        usuario: usuario
    });
});
// cuando el usuario pasajero acepta la oferta del conductor
userRoutes.post('/pasajero-oferta-conductor', [autenticacion_1.verificaToken], function (req, res) {
    var body = req.body;
    body.codPasajero = req.usuario.idUsuario;
    modelos.PasajeroOfertaConductores.create(body).then(function (ofertaCDB) {
        res.json({
            ok: true,
            conductor: ofertaCDB
        });
    }).catch(function (err) {
        res.json(err);
    });
});
// Buscar las ofertas que aceptaron los conductores 
userRoutes.get('/buscarOfertasAceptadas/:codPasajero', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var codPasajero, pagina, offset, ofertaC, of1, oferta, _loop_1, i;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                codPasajero = req.params.codPasajero;
                pagina = Number(req.query.pagina) || 1;
                offset = pagina - 1;
                offset = offset * 10;
                ofertaC = [];
                return [4 /*yield*/, modelos.PasajeroOfertaConductores.findAndCountAll({
                        where: {
                            codPasajero: codPasajero, estado: 0
                        },
                        order: sequelize.literal('createdAt DESC'),
                        offset: offset,
                        limit: 10
                    })];
            case 1:
                of1 = _a.sent();
                oferta = of1.rows;
                if (oferta.length != 0) {
                    _loop_1 = function (i) {
                        var ofta = oferta[i];
                        // Buscar los datos del conductor y su nnombre
                        modelos.OfertaConductores.findOne({ where: { idOfertaConductor: ofta.codOfertaConductor } }).then(function (ofertaDB) {
                            // modelos.Usuarios.findOne({ where: {idUsuario: ofta.codPasajero}}).then(function(usuarioDB:any) {
                            modelos.Usuarios.findOne({ where: { idUsuario: ofertaDB.codConductor } }).then(function (usuarioDB) {
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
                return [2 /*return*/];
        }
    });
}); });
// Creacion de la oferta del pasajero
userRoutes.post('/oferta-pasajero', [autenticacion_1.verificaToken], function (req, res) {
    var body = req.body;
    body.codPasajero = req.usuario.idUsuario;
    modelos.OfertaPasajeros.create(body).then(function (ofertaCDB) {
        res.json({
            ok: true,
            ofertaPasajero: ofertaCDB
        });
    }).catch(function (err) {
        res.json(err);
    });
});
/*     // Obtener POST paginados
postRoutes.get('/', async (req: any, res: Response) => {

    let pagina = Number(req.query.pagina) || 1;
    let skip = pagina - 1;
    skip = skip * 10;

    const posts = await Post.find()
                            .sort({ _id: -1 })
                            .skip( skip )
                            .limit(10)
                            .populate('usuario', '-password')
                            .exec();


    res.json({
        ok: true,
        pagina,
        posts
    });


}); */
// Ofertas publicadas por los conductores
userRoutes.get('/buscarOfertasConductor/:codTipoServicio', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var codTipoServicio, pagina, offset, ofertaC, conductor, usuario, idPasajero, of1, oferta, _loop_2, i;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                codTipoServicio = req.params.codTipoServicio;
                pagina = Number(req.query.pagina) || 1;
                offset = pagina - 1;
                offset = offset * 10;
                ofertaC = [];
                conductor = {};
                usuario = {};
                idPasajero = req.query.idPasajero;
                return [4 /*yield*/, modelos.OfertaConductores.findAndCountAll({
                        where: {
                            codTipoServicio: codTipoServicio, terminada: 0
                        },
                        order: sequelize.literal('createdAt DESC'),
                        offset: offset,
                        limit: 10
                    })];
            case 1:
                of1 = _a.sent();
                oferta = of1.rows;
                if (oferta.length != 0) {
                    _loop_2 = function (i) {
                        var _a;
                        var ofta = oferta[i];
                        // obtener si el conductor ha hecho mas de dos contraoferta
                        modelos.PasajeroOfertaConductores.findAll({
                            attributes: [
                                [sequelize.fn('COUNT', sequelize.col('idPasajeroOfertaConductor')), 'cant']
                            ],
                            where: (_a = {},
                                _a[Op.and] = [
                                    { codOfertaConductor: ofta.idOfertaConductor },
                                    { codPasajero: idPasajero }
                                ],
                                _a),
                            group: 'codOfertaConductor'
                        }).then(function (r) {
                            var cant = '0';
                            if (r.length != 0) {
                                cant = r[0].dataValues.cant;
                                // cant = 0;
                            }
                            modelos.Usuarios.findOne({ where: { idUsuario: ofta.codConductor } }).then(function (usuarioDB) {
                                // usuario = usuarioDB;
                                modelos.Conductores.findOne({ where: { idConductor: ofta.codConductor } }).then(function (conductorDB) {
                                    conductor = conductorDB;
                                    var o = {
                                        oferta: ofta,
                                        usuario: usuarioDB,
                                        conductor: conductorDB
                                    };
                                    if (cant <= '1') {
                                        ofertaC.push(o);
                                    }
                                    if (i >= oferta.length - 1) {
                                        console.log(ofertaC.length);
                                        return res.json({
                                            ok: true,
                                            ofertas: ofertaC
                                        });
                                    }
                                });
                            });
                        });
                    };
                    for (i = 0; i < oferta.length; i++) {
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
                return [2 /*return*/];
        }
    });
}); });
// buscar un usuario en especifico
userRoutes.get('/buscar/:idUsuario', function (req, res) {
    //const body = req.body;
    var idUsuario = req.params.idUsuario;
    modelos.Usuarios.findOne({ where: { idUsuario: idUsuario } }).then(function (usuarioDB) {
        if (!usuarioDB) {
            return res.json({
                ok: false,
                usuario: 'No hay datos'
            });
        }
        else {
            return res.json({
                ok: true,
                usuario: usuarioDB
            });
        }
    })
        .catch(function (err) {
        console.log(err);
        throw err;
    });
});
// Buscar las ofertas que el usuario ha aceptado
userRoutes.get('/buscar-poc', [autenticacion_1.verificaToken], function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var idUsuario;
    return __generator(this, function (_a) {
        idUsuario = req.usuario.idUsuario;
        console.log(idUsuario);
        modelos.PasajeroOfertaConductores.findAll({
            where: {
                codPasajero: idUsuario, estado: 0
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
// ofertas generadas por el pasajero
userRoutes.get('/buscarOfertas/:idUsuario', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var idUsuario, pagina, offset, ofertasDB;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                idUsuario = req.params.idUsuario;
                pagina = Number(req.query.pagina) || 1;
                offset = pagina - 1;
                offset = offset * 10;
                return [4 /*yield*/, modelos.OfertaPasajeros.findAll({
                        where: {
                            codPasajero: idUsuario, terminada: 0
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
// Buscar las ofertas que el usuario ha aceptado
userRoutes.get('/buscar-cop/:idOferta', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var idOferta;
    return __generator(this, function (_a) {
        idOferta = req.params.idOferta;
        console.log(idOferta);
        modelos.ConductorOfertaPasajero.findAll({
            where: {
                codOfertaPasajero: idOferta, estado: 0
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
userRoutes.post('/update-cop/:id', autenticacion_1.verificaToken, function (req, res) {
    var datos = {
        estado: req.body.estado,
        aceptada: req.body.aceptada
    };
    modelos.ConductorOfertaPasajero.update(datos, { where: { idConductorOfertaPasajero: req.params.id } }, { new: true }).then(function (resp) {
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
userRoutes.post('/terminar-oferta/:id', autenticacion_1.verificaToken, function (req, res) {
    var dato = {
        terminada: true,
    };
    modelos.OfertaPasajeros.update(dato, { where: { idOfertaPasajero: req.params.id } }, { new: true }).then(function (resp) {
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
//Guardar calificacion 
userRoutes.post('/calificar', [autenticacion_1.verificaToken], function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var body;
    return __generator(this, function (_a) {
        body = req.body;
        // body.idConductor = req.usuario.idUsuario;
        modelos.CalificacionPasajero.create(body).then(function (pasajeroDB) {
            res.json({
                ok: true,
                pasajero: pasajeroDB
            });
        }).catch(function (err) {
            res.json(err);
        });
        return [2 /*return*/];
    });
}); });
//Ver calificacion
userRoutes.get('/ver-calificacion/:codPasajero', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var codPasajero, c, p, a, puntualidad, atencion;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                codPasajero = req.params.codPasajero;
                return [4 /*yield*/, modelos.CalificacionPasajero.count({
                        where: {
                            codPasajero: codPasajero
                        }
                    })];
            case 1:
                c = _a.sent();
                return [4 /*yield*/, modelos.CalificacionPasajero.sum('puntualidad', {
                        where: {
                            codPasajero: codPasajero
                        }
                    })];
            case 2:
                p = _a.sent();
                return [4 /*yield*/, modelos.CalificacionPasajero.sum('atencion', {
                        where: {
                            codPasajero: codPasajero
                        }
                    })];
            case 3:
                a = _a.sent();
                puntualidad = Math.round(p / c) || 0;
                atencion = Math.round(a / c) || 0;
                res.json({
                    ok: true,
                    puntualidad: puntualidad,
                    atencion: atencion
                });
                return [2 /*return*/];
        }
    });
}); });
// Buscar las ofertas que el usuario ha aceptado
userRoutes.get('/listar-ciudades', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        modelos.Ciudades.findAll({
            order: sequelize.literal('createdAt ASC')
        }).then(function (ciudadDB) {
            if (!ciudadDB) {
                return res.json({
                    ok: false,
                    mensaje: 'no se encontraron ciudades'
                });
            }
            else {
                return res.json({
                    ok: true,
                    ciudades: ciudadDB
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
exports.default = userRoutes;
