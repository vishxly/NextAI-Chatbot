import {Pinecone} from "@pinecone-database/pinecone"

const apiKey = process.env.PINECONE_API_KEY;

if(!apiKey) {
    throw Error("PINECONE_API_KEY is not set")
}

const pinecone = new Pinecone({
    environment: "gcp-starter",
    apiKey,
})

export const notesIndex = pinecone.Index("nextjs-ai")



// // pinecone.ts
// import { Pinecone } from "@pinecone-database/pinecone";
// import dotenv from "dotenv";

// // Load environment variables from .env file
// dotenv.config();

// const apiKey = process.env.PINECONE_API_KEY;
// if (!apiKey) {
//   throw new Error("PINECONE_API_KEY is not set");
// }

// const environment = "gcp-starter"; // Replace with your environment name
// const indexName = "nextjs-ai";    // Replace with your index name

// const pinecone = new Pinecone({
//   environment,
//   apiKey,
// });

// const notesIndex = pinecone.Index(indexName);

// export { notesIndex };

