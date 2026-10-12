//  Load variables from backend/.env
import "dotenv/config";

//  Import our embedding function
import { createEmbedding } from "./embeddings.js";

//  Simple test text
const embedding = await createEmbedding("React is a frontend library");

//  Check how many numbers came back
console.log("Embedding length:", embedding.length);