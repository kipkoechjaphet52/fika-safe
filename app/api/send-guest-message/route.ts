import { sendEmail } from "@/app/lib/action";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req:Request){
    try{
        const {firstName, secondName, email, subject, message} = await req.json();
        if(!firstName || !secondName || !email || !subject || !message){
            return new Response(JSON.stringify({error:'All fields are required'}),{status:400});
        }

        const guest = await prisma.user.findFirst({
            where: {userRole: 'GUEST'},
        })
        if(!guest){
            return new Response(JSON.stringify({error:'Guest not found'}),{status:404});
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
        const guestName = `${firstName} ${secondName}`
        const text = `Hello ${admin.firstName} ${admin.secondName},
    
A new issue has been created by ${guestName}, userRole: ${guest.userRole}, 
Message Details:
------------------
"${message}"

Please review and take the necessary action. You can contact the guest at ${email}.

Best regards,  
Fika safe`
    
        await sendEmail(adminEmail, subject, text);
    
        // I want to create a new message in the database and send it to the guest, this message concatenates the guest name and email and the message
        const geustMessage = `Hello, I am ${guestName}, my email is ${email}.\n\n${message}\n\nBest regards,\nFika safe`;

        const newMessage = await prisma.userHelpMessage.create({
            data: {
            subject,
            message: geustMessage,
            user: {
                connect: {id: guest.id},
            }
            }
        })

        return new Response(JSON.stringify({message:'Message created and sent successfully', newMessage}),{status:201});
    }catch(error){
        console.error("Error: ",error);
        return new Response("Internal Server Error", { status: 500 });
    }
}