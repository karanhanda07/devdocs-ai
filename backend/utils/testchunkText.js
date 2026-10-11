// NEW: Import our chunking function
import { chunkText } from './chunkText.js';

// NEW: Simple text for testing
const text = 'ABCDEFGHIJKL';

// NEW: Split into chunks of 5 characters
const chunks = chunkText(text, 5);

// NEW: Show the result
console.log(chunks);