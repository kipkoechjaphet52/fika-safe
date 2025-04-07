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
import IncidentsHeatMap from '@/app/Components/users/HeatMap';

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
        <div className="w-full h-full">
          <CrimeMap incidents={liveReports} hoveredIncidentId={hoveredIncidentId} setHoveredIncidentId={setHoveredIncidentId}/>
        </div>
    </div>
  );
}
