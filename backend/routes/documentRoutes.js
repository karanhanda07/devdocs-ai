// Import Express so we can create a router
import express from 'express';

// Import our PostgreSQL connection
import pool from '../db.js';

import multer from 'multer';
import { PDFParse } from 'pdf-parse';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import storage from '../storage.js';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
// Create a router for document-related routes
const router = express.Router();

const upload = multer({
    storage: multer.memoryStorage(),
});

// Get all saved documents from PostgreSQL
router.get('/documents', async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT id, filename, original_name, created_at
       FROM documents
       ORDER BY created_at DESC`
        );

        res.json(result.rows);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: 'Could not load documents',
        });
    }
});

router.post('/upload', upload.single('file'), async (req, res) => {

    try {
        // This protects the original upload buffer for cloud storage.
        const pdfBufferForParsing = Buffer.from(req.file.buffer);
        // Read the uploaded PDF from memory

        const parser = new PDFParse({
            data: pdfBufferForParsing,

        });
        // Extract text from the PDF
        const result = await parser.getText();
        // Clean up the PDF parser
        await parser.destroy();

        //Create a unique name for the PDF in the cloud storage
        const storageKey = `${Date.now()}-${req.file.originalname}`;

        //prepare the PDF upload for Backblaze B2
        const uploadCommand = new PutObjectCommand({
            Bucket: process.env.B2_BUCKET,
            Key: storageKey,
            Body: req.file.buffer,
            ContentType: req.file.mimetype,
            ContentLength: req.file.size,
        });

        await storage.send(uploadCommand);

        // Save the uploaded document into PostgreSQL
        const savedDocument = await pool.query(
            // Insert values into the documents table
            `INSERT INTO documents(filename, original_name, extracted_text)
    VALUES ($1, $2, $3)
    RETURNING *`,
            // These values replace $1, $2, and $3
            [
                storageKey,
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

// Create a temp secure URL for one document
router.get('/documents/:id/url', async (req, res) => {
    try {
        // Find the document using the ID from the URL
        const result = await pool.query(
            `SELECT id, filename, original_name
            FROM documents 
            WHERE id = $1`,
            [req.params.id]
        );
        //if that document does not exist
        if (result.rows.length === 0) {
            return res.status(404).json({
                message: 'Document not found',
            });
        }
        // get the document we found
        const document = result.rows[0];
        // Tell B2 which private file we want to access
        const command = new GetObjectCommand({
            Bucket: process.env.B2_BUCKET,
            // filename contains our B2 storage key
            Key: document.filename,
        });
        // Create a temporary secure URL
        const url = await getSignedUrl(storage, command, {
            //link works for 5 minutes
            expiresIn: 300,
        });
        // send the temporary URL back
        res.json({
            url: url,
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: 'Could not open document',
        });
    }
});

router.get("/documents/:id/download", async (req, res) => {
    try {
        //Find this document in PostgreSQL using its ID
        const result = await pool.query(
            `SELECT id, filename, original_name
            FROM documents
            WHERE id = $1`,
            [req.params.id]
        );
        // Stop if the document does not exist
        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Document not found",
            });
        }
        // Get the saved document
        const document = result.rows[0];

        // tell B2 which private file we want
        const command = new GetObjectCommand({
            Bucket: process.env.B2_BUCKET,
            Key: document.filename,

            // Force browser to download the file
            ResponseContentDisposition: `attachment; filename="${document.original_name}"`,
        });
        const url = await getSignedUrl(storage, command, {
            expiresIn: 300,
        });
        // Send the temporary download URL to React
        res.json({
            url: url,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Could not download document'
        });
    }
});




// Export this router so index.js can use it
export default router;