// import { PrismaClient } from '@prisma/client'

// const prismaClientSingleton = () => {
//   return new PrismaClient()
// }

// declare global {
//   var prisma: undefined | ReturnType<typeof prismaClientSingleton>
// }

// const prisma = globalThis.prisma ?? prismaClientSingleton()

// export default prisma

// if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma






// prisma.ts

import { PrismaClient } from '@prisma/client';

// Define a type for PineconeIndex
type PineconeIndex = {
  upsert: (data: any[]) => Promise<void>; // Adjust the type based on Pinecone's requirements
  // Add other methods if needed
};

interface CustomPrismaClient extends PrismaClient {
  notesIndex: PineconeIndex;
}

const prisma: CustomPrismaClient = new PrismaClient() as CustomPrismaClient;

// Initialize notesIndex with a dummy implementation (replace it with the actual Pinecone initialization)
prisma.notesIndex = {
  upsert: async (data: any[]) => {
  console.log('Upserting data:', data);
    // Implement the actual upsert logic based on Pinecone's requirements
  },
  // Add other methods if needed
};

export default prisma;






// // prisma.ts
// import { PrismaClient } from '@prisma/client';
// import { notesIndex as pineconeNotesIndex } from './pinecone';  // Adjust the import path based on your directory structure

// const prismaClientSingleton = () => {
//   return new PrismaClient();
// };

// declare global {
//   var prisma: ReturnType<typeof prismaClientSingleton>;
//   var notesIndex: typeof pineconeNotesIndex;
// }

// const prisma = globalThis.prisma ?? prismaClientSingleton();
// const notesIndex = globalThis.notesIndex ?? pineconeNotesIndex;

// if (process.env.NODE_ENV !== 'production') {
//   globalThis.prisma = prisma;
//   globalThis.notesIndex = notesIndex;
// }

// export { prisma, notesIndex };
