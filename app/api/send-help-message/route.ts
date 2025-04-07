import { sendEmail } from "@/app/lib/action";
import { authOptions } from "@/app/utils/authOptions";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";

const prisma = new PrismaClient();

export async function POST(req:Request){
    try{
        const {subject, message} = await req.json();
        if(!subject || !message){
            return new Response(JSON.stringify({error:'All fields are required'}),{status:400});
        }

        const session = await getServerSession(authOptions);
        const email = session?.user?.email;
        if(!email){
            return new Response(JSON.stringify({error:'Unauthorized'}),{status:401});
        }
    
        const staff = await prisma.staff.findUnique({
            where:{email},
        });
        if(!staff){
            return new Response(JSON.stringify({error:'Staff not found'}),{status:404});
        }
    
        const admin = await prisma.staff.findFirst({
            where: {userRole: 'ADMIN'},
            select: {
            email:true,
            firstName: true,
            secondName: true,
            }
        });
        if(!admin){
            return new Response(JSON.stringify({error:'Admin not found'}),{status:404});
        }
    
        const adminEmail = admin?.email;
        const name = `${staff.firstName} ${staff.secondName}`
        const text = `Hello ${admin.firstName} ${admin.secondName},
    
A new issue has been created by ${name}, staffRole: ${staff.userRole}, 
Message Details:
------------------
"${message}"

Please review and take the necessary action.

Best regards,  
Fika safe`
    
        await sendEmail(adminEmail, subject, text);
    
        const newMessage = await prisma.helpMessage.create({
            data: {
            subject,
            message,
            staff: {
                connect: {id: staff.id},
            }
            }
        })

        return new Response(JSON.stringify({message:'Message created and sent successfully', newMessage}),{status:201});
    }catch(error){
        console.error("Error: ",error);
        return new Response("Internal Server Error", { status: 500 });
    }
}