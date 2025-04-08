import React from 'react'
import Media from '@/public/images/world.jpg'
import Image from 'next/image'

type Props = {
    params: {
      id: string;
    };
  };
  export default async function Page({ params }: { params: Promise<{ id: string }> }){
  const {id} = await params;

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6 space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold text-primary">Two People Shot Dead</h1>
        <p className="text-muted-foreground">Lurambi, Kakamega, Kenya</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 h-80 overflow-hidden">
          <Image
            src={Media}
            alt="incident image"
            className="object-cover w-full h-full"
            width={800}
            height={500}
          />
        </div>
        <div className="w-full md:w-40 h-20 rounded-sm overflow-hidden">
          <Image
            src={Media}
            alt="incident thumbnail"
            className="object-cover w-full h-full"
            width={200}
            height={200}
          />
        </div>
      </div>

      <div className="space-y-2 text-sm md:text-base text-muted-foreground">
        <p><span className="font-medium text-foreground">Time:</span> 8:06 PM, 20/02/2025</p>
        <p><span className="font-medium text-foreground">Verification Status:</span> <span className="text-green-500 font-semibold">Verified</span></p>
        <p><span className="font-medium text-foreground">Incident Type:</span> Assault</p>
        <p><span className="font-medium text-foreground">Severity Level:</span> <span className="text-red-500 font-semibold">Critical</span></p>
      </div>

      <div className="prose dark:prose-invert max-w-none">
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Necessitatibus tenetur fuga modi tempore atque, blanditiis architecto incidunt ducimus culpa dolorum sit reiciendis odit fugit sint nobis sed unde deleniti aut!</p>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Necessitatibus tenetur fuga modi tempore atque, blanditiis architecto incidunt ducimus culpa dolorum sit reiciendis odit fugit sint nobis sed unde deleniti aut!</p>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Necessitatibus tenetur fuga modi tempore atque, blanditiis architecto incidunt ducimus culpa dolorum sit reiciendis odit fugit sint nobis sed unde deleniti aut!</p>
      </div>
    </div>
  )
}
