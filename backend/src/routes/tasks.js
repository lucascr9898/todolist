// backend/src/routes/tasks.js

import express from 'express';
import db from '../db/connection.js'; 

// --- CORREÇÃO: Cria a instância do Router do Express ---
const router = express.Router();
// ----------------------------------------------------


// ROTA 1: GET /api/tasks (Listar todas as tarefas)
router.get('/', async (req, res) => {
    try {
        const tasks = await db('tasks').select('*');
        return res.status(200).json(tasks);
    } catch (error) {
        console.error('Erro ao listar tarefas:', error);
        return res.status(500).json({ error: 'Falha ao buscar tarefas.' });
    }
});


// ROTA 2: POST /api/tasks (Criar nova tarefa)
router.post('/', async (req, res) => {
    const { title } = req.body;

    if (!title || typeof title !== 'string' || title.trim() === '') {
        return res.status(400).json({ error: 'O campo "title" é obrigatório e deve ser um texto válido.' });
    }

    try {
        const [insertedId] = await db('tasks').insert({
            title: title.trim()
        });

        // Retorna o objeto completo da tarefa inserida
        const newTask = await db('tasks').where('id', insertedId).first();
        return res.status(201).json(newTask); 

    } catch (error) {
        console.error('Erro ao criar tarefa:', error);
        return res.status(500).json({ error: 'Falha ao inserir a tarefa no banco de dados.' });
    }
});


// ROTA 3: PATCH /api/tasks/:id (Atualização parcial)
router.patch('/:id', async (req, res) => {
    const { id } = req.params;
    const { title, completed } = req.body;

    // Validação: deve haver pelo menos um campo para atualizar
    if (title === undefined && completed === undefined) {
        return res.status(400).json({ error: 'Nenhum campo fornecido para atualização (title ou completed).' });
    }

    const dataToUpdate = {};
    if (title !== undefined) {
        dataToUpdate.title = title.trim();
    }
    if (completed !== undefined) {
        // Converte para booleano ou 0/1, dependendo de como o MySQL lida com a entrada
        dataToUpdate.completed = Boolean(completed); 
    }

    try {
        const count = await db('tasks').where('id', id).update(dataToUpdate);

        if (count === 0) {
            return res.status(404).json({ error: 'Tarefa não encontrada.' });
        }

        const updatedTask = await db('tasks').where('id', id).first();
        return res.status(200).json(updatedTask); 

    } catch (error) {
        console.error('Erro ao atualizar tarefa:', error);
        return res.status(500).json({ error: 'Falha ao atualizar a tarefa no banco de dados.' });
    }
});


// ROTA 4: DELETE /api/tasks/:id (Excluir tarefa)
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const count = await db('tasks').where('id', id).del();

        if (count === 0) {
            return res.status(404).json({ error: 'Tarefa não encontrada.' });
        }

        // 204 No Content para deleção bem-sucedida
        return res.status(204).send(); 

    } catch (error) {
        console.error('Erro ao deletar tarefa:', error);
        return res.status(500).json({ error: 'Falha ao deletar a tarefa do banco de dados.' });
    }
});


// Exporta o roteador para ser usado no server.js
export default router;