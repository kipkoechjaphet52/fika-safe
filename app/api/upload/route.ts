import { PrismaClient } from "@prisma/client";
import cloudinary from "@/app/config/cloudinary";

const prisma = new PrismaClient();

export async function POST (req: Request){
    if(req.method !== 'POST'){
        return new Response(JSON.stringify({message: 'Method not allowed'}), {status: 405});
    }
    try{
        const formData = await req.formData();
        const file = formData.get('file') as File | null;
        
        if(!file){
            return new Response(JSON.stringify(JSON.stringify({message: 'File is required'})), {status: 400});
        }

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Upload file to Cloudinary
        interface UploadResult {
            secure_url?: string;
        }

        const uploadResult: UploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
            { resource_type: 'auto', folder: 'uploads' },
            (error, result) => {
            if (error) reject(error);
            else resolve(result as UploadResult);
            }
        ).end(buffer);
        });

        if (uploadResult.secure_url) {
            return new Response(
                JSON.stringify({ message: 'File uploaded successfully', url: uploadResult.secure_url }),
                { status: 200 }
            );
        }
        // const uploadResults = await cloudinary.uploader.upload(file, {
        //     folder: 'uploads',}
        // );

    }catch(error){
        console.error("Error uploading File: ", error);
        return new Response(JSON.stringify({message: 'Internal server error'}), {status: 500});
    }
}