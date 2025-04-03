'use client'
import CrimeMap from '@/app/Components/Crime';
import Search from '@/app/Components/Search';
import { fetchAllIncidents } from '@/app/lib/action';
import { IncidentType, MediaType, SeverityLevel, VerificationStatus } from '@prisma/client';
import clsx from 'clsx';
import Image from 'next/image';
import React, { Suspense, useEffect, useState } from 'react';
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
    const [locations, setLocations] = useState<{[key: string]: { town: string, state: string, country: string } }>({});
    const [searchTerm, setSearchTerm] = useState<string | null>(null);
    const [searchDate, setSearchDate] = useState<Date | null>(null);
    const [hoveredIncidentId, setHoveredIncidentId] = useState<string | null>(null);

    useEffect(() => {
        const handleReports = async () => {
            try {
                const results = await fetchAllIncidents();
                
                setIncidents(results);
                
                const locationPromises = results.map(async (incident) => {
                    const locationData = await fetchNearestTown(incident.latitude, incident.longitude);
                    return { id: incident.id, ...locationData };
                });

                const resolvedLocations = await Promise.all(locationPromises);

                // Convert array to an object for easy lookup
                const locationMap = resolvedLocations.reduce((acc, loc) => {
                    acc[loc.id] = {
                        town: loc.town || "Unknown",
                        state: loc.state || "Unknown",
                        country: loc.country || "Unknown",
                    };
                    return acc;
                }, {} as { [key: string]: { town: string, state: string, country: string } });

                setLocations(locationMap);
            } catch (error) {
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

    async function fetchNearestTown(lat: number, lon: number) {
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
          );
          const data = await response.json();
    
          const town = data.address.town || data.address.city || "Unknown";
          const state = data.address.state || "Unknown";
          const country = data.address.country || "Unknown";

          return { town, state, country };
        
        } catch (error) {
          console.error("Error fetching location details:", error);
        }
      }
  return (
    <div className='w-full h-full relative'>
        <div className='flex'>
            <div className='w-1/3 h-[calc(100vh-3.5rem)] flex flex-col pr-2'>
                <div className='p-4 sticky top-0 bg-card z-10'>
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
                    {incidents.slice(0, 1).map((incident) => (
                        <div className={clsx(`border-b-2`, hoveredIncidentId === incident.id ? "bg-muted" : "bg-card")} key={incident.id}
                            onMouseEnter={() => setHoveredIncidentId(incident.id)} 
                            onMouseLeave={() => setHoveredIncidentId(null)}
                        >
                            <div className='p-4'>
                                {incident.mediaType === 'VIDEO' ? (
                                <video
                                    className="w-full "
                                    autoPlay
                                    loop
                                    muted
                                >
                                    <source src={incident.mediaUrl || ''} type="video/mp4" />
                                    Your browser does not support the video tag.
                                </video>
                                ) : (
                                    <Image src={incident.mediaUrl || ''} alt={incident.description} className='w-full' height={500} width={500}></Image>
                                )}
                                <div className='flex justify-between items-center space-x-4'>
                                    <h1 className='font-bold text-2xl truncate w-2/3'>{incident.title}</h1>
                                    <h1 className='font-thin text-xs text-gray-400 w-1/3'>{formatDate(incident.createdAt)}</h1>
                                </div>
                                <h1 className='font-thin text-base'>{locations[incident.id]?.state}, {locations[incident.id]?.country}</h1>
                                <h1 className='font-thin text-sm text-gray-400'>{incident.location}</h1>
                            </div>
                        </div>
                    ))}
                    {/* Other Incidents */}
                    {incidents.slice(1).map((incident) => (
                        <div className={clsx(`border-b-2`, hoveredIncidentId === incident.id ? "bg-muted" : "bg-card")} key={incident.id} 
                            onMouseEnter={() => setHoveredIncidentId(incident.id)} 
                            onMouseLeave={() => setHoveredIncidentId(null)}
                        >
                            <div className='flex space-x-4 p-4 rounded-lg w-full max-w-2xl' >
                                {incident.mediaType === 'VIDEO' ? (
                                <video
                                    className="w-32 flex-shrink-0"
                                    // autoPlay
                                    loop
                                    muted
                                >
                                    <source src={incident.mediaUrl || ''} type="video/mp4" />
                                    Your browser does not support the video tag.
                                </video>
                                ) : (
                                    <Image src={incident.mediaUrl || ''} alt={incident.description} className='w-32 flex-shrink-0' height={100} width={100}></Image>
                                )}
                                <div>
                                    <div className='flex justify-between items-center space-x-4'>
                                        <h1 className='font-bold text-xl truncate w-2/3'>{incident.title}</h1>
                                        <h1 className='font-thin text-xs text-gray-400 w-1/3'>{formatDate(incident.createdAt)}</h1>
                                    </div>
                                    <h1 className='font-thin text-sm'>{locations[incident.id]?.state}, {locations[incident.id]?.country}</h1>
                                    <h1 className='font-thin text-xs text-gray-400'>{incident.location}</h1>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                </Suspense>
            </div>
            <div className='w-2/3'>
                <CrimeMap incidents={incidents} hoveredIncidentId={hoveredIncidentId} setHoveredIncidentId={setHoveredIncidentId}/>
            </div>
        </div>
        {/* Legend */}
        <div className='absolute bottom-4 right-4 bg-card p-4 rounded-lg'>
            <h1 className='font-bold text-2xl'>Incidents</h1>
            <h1 className='font-thin text-sm text-gray-400'>Showing {incidents.length} incidents</h1>
            <div className='flex items-center space-x-2'>
                <span className="border-2 rounded-full" style={{ display: "inline-block", width: "20px", height: "20px", backgroundColor: "purple", marginRight: "5px" }}></span>
                <span >Critical Danger</span>
            </div>
            <div className='flex items-center space-x-2'>
                <span className="border-2 rounded-full" style={{ display: "inline-block", width: "20px", height: "20px", backgroundColor: "red", marginRight: "5px" }}></span>
                <span >High Danger</span>
            </div>
            <div className='flex items-center space-x-2'>
                <span className="border-2 rounded-full" style={{ display: "inline-block", width: "20px", height: "20px", backgroundColor: "yellow", marginRight: "5px" }}></span>
                <span >Moderate Danger</span>
            </div>
            <div className='flex items-center space-x-2'>
                <span className="border-2 rounded-full" style={{ display: "inline-block", width: "20px", height: "20px", backgroundColor: "yellowgreen", marginRight: "5px" }}></span>
                <span >Low Danger</span>
            </div>                  
        </div>
    </div>
  )
}
