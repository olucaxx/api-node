import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js'; // Importa o model
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

// CADASTRO
router.post('/cadastro', async (req, res) => {
    try {
        const userData = req.body;

        // Verifica se usuário já existe
        const existingUser = await User.findOne({ email: userData.email });
        if (existingUser) {
            return res.status(400).json({ message: "Usuário já existe" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(userData.password, salt);

        // CORREÇÃO: usa User.create() em vez de Prisma
        const userDB = await User.create({
            email: userData.email,
            name: userData.name,
            password: hashPassword,
        });

        res.status(201).json({ 
            message: "Usuário criado com sucesso",
            user: {
                id: userDB._id,
                email: userDB.email,
                name: userDB.name
            }
        });
    }
    catch(err) {
        console.log(err);
        res.status(500).json({ message: "Erro no Servidor, tente novamente" });
    }
});

// LOGIN
router.post('/login', async (req, res) => {
    try {
        const userInfo = req.body; // CORREÇÃO: era HTMLTableRowElement.body 🤣
        
        // CORREÇÃO: usa mongoose em vez de Prisma
        const user = await User.findOne({ email: userInfo.email });

        // Verifica se o usuário existe
        if(!user) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        // Compara as senhas
        const isMatch = await bcrypt.compare(userInfo.password, user.password);
        
        // CORREÇÃO: lógica invertida - se NÃO for match
        if(!isMatch) {
            return res.status(400).json({ message: 'Senha inválida' });
        }

        // Gera token
        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({
            message: "Login realizado com sucesso",
            token: token,
            user: {
                id: user._id,
                email: user.email,
                name: user.name
            }
        });
    }
    catch(err) {
        console.log(err);
        res.status(500).json({ message: "Erro no Servidor, tente novamente" });
    }
});

export default router;