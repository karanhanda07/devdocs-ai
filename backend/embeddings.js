// OpenAI SDK
import OpenAI from "openai";

//  Create OpenAI client
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

//  Convert text into an embedding vector
export async function createEmbedding(text) {
    const response = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: text,
    });

    return response.data[0].embedding;
}