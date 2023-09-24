import jwt from 'jsonwebtoken';

export const generateToken =(id: string) =>{
    return jwt.sign({ id}, "secret", { expiresIn: '10days' });
}