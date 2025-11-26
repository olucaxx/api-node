import express from 'express';
import User from '../models/User.js'; // Importa o model

const router = express.Router();

// CORREÇÃO: remove Prisma, usa mongoose
router.get('/listar-usuarios', async (req, res) => {
    try {
        const users = await User.find().select('-password'); // Exclui a senha
        res.status(200).json({ 
            message: 'Usuários listados com sucesso', 
            users: users 
        });
    }
    catch(err) {
        console.log(err);
        res.status(500).json({ message: 'Falha no servidor' });
    }
});

// Rota de exemplo que usa o auth
router.get('/perfil', async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('-password');
        res.json({ user });
    } catch (err) {
        res.status(500).json({ message: 'Erro ao buscar perfil' });
    }
});

export default router;