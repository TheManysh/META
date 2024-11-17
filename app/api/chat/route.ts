import { pinecone, google, generateEmbedding } from '@/services/ai';
import prompt from '@/utils/constants';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { message, postId, userId } = await req.json();

  // Validate userId
  if (!userId) {
    return NextResponse.json({ error: 'userId is required' }, { status: 400 });
  }

  // Build filter based on postId and userId
  let filter: any = { userId: userId };

  if (postId) {
    filter = {
      $and: [{ userId: userId }, { postId: postId }],
    };
  }

  console.log('filter:', filter);

  // Get the last message
  console.log('message:', message);
  try {
    // Access Pinecone index
    const index = pinecone.Index(process.env.PINECONE_INDEX as string);

    // Generate embedding for the last message
    const embedding = await generateEmbedding(message);

    // Query Pinecone with filter
    const queryResults = await index.query({
      topK: 5,
      vector: embedding.values,
      filter: filter, // Apply filter
      includeMetadata: true,
    });

    console.log('queryResults:', queryResults);

    // Retrieve content from the query results
    let retrieved: string[] = [];
    queryResults.matches.forEach((match) => {
      const { metadata } = match;
      if (metadata?.content) {
        retrieved.push(metadata.content as string);
      }
    });

    console.log('retrieved:', retrieved);

    // Generate content with Google Gemini model
    const model = google.getGenerativeModel({
      model: 'models/gemini-1.5-flash-8b',
    });

    const prompt_message = prompt(retrieved, message);
    console.log(prompt_message);

    const res = await model.generateContent(prompt_message);

    return NextResponse.json(
      { messages: res.response.text(), retrieved: retrieved },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
