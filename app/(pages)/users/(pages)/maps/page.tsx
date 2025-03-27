'use client'
import {Button} from '@/app/Components/ui/button';
import CrimeMap from '@/app/Components/Crime';
import { IncidentReport } from '@/app/Components/users/incident-report';
import clsx from 'clsx';
import React, { useEffect, useState } from 'react'
import { XIcon } from 'lucide-react';
import { IncidentType, MediaType, SeverityLevel, VerificationStatus } from '@prisma/client';
import { fetchLiveIncidents } from '@/app/lib/action';
import toast from 'react-hot-toast';

interface Report {
  id: string;
  createdAt: Date;
  userId: string;
  location: string;
  latitude: number;
  longitude: number;
  type: IncidentType;
  severity: SeverityLevel;
  description: string;
  mediaUrl: string | null;
  mediaType: MediaType;
  verificationStatus: VerificationStatus;
  verifierId: string | null;
  updatedAt: Date;
}
export default function MapsPage() {
  const [openForm, setOpenForm] = useState(false);
  const [liveReports, setLiveReports] = useState<Report[]>([]);
  const [hoveredIncidentId, setHoveredIncidentId] = useState<string | null>(null);

  const toggleForm = () => {
    setOpenForm((prev) => !prev);
  };
  
  useEffect(() => {
    const handleReports = async () => {
      try{
        const results = await fetchLiveIncidents();
        
        setLiveReports(results);
      }catch(error){
        toast.error("Error fetching reports");
        console.error("Error fetching reports: ", error);
      }
    };
    handleReports();
  },[])
  return (
    <div className='w-[100vw] h-screen items-center flex overflow-hidden'>
      <div className={clsx(openForm ? 'w-4/5' : 'w-full', 'duration-300 transition-all')}>
        <CrimeMap incidents={liveReports} hoveredIncidentId={hoveredIncidentId} setHoveredIncidentId={setHoveredIncidentId}/>
        <div className='absolute top-20 right-4'>
          <Button onClick={toggleForm} >
            {openForm ? 
            <XIcon className='w-[1.2rem] h-[1.2rem]'/> : 'Open Form'}
          </Button>
        </div>
      </div>
      <div className={clsx(`w-1/5 h-full mx-5 mt-5`, !openForm && 'hidden w-0')}>
        {/* <IncidentReport /> */}
      </div>
    </div>
  );
}
