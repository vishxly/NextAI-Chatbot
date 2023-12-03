import { auth } from "@clerk/nextjs";
import { Metadata} from "next"
import prisma from "@/lib/db/prisma";
import Note from "@/components/ui/Note";


export const metadata: Metadata = {
    title: "NEXTAI - Notes",
};

export default async function NotePage() {
    const { userId} = auth();

    if(!userId) throw Error("userId undefined");

    const allNotes = await prisma.note.findMany({where: { userId }});

    return <div className="grid gap-3 sm:grid-col-2 lg:grid-cols-3">
        {
            allNotes.map((note) => (
                <Note note={note} key={note.id} />
             ))
        }
        {allNotes.length === 0 &&(
            <div className="col-span-full text-center">
                "You don't have any notes yet . Why don't you create one?"
            </div>
        )}
        </div>
}