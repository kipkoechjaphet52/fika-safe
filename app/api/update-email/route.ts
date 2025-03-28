import {authOptions} from "@/app/utils/authOptions";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";

const prisma = new PrismaClient();

export async function PUT(req: Request){
    try{
        const session = await getServerSession(authOptions);
        if(!session || !session.user?.email){
            throw new Response(JSON.stringify({message: "User not authenticated"}), {status: 401});
        }
        const email = session?.user?.email;
        
        const {newEmail} = await req.json();
        if(!newEmail){
            return new Response(JSON.stringify({message: 'Please provide new email'}), {status: 400});
        }
        
        const user = await prisma.user.findUnique({
            where: {email},
            select: {id: true},
        });
        if (!user) {
            return new Response(JSON.stringify({ message: "User not found" }), { status: 404 });
        }
        const userId = user?.id;
    
        const updatedUser = await prisma.user.update({
            where: {id: userId},
            data: {email: newEmail},
        });
    
        return new Response(JSON.stringify({
            message: 'Email updated successfully',
            updatedUser,
        },),
        {status: 200}
        );
      }catch(error){
        console.error("Error changing email: ", error);
        return new Response(JSON.stringify({ message: "Could not change email", error: (error as Error).message }), { status: 500 });
    }
}