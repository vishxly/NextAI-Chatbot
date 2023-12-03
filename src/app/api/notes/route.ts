import {
  createNoteSchema,
  deleteNoteSchema,
  updateNoteSchema,
} from "@/lib/validation/note";
import { auth } from "@clerk/nextjs";
import prisma from "@/lib/db/prisma";
import { getEmbedding } from "@/lib/openai";
import { notesIndex } from "@/lib/db/pinecone";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parseResult = createNoteSchema.safeParse(body);

    if (!parseResult.success) {
      console.log(parseResult.error);
      return Response.json({ error: "Invalid input" }, { status: 400 });
    }

    const { title, content } = parseResult.data;

    // Invoke the auth function to get user information
    const { userId } = await auth();

    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const embedding = await getEmbeddingForNote(title, content);

    const note = await prisma.$transaction(async (tx) => {
      const createdNote = await tx.note.create({
        data: {
          title,
          content,
          userId,
        },
      });
      const embeddingValues: number[] = embedding.split(",").map(Number);

      await tx.notesIndex.upsert([
        {
          id: createdNote.id,
          values: embedding,
          // values: embeddingValues,
          metadata: { userId },
        },
      ]);

      // return note;
      return createdNote;
    });

    // const note = await prisma.note.create({
    //   data: {
    //     title,
    //     content,
    //     userId,
    //   },
    // });

    return Response.json({ note }, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const parseResult = updateNoteSchema.safeParse(body);

    if (!parseResult.success) {
      console.log(parseResult.error);
      return Response.json({ error: "Invalid input" }, { status: 400 });
    }

    const { id, title, content } = parseResult.data;

    const note = await prisma.note.findUnique({ where: { id } });

    if (!note) {
      return Response.json({ error: "Note not found" }, { status: 404 });
    }

    // Invoke the auth function to get user information
    const { userId } = await auth();

    if (!userId || userId != note.userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const embedding = await getEmbeddingForNote(title, content);
    const embeddingValues: number[] = embedding.split(',').map(Number);

    const updatedNote = await prisma.$transaction(async (tx) => {
      const updatedNote = await tx.note.update({
        where: { id },
        data: {
          title,
          content,
        },
      });

      await tx.notesIndex.upsert([
        {
          id: id,
          values: embedding,
          // values: embeddingValues,
          metadata: { userId },
        },
      ]);

      return updatedNote;
    });

    // const updateNote = await prisma.note.update({
    //   where: { id },
    //   data: {
    //     title,
    //     content,
    //   },
    // });

    
    return Response.json({ updatedNote }, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const parseResult = deleteNoteSchema.safeParse(body);

    if (!parseResult.success) {
      console.log(parseResult.error);
      return Response.json({ error: "Invalid input" }, { status: 400 });
    }

    const { id } = parseResult.data;

    const note = await prisma.note.findUnique({ where: { id } });

    if (!note) {
      return Response.json({ error: "Note not found" }, { status: 404 });
    }

    // Invoke the auth function to get user information
    const { userId } = await auth();

    if (!userId || userId != note.userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    await prisma.$transaction(async (tx) => {
      await tx.note.delete({ where: { id } });
      await tx.notesIndex.upsert({
        id,
        values: [],
        metadata: { userId },
      });
    });


    // await prisma.note.delete({ where: { id } });

    return Response.json({ message: "Note deleted" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

// async function getEmbeddingForNote(title: string, content: string | undefined) {
//   return getEmbedding(title + "\n\n" + content ?? "");
// }

async function getEmbeddingForNote(title: string, content: string | undefined) {
  console.log("Before getEmbeddingForNote", title, content);

  // Replace this with a simple synchronous function or a hardcoded value
  const embedding = "test_embedding";

  console.log("After getEmbeddingForNote", embedding);
  return embedding;
}
