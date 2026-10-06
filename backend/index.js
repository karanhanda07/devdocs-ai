import express from 'express';
import cors from 'cors';
import pool from './db.js';
import multer from 'multer';
import { PDFParse } from 'pdf-parse';


const app = express();
app.use(cors());
app.use(express.json());

//Keep uploaded PDF temporarily in memory
const upload = multer({
    storage: multer.memoryStorage(),
});

app.get('/', async (req, res) => {

    const result = await pool.query('SELECT NOW()');

    res.json({ message: 'DevDocs AI backend is running!', databaseTime: result.rows[0].now, });
});

app.post('/upload', upload.single('file'), async (req, res) => {
    try {
        // Read the uploaded PDF from memory
        const parser = new PDFParse({
            data: req.file.buffer,

        });
        // Extract text from the PDF
        const result = await parser.getText();
        // Clean up the PDF parser
        await parser.destroy();
        // Save the uploaded document into PostgreSQL
        const savedDocument = await pool.query(
            // Insert values into the documents table
            `INSERT INTO documents(filename, original_name, extracted_text)
    VALUES ($1, $2, $3)
    RETURNING *`,
            // These values replace $1, $2, and $3
            [
                req.file.originalname,
                req.file.originalname,
                result.text,
            ]
        );
        // Send the saved database row back to React
        res.json({
            message: 'PDF uploaded and saved successfully',
            document: savedDocument.rows[0],
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Could not upload PDF',
        });
    }
});

// Get all saved documents from PostgreSQL
app.get("/documents", async (req, res) => {
    try {
        // Ask PostgreSQL for saved documents
        const result = await pool.query(
            `SELECT id, filename, original_name, created_at
        FROM documents
        ORDER BY created_at DESC`
        );
        // Send the rows back to React as JSON
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Could not load documents",
        });
    }
});
app.listen(5000, () => {
    console.log('Server running on port 5000');
})