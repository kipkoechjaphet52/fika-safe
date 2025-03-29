import { authOptions } from "@/app/utils/authOptions";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";

const prisma = new PrismaClient();

export async function PUT(req: Request){
    try{
        const session = await getServerSession(authOptions);
        const email = session?.user?.email;
        if(!email){
            return new Response(JSON.stringify({error: "Unauthorized"}), {status: 401});
        }

        const user = await prisma.user.findUnique({
            where: {email},
            select: {id: true},
        });
        const userId = user?.id;

        const {id, title, location, description, type, severity, mediaUrl, mediaType} = await req.json();
        if(!id || !title || !location || !description || !type || !severity || !mediaUrl || !mediaType){
            return new Response(JSON.stringify({error: "Please fill all fields"}), {status: 400});
        }

        const updatedReport = await prisma.report.update({
            where: {
                id,
                userId,
            },
            data: {
                title,
                location,
                description,
                type,
                severity,
                mediaUrl,
                mediaType,
                updatedAt: new Date(),
            },
        });
        return new Response(JSON.stringify({message: "Incident updated successfully", updatedReport}), {status: 200});
    }catch(error){
        console.error("Error updating incident: ", error);
        throw new Response(JSON.stringify({error: "Could not update incident"}), {status: 500});
    }
}