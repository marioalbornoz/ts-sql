import { DataTypes } from 'sequelize';
import bycript from 'bcrypt';
import db from '../db/connection';

const Usuario = db.define('Usuario', {
    nombre: {
        type: DataTypes.STRING
    },
    password : {
        type: DataTypes.STRING
    },
    email: {
        type: DataTypes.STRING
    },
    estado: {
        type: DataTypes.BOOLEAN
    },
    rol:{
        type: DataTypes.STRING,
        defaultValue: 'none'
    }
},{
    timestamps: true
}
);


Usuario.beforeCreate(async(user)=>{
    let pass =  user.getDataValue('password');
    user.setDataValue('password', await bycript.hash(pass, 10));

});


export default Usuario;