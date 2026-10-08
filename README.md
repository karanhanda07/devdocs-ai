# DevDocs AI

DevDocs AI is a full-stack application that allows users to upload PDF documents, store them securely, and view or download them later.

The project will also include AI-powered document question answering using RAG.

## Tech Stack

### Frontend
- React
- JavaScript
- Vite
- CSS

### Backend
- Node.js
- Express.js
- PostgreSQL

### Storage
- Backblaze B2
- AWS SDK for JavaScript

## Current Features

- Upload PDF documents
- Extract text from uploaded PDFs
- Save document information and extracted text in PostgreSQL
- Store PDF files in Backblaze B2
- View saved documents
- Open uploaded PDFs
- Download uploaded PDFs
- Environment-variable configuration

## Project Structure

```text
devdocs-ai/
├── backend/
│   ├── routes/
│   │   └── documentRoutes.js
│   ├── db.js
│   ├── storage.js
│   ├── schema.sql
│   └── index.js
│
├── frontend/
│   └── src/
│       ├── components/
│       │   ├── DocumentList.jsx
│       │   └── UploadDocument.jsx
│       └── App.jsx
│
└── README.md
```

## Planned AI Features

- Split document text into smaller chunks
- Generate embeddings
- Store and search vectors
- Retrieve relevant document content
- Answer questions using RAG

## Status

Currently under development.