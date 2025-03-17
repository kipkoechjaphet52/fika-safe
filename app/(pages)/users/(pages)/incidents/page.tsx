'use client'
import CrimeMap from '@/app/Components/Crime';
import Search from '@/app/Components/Search'
import { fetchAllIncidents } from '@/app/lib/action';
import { IncidentType, MediaType, SeverityLevel, VerificationStatus } from '@prisma/client';
import React, { Suspense, useEffect, useState } from 'react'
import toast from 'react-hot-toast';

interface Report {
  id: string;
  createdAt: Date;
  userId: string;
  title: string;
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
const Loading = () => <div>Loading...</div>;
export default function Page() {
    const [incidents, setIncidents] = useState<Report[]>([]);
    const [searchTerm, setSearchTerm] = useState<string | null>(null);
    const [searchDate, setSearchDate] = useState<Date | null>(null);

    useEffect(() => {
        const handleReports = async () => {
            try{
                const results = await fetchAllIncidents();
                
                setIncidents(results);
            }catch(error){
                toast.error("Error fetching reports");
                console.error("Error fetching reports: ", error);
            }
        };
        handleReports();
    }, []);

    function formatDate(timestamp: string | number | Date): string {
        const date = new Date(timestamp);
        const now = new Date();
        
        // Get yesterday's date
        const yesterday = new Date();
        yesterday.setDate(now.getDate() - 1);
    
        // Remove time portion for comparison
        const isYesterday = date.toDateString() === yesterday.toDateString();
    
        // Format time in 12-hour format with AM/PM
        const timeFormatter = new Intl.DateTimeFormat('en-KE', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true,
            timeZoneName: 'short'
        });
    
        const formattedTime = timeFormatter.format(date).replace("GMT+3", "EAT");
    
        if (isYesterday) {
            return `Yesterday ${formattedTime}`;
        }
    
        // Format date in dd/mm/yyyy
        const formattedDate = date.toLocaleDateString('en-GB');
        return `${formattedDate} ${formattedTime}`;
    }
  return (
    <div className='w-full h-full mx-5'>
        <div className='flex'>
            <div className='w-1/3 h-[calc(100vh-3.5rem)] flex flex-col'>
                <div className='py-4 sticky top-0 bg-card z-10'>
                    <Suspense fallback={<Loading/>}>
                        <Search 
                        placeholder='Search Incidents...'
                        onSearch = {(term, date) => {
                            setSearchTerm(term);
                            setSearchDate(date);
                        }}
                        ></Search>
                    </Suspense>
                </div>
                <Suspense fallback={<Loading/>}>
                <div className='flex-1 overflow-y-scroll '>
                    {/* Latest Incident */}
                    <div className='border-b-2'>
                        {incidents.slice(0, 1).map((incident) => (
                            <div className='p-4' key={incident.id}>
                                <video
                                    className="w-full "
                                    autoPlay
                                    loop
                                    muted
                                >
                                    <source src={incident.mediaUrl || ''} type="video/mp4" />
                                    Your browser does not support the video tag.
                                </video>
                                <div className='flex justify-between items-center space-x-4'>
                                    <h1 className='font-bold text-2xl truncate w-2/3'>{incident.title}</h1>
                                    <h1 className='font-thin text-xs text-gray-400 w-1/3'>{formatDate(incident.createdAt)}</h1>
                                </div>
                                <h1 className='font-thin text-base'>CBD, Nairobi</h1>
                                <h1 className='font-thin text-sm text-gray-400'>{incident.location}</h1>
                            </div>
                        ))}
                    </div>
                    {/* Other Incidents */}
                    <div className='border-b-2'>
                        <div className='flex space-x-4 p-4 rounded-lg w-full max-w-2xl'>
                            <div className='relative w-32 flex-shrink-0'>
                                <video
                                    className="w-full object-cover"
                                    muted
                                >
                                    <source src="/videos/Accident.mp4" type="video/mp4" />
                                    Your browser does not support the video tag.
                                </video>
                            </div>
                            <div>
                                <div className='flex justify-between items-center space-x-4'>
                                    <h1 className='font-bold text-xl truncate w-2/3'>Collision With Truck On Top</h1>
                                    <h1 className='font-thin text-xs text-gray-400 w-1/3'>Yesterday 10.47.16 PM EAT</h1>
                                </div>
                                <h1 className='font-thin text-sm'>CBD, Nairobi</h1>
                                <h1 className='font-thin text-xs text-gray-400'>Lithuli Avenue</h1>
                            </div>
                        </div>
                    </div>
                    <div className='border-b-2'>
                        <div className='flex space-x-4 p-4 rounded-lg w-full max-w-2xl'>
                            <div className='relative w-32 flex-shrink-0'>
                                <video
                                    className="w-full object-cover"
                                    muted
                                >
                                    <source src="/videos/Accident.mp4" type="video/mp4" />
                                    Your browser does not support the video tag.
                                </video>
                            </div>
                            <div>
                                <div className='flex justify-between items-center space-x-4'>
                                    <h1 className='font-bold text-xl truncate w-2/3'>Collision With Truck On Top</h1>
                                    <h1 className='font-thin text-xs text-gray-400 w-1/3'>Yesterday 10.47.16 PM EAT</h1>
                                </div>
                                <h1 className='font-thin text-sm'>CBD, Nairobi</h1>
                                <h1 className='font-thin text-xs text-gray-400'>Lithuli Avenue</h1>
                            </div>
                        </div>
                    </div>
                    <div className='border-b-2'>
                        <div className='flex space-x-4 p-4 rounded-lg w-full max-w-2xl'>
                            <div className='relative w-32 flex-shrink-0'>
                                <video
                                    className="w-full object-cover"
                                    muted
                                >
                                    <source src="/videos/Accident.mp4" type="video/mp4" />
                                    Your browser does not support the video tag.
                                </video>
                            </div>
                            <div>
                                <div className='flex justify-between items-center space-x-4'>
                                    <h1 className='font-bold text-xl truncate w-2/3'>Collision With Truck On Top</h1>
                                    <h1 className='font-thin text-xs text-gray-400 w-1/3'>Yesterday 10.47.16 PM EAT</h1>
                                </div>
                                <h1 className='font-thin text-sm'>CBD, Nairobi</h1>
                                <h1 className='font-thin text-xs text-gray-400'>Lithuli Avenue</h1>
                            </div>
                        </div>
                    </div>
                </div>
                </Suspense>
            </div>
            <div className='w-2/3'>
                <CrimeMap incidents={incidents}/>
            </div>
        </div>
    </div>
  )
}
