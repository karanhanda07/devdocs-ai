import express from 'express';
import cors from 'cors';
import pool from './db.js';
import documentRoutes from './routes/documentRoutes.js';

const app = express();
app.use(cors());
app.use(express.json());
app.use(documentRoutes);



app.get('/', async (req, res) => {

    const result = await pool.query('SELECT NOW()');

    res.json({ message: 'DevDocs AI backend is running!', databaseTime: result.rows[0].now, });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});