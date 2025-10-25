import {Database} from 'bun:sqlite';

const db = new Database('mydb.sqlite');
db.exec(`
  CREATE TABLE IF NOT EXISTS problems (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    difficulty TEXT NULLABLE,
    code TEXT 
  );
`);

export default db;