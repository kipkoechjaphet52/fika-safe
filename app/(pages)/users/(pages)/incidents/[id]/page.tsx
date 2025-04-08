import React from 'react'
import Media from '@/public/images/world.jpg'
import Image from 'next/image'
import { fetchSingleIncident } from '@/app/lib/action'

export default async function Page({ params }: { params: Promise<{ id: string }> }){
  const {id} = await params;

  const report = await fetchSingleIncident(id);
  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6 space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold text-primary">{report?.title}</h1>
        <p className="text-muted-foreground">{report?.location}</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 h-80 overflow-hidden">
          {report?.mediaType === 'VIDEO' ? 
          (
            <video controls className="w-full h-full object-cover" >
              <source src={report.mediaUrl || ''} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          ) : (
            <Image
              src={report?.mediaUrl || Media}
              alt="incident image"
              className="object-cover w-full h-full"
              width={800}
              height={500}
            />
          )}
        </div>
        <div className="w-full md:w-40 h-20 rounded-sm overflow-hidden">
        {report?.mediaType === 'VIDEO' ? 
          (
            <video controls className="w-full h-full object-cover"loop muted>
              <source src={report.mediaUrl || ''} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          ) : (
            <Image
              src={report?.mediaUrl || Media}
              alt="incident thumbnail"
              className="object-cover w-full h-full"
              width={200}
              height={200}
            />
          )}
        </div>
      </div>

      <div className="space-y-2 text-sm md:text-base text-muted-foreground">
        <p><span className="font-medium text-foreground">Time:</span> {report?.createdAt.toLocaleDateString()}</p>
        <p><span className="font-medium text-foreground">Verification Status:</span> <span className="text-green-500 font-semibold">{report?.verificationStatus}</span></p>
        <p><span className="font-medium text-foreground">Incident Type:</span> {report?.type}</p>
        <p><span className="font-medium text-foreground">Severity Level:</span> <span className="text-red-500 font-semibold">{report?.severity}</span></p>
      </div>

      <div className="prose dark:prose-invert max-w-none">
        <p>{report?.description}</p>
      </div>
    </div>
  )
}
