# DevDocs AI

DevDocs AI is a full-stack AI document assistant that lets users upload PDF documents and ask questions about their content using Retrieval-Augmented Generation (RAG).

🌐 **Live Demo:** https://devdocspro.netlify.app

## Tech Stack

### Frontend
- React
- JavaScript
- Vite
- CSS
- React Router

### Backend
- Node.js
- Express.js
- PostgreSQL
- pgvector
- OpenAI API

### Storage
- Backblaze B2
- AWS SDK for JavaScript

### Testing & CI
- Vitest
- React Testing Library
- GitHub Actions

### Deployment
- Netlify — Frontend
- Render — Backend
- Neon — PostgreSQL
- Backblaze B2 — File Storage

## Current Features

- Upload PDF documents
- Extract text from uploaded PDFs
- Split extracted text into smaller chunks
- Generate vector embeddings
- Store embeddings using PostgreSQL and pgvector
- Ask questions across all uploaded documents
- Ask questions about one selected document
- Retrieve the most relevant document chunks using vector similarity search
- Generate answers using Retrieval-Augmented Generation (RAG)
- Store PDF files in Backblaze B2
- View saved documents
- Open uploaded PDFs
- Download uploaded PDFs
- Permanently delete documents and their stored file versions

## How It Works

1. A user uploads a PDF.
2. The backend extracts the text from the PDF.
3. The text is split into smaller chunks.
4. OpenAI generates an embedding for each chunk.
5. The chunks and embeddings are stored in PostgreSQL using pgvector.
6. When the user asks a question, an embedding is generated for the question.
7. pgvector compares the question embedding with the stored document embeddings.
8. The most relevant document chunks are retrieved.
9. Those chunks are provided to the AI model as context.
10. The AI generates an answer based on the retrieved document content.

## Architecture

```text
User
  ↓
React + Vite
(Netlify)
  ↓
Node.js + Express API
(Render)
  ↓
 ┌─────────────────────┬──────────────────────┐
 ↓                     ↓                      ↓
Neon PostgreSQL    Backblaze B2          OpenAI API
+ pgvector         PDF Storage           Embeddings + Answers
```

## Project Structure

```text
devdocs-ai/
├── .github/
│   └── workflows/
│       └── ci.yml
│
├── backend/
│   ├── routes/
│   │   └── documentRoutes.js
│   ├── utils/
│   │   ├── chunkText.js
│   │   └── chunkText.test.js
│   ├── answer.js
│   ├── db.js
│   ├── embeddings.js
│   ├── storage.js
│   ├── schema.sql
│   └── index.js
│
├── frontend/
│   ├── public/
│   │   └── _redirects
│   └── src/
│       ├── components/
│       │   ├── DocumentList.jsx
│       │   ├── UploadDocument.jsx
│       │   └── UploadDocument.test.jsx
│       ├── pages/
│       │   └── DocumentsPage.jsx
│       ├── App.jsx
│       ├── App.css
│       └── main.jsx
│
└── README.md
```

## Testing

The project includes automated frontend and backend tests using Vitest.

GitHub Actions automatically runs:

- Backend tests
- Frontend tests
- Frontend production build

on pushes and pull requests.

## Deployment

The application is deployed using:

- **Frontend:** Netlify
- **Backend:** Render
- **Database:** Neon PostgreSQL
- **File Storage:** Backblaze B2
- **CI:** GitHub Actions

## Status

✅ Deployed and working.

🌐 **Live Application:** https://devdocspro.netlify.app