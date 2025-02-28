'use client'
import {Button} from '@/app/Components/ui/button';
import CrimeMap from '@/app/Components/Crime';
import { IncidentReport } from '@/app/Components/incident-report';
import clsx from 'clsx';
import React, { useState } from 'react'
import { XIcon } from 'lucide-react';

export default function UserPage() {
  const [openForm, setOpenForm] = useState(false);

  const toggleForm = () => {
    setOpenForm((prev) => !prev);
  };
  return (
    <div className='w-[100vw] h-screen items-center flex overflow-hidden'>
      <div className={clsx(`w-full `, openForm && 'w-3/5')}>
        <CrimeMap />
        <div className='absolute top-20 right-4'>
          <Button onClick={toggleForm} >
            {openForm ? 
            <XIcon className='w-[1.2rem] h-[1.2rem]'/> : 'Open Form'}
          </Button>
        </div>
      </div>
      <div className={clsx(`w-1/5 h-full ml-5 mt-5`, !openForm && 'hidden')}>
        <IncidentReport />
      </div>
    </div>
  );
}
