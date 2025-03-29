import {authOptions} from "@/app/utils/authOptions";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";

const prisma = new PrismaClient();

export async function DELETE(req: Request){
    try{
        const {reportId, confirmation} = await req.json();
        if(confirmation !== 'DELETE INCIDENT'){
            return new Response(JSON.stringify({ error: 'Please confirm deletion by typing DELETE INCIDENT' }), { status: 400 });
        }
        if(!reportId || !confirmation){
            return new Response(JSON.stringify({message: "Fill in all the fields"}), {status: 400});
        }

        const session = await getServerSession(authOptions);
        const email = session?.user?.email;
        if(!email){
            return new Response(JSON.stringify({message: "Unauthorized"}), {status: 401});
        }
        
        const user = await prisma.user.findUnique({
            where: {email: email!},
            select: {id: true},
        });
        if(!user){
            return new Response(JSON.stringify({message: "User not found"}), {status: 401})
        }
        const userId = user?.id;

        const incidentReport = await prisma.report.findUnique({
            where: {
                id: reportId,
            }
        })

        if(!incidentReport){
            return new Response(JSON.stringify({message: "Report not found"}), {status: 404})
        }

        await prisma.report.delete({
            where:{
              id: reportId,
              userId: userId,
            }
        })

        return new Response(JSON.stringify({message: "Incident deleted successfully"}), {status: 200});
    }catch(error){
        console.error("Error deleting incident: ", error);
        return new Response(JSON.stringify({message: "Error deleting incident"},), {status: 500});
    }
}