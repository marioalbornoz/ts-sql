"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const usuarios_1 = require("../controllers/usuarios");
const router = express_1.Router();
// crud routes usera
router.get('/', usuarios_1.getUsuarios);
router.get('/:id', usuarios_1.getUsuario);
router.post('/', usuarios_1.postUsuario);
router.put('/:id', usuarios_1.putUsuario);
router.delete('/:id', usuarios_1.deleteUsuario);
// authenticate and validate
router.post('/login', usuarios_1.authenticate);
router.get('/confirm/:token', usuarios_1.confirm);
router.post('/changepass', usuarios_1.passChange);
router.get('/changepass/:token', usuarios_1.validateToken);
router.post('/changepass/:token', usuarios_1.newPass);
exports.default = router;
//# sourceMappingURL=usuario.routes.js.map