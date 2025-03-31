import { createAlertForIncident, sendEmailToUser } from '@/app/lib/action';
import {authOptions} from '@/app/utils/authOptions';
import {PrismaClient} from '@prisma/client';
import { getServerSession } from 'next-auth';

const prisma = new PrismaClient();

export async function POST(req:Request){
    if(req.method !== 'POST'){
        return new Response(JSON.stringify(JSON.stringify({message: 'Method not allowed'})), {status: 405});
    }
    try{
        const session = await getServerSession(authOptions);
        const email = session?.user?.email;
        if(!email){
            return new Response(JSON.stringify({message: 'Unauthorized'}), {status: 401});
        }

        const user = await prisma.user.findUnique({
            where: {email},
            select: {id: true},
        });
        const userId = user?.id;

        const {title, location, latitude, longitude, description, type, severity, mediaUrl, mediaType} = await req.json();

        if(!title || !location || !latitude || !longitude || !description || !type || !severity || !mediaUrl || !mediaType){
            return new Response(JSON.stringify({message: 'Please fill all fields'}), {status: 400});
        }

        const newReport = await prisma.report.create({
            data: {
                title,
                location,
                latitude,
                longitude,
                description,
                type,
                severity,
                mediaUrl,
                mediaType,
                user: {connect: {id: userId}},
            },
        },);

        if(newReport){
            await createAlertForIncident(newReport.id);
            await sendEmailToUser();
        }

        return new Response(JSON.stringify(
            JSON.stringify({
                message: 'Report created successfully',
                report: {
                    id: newReport.id,
                    title: newReport.title,
                    location: newReport.location,
                    latitude: newReport.latitude,
                    longitude: newReport.longitude,
                    description: newReport.description,
                    type: newReport.type,
                    severity: newReport.severity,
                    mediaUrl: newReport.mediaUrl,
                    mediaType: newReport.mediaType,
                },
            }),
        ),
        {status: 201},
        );
    }catch(error){
        console.log("Error creating post: ", error);
        return new Response(JSON.stringify(JSON.stringify({message: 'Internal server error'})), {status: 500});
    }
}