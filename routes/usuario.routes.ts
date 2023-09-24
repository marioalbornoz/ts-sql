import { Router } from 'express';
import {
  getUsuario,
  getUsuarios,
  postUsuario,
  putUsuario,
  deleteUsuario,
  authenticate,
  confirm,
  passChange,
  validateToken,
  newPass
} from "../controllers/usuarios";


const router = Router();

// crud routes usera
router.get('/',       getUsuarios );
router.get('/:id',    getUsuario );
router.post('/',      postUsuario );
router.put('/:id',    putUsuario );
router.delete('/:id', deleteUsuario );

// authenticate and validate
router.post('/login', authenticate);
router.get('/confirm/:token', confirm);
router.post('/changepass', passChange);
router.get('/changepass/:token', validateToken);
router.post('/changepass/:token', newPass);



export default router;