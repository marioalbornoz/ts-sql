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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.newPass = exports.validateToken = exports.passChange = exports.confirm = exports.authenticate = exports.deleteUsuario = exports.putUsuario = exports.postUsuario = exports.getUsuario = exports.getUsuarios = void 0;
const usuario_db_1 = __importDefault(require("../models/usuario.db"));
const generateJWT_1 = require("../helpers/generateJWT");
const generateID_1 = require("../helpers/generateID");
const getUsuarios = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const usuarios = yield usuario_db_1.default.findAll();
    res.json({ usuarios });
});
exports.getUsuarios = getUsuarios;
const getUsuario = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const usuario = yield usuario_db_1.default.findByPk(id);
    if (usuario) {
        res.json(usuario);
    }
    else {
        res.status(404).json({
            msg: `No existe un usuario con el id ${id}`
        });
    }
});
exports.getUsuario = getUsuario;
const postUsuario = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { body } = req;
    try {
        const existeEmail = yield usuario_db_1.default.findOne({
            where: {
                email: body.email
            }
        });
        if (existeEmail) {
            return res.status(400).json({
                msg: 'Ya existe un usuario con el email ' + body.email
            });
        }
        const usuario = yield usuario_db_1.default.create(body);
        res.json(usuario);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Hable con el administrador'
        });
    }
});
exports.postUsuario = postUsuario;
const putUsuario = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { body } = req;
    try {
        const usuario = yield usuario_db_1.default.findByPk(id);
        if (!usuario) {
            return res.status(404).json({
                msg: 'No existe un usuario con el id ' + id
            });
        }
        yield usuario.update(body);
        res.json(usuario);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Hable con el administrador'
        });
    }
});
exports.putUsuario = putUsuario;
const deleteUsuario = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const usuario = yield usuario_db_1.default.findByPk(id);
    if (!usuario) {
        return res.status(404).json({
            msg: 'No existe un usuario con el id ' + id
        });
    }
    yield usuario.update({ estado: false });
    // await usuario.destroy();
    res.json(usuario);
});
exports.deleteUsuario = deleteUsuario;
const authenticate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    //comprobar si el usuario existe
    const existeUsuario = yield usuario_db_1.default.findOne({
        where: {
            email
        }
    });
    if (!existeUsuario) {
        return res.status(404).json({
            msg: 'No existe un usuario con el email' + email
        });
    }
    // comprobar si el usuario esta confirmado
    if (!existeUsuario.isVerified) {
        return res.status(404).json({
            msg: 'El usuario no esta confirmado'
        });
    }
    // comprobar su password
    const isValidPassword = yield existeUsuario.validPassword(password);
    if (!isValidPassword) {
        return res.status(403).json({
            msg: 'La contraseña es incorrecta'
        });
    }
    const { id, name } = existeUsuario;
    const token = generateJWT_1.generateToken(name);
    return res.status(200).json({
        id, name, email, token
    });
});
exports.authenticate = authenticate;
const confirm = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { token } = req.params;
    const usuarioConfirm = yield usuario_db_1.default.findOne({
        where: {
            token
        }
    });
    if (!usuarioConfirm) {
        return res.status(404).json({
            msg: 'No existe un usuario con el token' + token
        });
    }
    if (usuarioConfirm) {
        usuarioConfirm.update({
            isVerified: true,
            token: ""
        });
        return res.status(200).json({
            msg: 'Usuario confirmado'
        });
    }
});
exports.confirm = confirm;
const passChange = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    //comprobar si el usuario existe
    const existeUsuario = yield usuario_db_1.default.findOne({
        where: {
            email
        }
    });
    if (!existeUsuario) {
        return res.status(404).json({
            msg: 'No existe un usuario con el email' + email
        });
    }
    try {
        existeUsuario.update({
            token: generateID_1.generateIdentifier(email)
        });
        return res.status(200).json({ msg: "Hemos enviado un email con las instrucciones" });
    }
    catch (error) {
        console.log(error);
    }
});
exports.passChange = passChange;
const validateToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { token } = req.params;
    const usuario = yield usuario_db_1.default.findOne({
        where: {
            token,
        },
    });
    if (!usuario) {
        return res.status(404).json({
            msg: "No existe un usuario con el token" + token,
        });
    }
    return res.status(200).json({
        msg: "Usuario valido",
        usuario,
    });
});
exports.validateToken = validateToken;
const newPass = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { token } = req.params;
    const { password } = req.body;
    const usuario = yield usuario_db_1.default.findOne({
        where: {
            token,
        },
    });
    if (!usuario) {
        return res.status(404).json({
            msg: "No existe un usuario con el token" + token,
        });
    }
    try {
        usuario.update({
            password,
            token: ""
        });
        return res.status(200).json({
            msg: "Contraseña actualizada",
        });
    }
    catch (error) {
        console.log(error);
    }
});
exports.newPass = newPass;
//# sourceMappingURL=usuarios.js.map