import { notesIndex } from "@/lib/db/pinecone";
import prisma from "@/lib/db/prisma";
import openai, { getEmbedding } from "@/lib/openai";
import { auth } from "@clerk/nextjs";
import { ChatCompletionMessage } from "openai/resources/index.mjs";
import { OpenAIStream, StreamingTextResponse } from "ai";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const messages: ChatCompletionMessage[] = body.messages;

    // Ensure messages are received
    if (!messages || messages.length === 0) {
      return Response.json({ error: "No messages provided" }, { status: 400 });
    }

    const messageTruncated = messages.slice(-6);

    // Get user ID
    const { userId } = await auth();

    // Ensure userId is available
    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get embedding
    const embedding = await getEmbedding(
      messageTruncated.map((message) => message.content).join("\n"),
    );

    // Query notesIndex
    const vectorQueryResponse = await notesIndex.query({
      vector: embedding,
      topK: 4,
      filter: { userId },
    });

    // Log vector query response
    console.log("Vector query response:", vectorQueryResponse);

    // Retrieve relevant notes from Prisma
    const relevantNotes = await prisma.note.findMany({
      where: {
        id: {
          in: vectorQueryResponse.matches.map((match) => match.id),
        },
      },
    });

    // Log relevant notes
    console.log("Relevant notes found:", relevantNotes);

    // Prepare system message
    const notesContent = relevantNotes
      .map((note) => `Title: ${note.title}\n\ncontent:\n${note.content}`)
      .join("\n\n");

    const systemMessage: ChatCompletionMessage = {
      role: "user",
      content: `You are an intelligent note-taking app. You answer the user's question based on their existing notes. The relevant notes for this query are:\n${notesContent}`,
    };

    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      stream: true,
      messages: [systemMessage, ...messageTruncated],
    });

    // Log OpenAI API response
    console.log("OpenAI API response:", response);

    // Return streaming response
    const stream = OpenAIStream(response);
    return new StreamingTextResponse(stream);
  } catch (error) {
    // Log and return error response
    console.error("Error in POST:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
