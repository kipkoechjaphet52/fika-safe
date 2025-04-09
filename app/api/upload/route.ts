import cloudinary from "@/app/config/cloudinary";

export const runtime = 'nodejs'; // Use Node.js runtime for file uploads instead of Edge runtime. Edge runtime does not fully support things like req.formData(), Buffer, or stream which you need for file uploads.

export async function POST (req: Request){
    try{
        const formData = await req.formData();
        const file = formData.get('file') as File | null;
        
        if(!file){
            return new Response(JSON.stringify({ message: 'File is required' }), { status: 400 });
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
