// OpenAI SDK
import OpenAI from "openai";

// Create OpenAI client
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Generate a clean answer from the user's question + retrieved chunks
export async function generateAnswer(question, context) {
    const response = await openai.responses.create({
        model: "gpt-6-luna",
        input: `
Use the document context to answer the user's question.

Rules:
- Answer the question directly.
- Use simple, natural English.
- Keep the answer concise unless more detail is needed.
- Do not dump raw document text.
- Do not give unrelated instructions.
- If the document does not contain the answer, say that clearly.

Question:
${question}

Document context:
${context}
`,
    });

    return response.output_text;
}