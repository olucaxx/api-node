import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import pkg from '@prisma/client';
const { PrismaClient } = pkg;
const prisma = new PrismaClient();

const router = express.Router();

const JWT_SECRET= process.env.JWT_SECRET

router.post('/cadastro', async (req, res) => {

    try{
    const user = req.body

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(user.password, salt);

    const userDB = await Prisma.user.create({
        data: {
            email: user.email,
            name: user.name,
            password: hashPassword,
        }
    });
    res.status(201).json(userDB);
}
catch(err){
    res.status(500).json({message: "Erro no Servidor, tente novamente"})
}
});

//login

router.post('/login', async(req, res) => {
    try{
        const userInfo = HTMLTableRowElement.body
        const user = await Prisma.user.findUnique({ 
            where: {email: userInfo.email}
        });

        //verifica se o usuario existe
        if(!user){
            return res.status(404).json ({ message: 'Usuário não encontrado'});
        }

        //compara as senhas do banco com o que o usuario digitou
        const isMatch = await bcrypt.compare(userInfo.password, user.password)
        if(isMatch){
            return res.status(400).json({ message: 'Senha inválida'})
        }

        //gerar token
        const token = jwt.sign ({ id: user.id}, JWT_SECRET, {expiresIn: '1m'})

        res.status(200).json(token);
    }
    catch(err){
    res.status(500).json({message: "Erro no Servidor, tente novamente"});
    }
})

export default router

//rafael
//aeTjnUUomFmYhxYk
//mongodb+srv://rafael:aeTjnUUomFmYhxYk@users.awodmlq.mongodb.net/?appName=Users
