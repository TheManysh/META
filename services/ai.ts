import { Pinecone } from '@pinecone-database/pinecone';
// import { Message, OpenAIStream, StreamData, StreamingTextResponse } from "ai";
import { GoogleGenerativeAI } from '@google/generative-ai';

export const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY ?? '',
});
export const google = new GoogleGenerativeAI(
  process.env.GOOGLE_API_KEY as string
);

export const generateEmbedding = async (content: string) => {
  const model = google.getGenerativeModel({ model: 'text-embedding-004' });
  const result = await model.embedContent(content);
  return result.embedding;
};
