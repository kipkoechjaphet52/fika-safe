import { authOptions } from "@/app/utils/authOptions";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";

const prisma = new PrismaClient();

export async function PUT(req: Request){
    try{
        const session = await getServerSession(authOptions);
        const email = session?.user?.email;
        if(!email){
            return new Response(JSON.stringify({message: "Unauthorized"}), {status:401});
        }

        const staff = await prisma.staff.findUnique({
            where: { email },
            select: { id: true },
        });
        if(!staff){
            return new Response(JSON.stringify({message: "Staff not found"}), {status:404})
        }
        const staffId = staff.id;

        const {reportId, confirmation} = await req.json();

        if(confirmation !== 'VERIFY INCIDENT'){
            return new Response(JSON.stringify({message: "Please confirm verification by typing VERIFY INCIDENT"}),{status:400})
        }
        if(!reportId || !confirmation){
            return new Response(JSON.stringify({message: "All fields are required"}),{status:400})
        }
        
        const incidentReport = await prisma.report.findUnique({
            where: { id: reportId },
        })
        if(!incidentReport){
            return new Response(JSON.stringify({message: "Report not found"}), {status: 404})
        }

        const verifiedReport = await prisma.report.update({
            where: {id: reportId},
            data: {
                verificationStatus: 'VERIFIED',
                verifier: {
                    connect: {id: staffId},
                }
            }
        })

        return new Response(JSON.stringify({message: "Report verified successfully", verifiedReport}), {status:200});
    }catch(error){
        console.error("Error verifying incident: ", error);
        return new Response(JSON.stringify({message: "Unexpected error"}), {status:500});
    }
}