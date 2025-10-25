import db from './db';
import express from 'express';

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static('static'));

app.post('/problems', (req:express.Request, res:express.Response) => {
  const {title, difficulty, code} = req.body;
  const stmt = db.prepare('INSERT INTO problems (title, difficulty, code) VALUES (?, ?, ?);');
  const result = stmt.run(title, difficulty, code);
  res.json({id: result.lastInsertRowid, title, difficulty, code});
});

app.get('/', (req:express.Request, res:express.Response) => {
  res.sendFile('index.html', { root: __dirname + '/static' });
});
app.get('/problems', (req:express.Request, res:express.Response) => {
  const problems = db.query('SELECT * FROM problems;').all();
  res.json(problems);
});

app.get('/problems/:difficulty', (req:express.Request, res:express.Response) => {
  const difficulty = req.params.difficulty;
  if (typeof difficulty === 'undefined') {
    res.status(400).json({ error: 'Missing difficulty' });
    return;
  }
  const stmt = db.prepare('SELECT * FROM problems WHERE difficulty = ?;');
  const problems = stmt.all(difficulty);
  res.json(problems);
});

app.delete('/problems/:id', (req: express.Request, res: express.Response) => {
  const idParam = req.params.id;
  if (!idParam) {
    res.status(400).json({ deleted: false, error: 'Missing id' });
    return;
  }
  const idNum = Number(idParam);
  if (Number.isNaN(idNum)) {
    res.status(400).json({ deleted: false, error: 'Invalid id' });
    return;
  }
  try {
    const stmt = db.prepare('DELETE FROM problems WHERE id = ?;');
    const result = stmt.run(idNum);
    if (result && result.changes && result.changes > 0) {
      res.json({ deleted: true, id: idNum });
    } else {
      res.status(404).json({ deleted: false, error: 'Not found' });
    }
  } catch (err) {
    res.status(500).json({ deleted: false, error: String(err) });
  }
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});