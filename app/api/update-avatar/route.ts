import {authOptions} from "@/app/utils/authOptions";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";

const prisma = new PrismaClient();

export async function PUT(req: Request){
    try{
        const {url} = await req.json();
        if(!url){
            throw new Response(JSON.stringify({message:"Invalid request"}), {status: 400});
        }

        const session = await getServerSession(authOptions);
        if(!session || !session.user?.email){
            throw new Response(JSON.stringify({message:"User not authenticated"}), {status: 401});
        }
        const email = session?.user?.email;
    
        const user = await prisma.user.findUnique({
            where: {email},
        });

        const staff = await prisma.staff.findUnique({
            where: {email},
        });
        if(!user && !staff){
            return new Response(JSON.stringify({message:"User not found"}), {status: 404});
        }
        if(staff){
            await prisma.staff.update({
                where: {id: staff?.id},
                data: {profilePic: url},
            });
        } else if(user){  
            await prisma.user.update({
                where: {id: user?.id},
                data: {profilePic: url},
            });
        }

        return new Response(JSON.stringify({message:"User profile updated"}), {status: 200});
    }catch(error){
        console.error("Error updating user profile: ", error);
        throw new Response(JSON.stringify({message:"Could not update user profile"}), {status: 500});
    }
}