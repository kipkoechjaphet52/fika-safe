'use client'
import {Button} from '@/app/Components/ui/button';
import CrimeMap from '@/app/Components/Crime';
import { IncidentReport } from '@/app/Components/users/incident-report';
import clsx from 'clsx';
import React, { useState } from 'react'
import { XIcon } from 'lucide-react';

export default function MapsPage() {
  const [openForm, setOpenForm] = useState(false);

  const toggleForm = () => {
    setOpenForm((prev) => !prev);
  };
  return (
    <div className='w-[100vw] h-screen items-center flex overflow-hidden'>
      <div className={clsx(openForm ? 'w-4/5' : 'w-full', 'duration-300 transition-all')}>
        <CrimeMap />
        <div className='absolute top-20 right-4'>
          <Button onClick={toggleForm} >
            {openForm ? 
            <XIcon className='w-[1.2rem] h-[1.2rem]'/> : 'Open Form'}
          </Button>
        </div>
      </div>
      <div className={clsx(`w-1/5 h-full mx-5 mt-5`, !openForm && 'hidden w-0')}>
        <IncidentReport />
      </div>
    </div>
  );
}
