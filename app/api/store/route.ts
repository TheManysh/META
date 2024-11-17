import { pinecone, generateEmbedding } from '@/services/ai';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { postId, content, userId } = await req.json();

  try {
    const index = pinecone.Index(process.env.PINECONE_INDEX as string);
    const embedding = generateEmbedding(content);

    await index.upsert([
      {
        id: postId,
        values: (await embedding).values,
        metadata: { postId, userId, content },
      },
    ]);
    return NextResponse.json(
      { message: 'Post stored successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error storing post:', error);

    return NextResponse.json(
      { message: 'Error storing post' },
      {
        status: 500,
      }
    );
  }
}
