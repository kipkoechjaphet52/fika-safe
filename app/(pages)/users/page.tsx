import CrimeMap from '@/app/Components/Crime';
import { IncidentReport } from '@/app/Components/incident-report';
import React from 'react'

export default function UserPage() {
  return (
    <div className='w-screen h-screen items-center justify-center'>
      <CrimeMap />
      <div className='absolute right-5 top-24'>
        <IncidentReport />
      </div>
    </div>
  );
}
