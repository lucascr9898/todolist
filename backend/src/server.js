// backend/src/server.js
import express from 'express';
// 🛑 NOVO: Importe o módulo 'cors'
import cors from 'cors'; 
import tasksRouter from './routes/tasks.js';

// --- CORREÇÃO: Cria a instância do Express e a atribui a 'app' ---
const app = express();
// -------------------------------------------------------------------

const port = 3333;

// Middlewares
// 🛑 NOVO: Adicione o middleware CORS AQUI, ANTES de suas rotas
app.use(cors());

// 1. Permite que o Express leia e entenda o corpo das requisições em formato JSON (essencial para POST/PUT)
app.use(express.json());

// 2. Rota de testes inicial (opcional, pode ser removida depois)
app.get('/', (req, res) => {
    res.send('API Node.js rodando!');
});

// 3. Define a rota principal para o módulo de tarefas
// Todas as requisições para '/api/tasks' serão tratadas pelo tasksRouter
app.use('/api/tasks', tasksRouter);

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});