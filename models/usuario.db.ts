import { DataTypes } from 'sequelize';
import bycript from 'bcrypt';
import db from '../db/connection';

const Usuario = db.define('Usuario', {
    name: {
        type: DataTypes.STRING,
    },
    password : {
        type: DataTypes.STRING
    },
    email: {
        type: DataTypes.STRING
    },
    isVerified: {
        type: DataTypes.BOOLEAN
    },
    area:{
        type: DataTypes.STRING
    },
    role:{
        type: DataTypes.STRING,
        defaultValue: 'None'
    },
    status:{
        type: DataTypes.STRING,
        defaultValue: 'active'
    },
    token: {
        type: DataTypes.STRING
    }
},{
    timestamps: true
}
);


Usuario.beforeCreate(async(user)=>{
    let pass =  user.getDataValue('password');
    user.setDataValue('password', await bycript.hash(pass, 10));

});


Usuario.prototype.validPassword = async function(password: string) {
    return await bycript.compare(password, this.password);
}


export default Usuario;