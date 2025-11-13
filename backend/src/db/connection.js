// backend/src/db/connection.js

import knex from 'knex';
// Importa a configuração que você corrigiu em knexfile.js
import knexfile from '../../knexfile.js'; 

// O ambiente padrão é 'development'
const config = knexfile.development;

// Cria a instância de conexão Knex
const db = knex(config);

export default db;