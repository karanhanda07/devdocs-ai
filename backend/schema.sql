-- Create the documents table used by DevDocs AI

CREATE TABLE IF NOT EXISTS documents (
    id SERIAL PRIMARY KEY,
    filename VARCHAR(255) NOT NULL,
    original_name VARCHAR(255) NOT NULL,
    extracted_text TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

--Stores smaller pieces of text from each uploaded document
CREATE TABLE IF NOT EXISTS document_chunks (
  id SERIAL PRIMARY KEY,

  -- Which document this chunk belongs to
  document_id INTEGER NOT NULL REFERENCES documents(id) ON DELETE CASCADE,

  -- The position of the chunk: 0, 1, 2, 3...
  chunk_index INTEGER NOT NULL,

  -- The actual text inside this chunk
  chunk_text TEXT NOT NULL
);