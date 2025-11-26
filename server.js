import express from 'express';
import publicRoutes from './routes/public.js';
import privateRoutes from './routes/private.js';
import auth from './middlewares/auth.js';
import connectDB from './database.js'; // Importa a conexão
// import dotenv from 'dotenv';
// dotenv.config();
// heroku não precisa, mas local precisa

const app = express();

// Conecta ao MongoDB
connectDB();

app.use(express.json());

app.use('/', publicRoutes);
app.use('/private', auth, privateRoutes);

app.get('/', (req, res) => {
    res.send('Servidor Express + MongoDB rodando no Heroku!');
});

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});