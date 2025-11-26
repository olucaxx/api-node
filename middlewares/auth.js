import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

const auth = (req, res, next) => {
    
    const token = req.headers.authorization;
    console.log('Token recebido:', token);

    // CORREÇÃO: estava verificando se TEM token e negando acesso
    if(!token){
        return res.status(401).json({ message: 'Acesso negado - Token não fornecido'});
    }

    try {
        // CORREÇÃO: remove 'Bearer ' do token
        const decoded = jwt.verify(token.replace('Bearer ', ''), JWT_SECRET);
        console.log('Token decodificado:', decoded);
        
        // Adiciona o ID do usuário na request para usar nas rotas
        req.userId = decoded.id;
        
        next();
    }
    catch (err){
        return res.status(401).json({ message: 'Token inválido'});
    }
}

export default auth;