import fs from 'fs';
import path from 'path';

import { Pool } from 'pg';

const pool = new Pool({
  user: 'postgres',
  password: 'root',
  host: 'localhost',
  port: 5432,
  database: 'hotels.ru',
});

fs.readFile(path.resolve(__dirname, './initDB.sql'), (err, data) => {
  if (err) return console.log('Cant read ./initDB.sql');

  const query = data.toString();

  pool
    .query(query)
    .catch((e) => console.log('Error create default table in db:', e));
});

// pool.query('');

export default pool;
