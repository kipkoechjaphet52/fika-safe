import CrimeMap from '@/app/Components/Crime';
import { IncidentReport } from '@/app/Components/incident-report';
import React from 'react'

export default function UserPage() {
  return (
    <div className='w-[100vw] h-screen items-center flex overflow-hidden'>
      <div className='w-3/5'>
        <CrimeMap />
      </div>
      <div className='w-1/5 h-full ml-5 mt-5'>
        <IncidentReport />
      </div>
    </div>
  );
}
