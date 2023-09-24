import { Request, Response } from 'express';
import Usuario from '../models/usuario.db';
import { generateToken } from '../helpers/generateJWT';
import { generateIdentifier } from '../helpers/generateID';


export const getUsuarios = async( _req: Request , res: Response ): Promise<void> => {

    const usuarios = await Usuario.findAll();
    res.json({ usuarios });
}

export const getUsuario = async( req: Request , res: Response ) => {

    const { id } = req.params;

    const usuario = await Usuario.findByPk( id );

    if( usuario ) {
        res.json(usuario);
    } else {
        res.status(404).json({
            msg: `No existe un usuario con el id ${ id }`
        });
    }


}

export const postUsuario = async( req: Request , res: Response ) => {

    const { body } = req;

    try {
        
        const existeEmail = await Usuario.findOne({
            where: {
                email: body.email
            }
        });

        if (existeEmail) {
            return res.status(400).json({
                msg: 'Ya existe un usuario con el email ' + body.email
            });
        }


        const usuario = await Usuario.create(body);

        res.json( usuario );


    } catch (error) {

        console.log(error);
        res.status(500).json({
            msg: 'Hable con el administrador'
        })    
    }



}

export const putUsuario = async( req: Request , res: Response ) => {

    const { id }   = req.params;
    const { body } = req;

    try {
        
        const usuario = await Usuario.findByPk( id );
        if ( !usuario ) {
            return res.status(404).json({
                msg: 'No existe un usuario con el id ' + id
            });
        }

        await usuario.update( body );

        res.json( usuario );


    } catch (error) {

        console.log(error);
        res.status(500).json({
            msg: 'Hable con el administrador'
        })    
    }   
}


export const deleteUsuario = async( req: Request , res: Response ) => {

    const { id } = req.params;

    const usuario = await Usuario.findByPk( id );
    if ( !usuario ) {
        return res.status(404).json({
            msg: 'No existe un usuario con el id ' + id
        });
    }

    await usuario.update({ estado: false });

    // await usuario.destroy();


    res.json(usuario);
}


export const authenticate = async( req: Request , res: Response) => {
    const {email, password} = req.body;

    //comprobar si el usuario existe
    const existeUsuario: any = await Usuario.findOne({
        where: {
            email
        }
    });
    
    if (!existeUsuario) {
        return res.status(404).json({
            msg: 'No existe un usuario con el email'+ email
        });
    }
    // comprobar si el usuario esta confirmado

    if (!existeUsuario.isVerified) {
        return res.status(404).json({
            msg: 'El usuario no esta confirmado'
        });
    }
    // comprobar su password
    const isValidPassword: boolean = await existeUsuario.validPassword(password);
    if(!isValidPassword){
        return res.status(403).json({
            msg: 'La contraseña es incorrecta'
        });
    }
    const {id, name} = existeUsuario;
    const token = generateToken(name);
    return res.status(200).json({
        id, name, email, token
    })
}


export const confirm = async(req: Request, res: Response)=>{
    const {token} = req.params;
    const usuarioConfirm = await Usuario.findOne({
        where: {
            token
        }
    })
    if(!usuarioConfirm){
        return res.status(404).json({
            msg: 'No existe un usuario con el token'+ token
        });
    }
    if(usuarioConfirm){
        usuarioConfirm.update({
            isVerified: true,
            token:""
        })
        return res.status(200).json({
            msg: 'Usuario confirmado'
        })
    }

}

export const passChange = async(req: Request, res: Response)=>{
    const {email} = req.body;

    //comprobar si el usuario existe
    const existeUsuario: any = await Usuario.findOne({
        where: {
            email
        }
    });
    
    if (!existeUsuario) {
        return res.status(404).json({
            msg: 'No existe un usuario con el email'+ email
        });
    }
    try {
        existeUsuario.update({
            token: generateIdentifier(email)
        });
        return res.status(200).json({ msg: "Hemos enviado un email con las instrucciones"});

    } catch (error) {
        console.log(error);
    }
}


export const validateToken = async (req: Request, res: Response) => {
  const { token } = req.params;
  const usuario = await Usuario.findOne({
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
};


export const newPass = async (req: Request, res: Response) => {
  const { token } = req.params;

    const { password } = req.body;
    const usuario = await Usuario.findOne({
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
            token:""
        })
        return res.status(200).json({
            msg: "Contraseña actualizada",
        })
    } catch (error) {
        console.log(error)
    }
};