import {authOptions} from "@/app/utils/authOptions";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export async function PUT(req:Request){
    try{
        const session = await getServerSession(authOptions);
        if(!session || !session.user?.email){
            throw new Response(JSON.stringify({message: "User not authenticated"}), {status: 401});
        }
        const email = session?.user?.email;

        const {newPassword, currentPassword} = await req.json();
        if(!newPassword || !currentPassword){
            return new Response(JSON.stringify({message: 'Please fill all fields'}), {status: 400});
        }
        
        const user = await prisma.user.findUnique({
            where: {email},
            select: {id: true, password: true},
        });

        const staff = await prisma.staff.findUnique({
            where: {email},
            select: {id: true, password: true},
        });
        if(!user && !staff){
            return new Response(JSON.stringify({message: "User not found"}), {status: 404});
        }

        if(user){
            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if(!isMatch){
                return new Response(JSON.stringify({ message: "Current password is incorrect" }), { status: 400 });
            }
        } else if(staff){
            const isMatch = await bcrypt.compare(currentPassword, staff.password);
            if(!isMatch){
                return new Response(JSON.stringify({ message: "Current password is incorrect" }), { status: 400 });
            }
        }
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        
        if(user){
            await prisma.user.update({
                where: {email},
                data: {password: hashedNewPassword},
            });
        } else if(staff){
            await prisma.staff.update({
                where: {email},
                data: {password: hashedNewPassword},
            });
        }

        return new Response(JSON.stringify({ message: "Password updated successfully" }), { status: 200 });
    }catch(error){
        console.error("Error updating password: ", error);
        throw new Response(JSON.stringify({message: "Could not update password"}), {status: 500});
    }
}