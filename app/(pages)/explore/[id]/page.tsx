"use client";
import Image from "next/image";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation"; // ✅ Get dynamic ID from URL
interface Incident {
  timestamp: string;
  description: string;
}

interface IncidentDetails {
  title: string;
  location: string;
  videoUrl?: string;
  mapUrl?: string;
  updates: Incident[];
}

const incidentData: IncidentDetails = {
  title: "Two People Shot",
  location: "N Mascher St & W Huntingdon St",
  videoUrl: "https://your-video-url.com", // Replace with actual video link
  mapUrl: "https://your-map-image-url.com", // Replace with actual map thumbnail
  updates: [
    { timestamp: "Mar 4 11:14:59 PM EST", description: "Police have resumed K-9 operations and are treating the walk-in victim at a local hospital as a suspect." },
    { timestamp: "Mar 4 11:13:11 PM EST", description: "Police state the vehicle is registered to the brother a person shot last night." },
    { timestamp: "Mar 4 11:12:49 PM EST", description: "Police have found blood inside the green Ford F-150, potentially linking it to the current shooting and a previous incident." },
    { timestamp: "Mar 4 11:11:12 PM EST", description: "The vehicle was also identified in a separate shooting last night, according to police." },
    { timestamp: "Mar 4 11:10:56 PM EST", description: "Police have identified a green Ford F-150, still active and warm, as potentially linked to the shooting incident." },
    { timestamp: "Mar 4 11:10:02 PM EST", description: "Police are investigating whether the blood trail on Huntingdon is linked to a recent shooting or a previous incident. A new victim has walked into a hospital with a gunshot wound." }
  ]
};

const IncidentTimeline: React.FC = (props) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredIncidents, setFilteredIncidents] = useState<Incident[]>(incidentData.updates);
  const [liveUpdates, setLiveUpdates] = useState<Incident[]>([]);

  // Simulate live updates (mocking real-time data)
  useEffect(() => {
    const interval = setInterval(() => {
      const newUpdate: Incident = {
        timestamp: new Date().toLocaleString(),
        description: "🚨 Live Update: Police have secured the area and are questioning witnesses."
      };
      setLiveUpdates((prev) => [newUpdate, ...prev]);
    }, 15000); // Every 15 seconds

    return () => clearInterval(interval);
  }, []);

  // Filter updates based on search
  useEffect(() => {
    setFilteredIncidents(
      incidentData.updates.filter((incident) =>
        incident.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [searchQuery]);

  return (
    <div className="max-w-2xl mx-auto p-4 bg-gray-900 text-white rounded-lg shadow-lg">
      {/* Incident Title & Location */}
      <h2 className="text-2xl font-bold mb-2">{incidentData.title}</h2>
      <p className="text-gray-400 mb-4">{incidentData.location}</p>

      {/* Video Embed */}
      {incidentData.videoUrl && (
        <div className="mb-4">
          <iframe
            className="w-full h-64 rounded-lg"
            src={incidentData.videoUrl}
            title="Incident Video"
            allowFullScreen
          ></iframe>
        </div>
      )}
      {/* Map Thumbnail */}
{incidentData.mapUrl && (
        <div className="mb-4">
          <Image
            src={"path-to-img.jpg"}
            alt="Description of the img"
            width={500}
            height={300}
            className="w-full h-64 rounded-lg object-cover"
          />
        </div>
      )}

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search incident updates..."
        className="w-full p-2 mb-4 rounded bg-gray-800 text-white border border-gray-600"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {/* Incident Timeline */}
      <h3 className="text-xl font-semibold mt-4 mb-2">Incident Updates</h3>
      <div className="border-l-2 border-gray-500 pl-4 space-y-4">
        {/* Live Updates */}
        {liveUpdates.map((incident, index) => (
          <div key={index} className="relative">
            <div className="absolute -left-2 top-2 w-4 h-4 bg-red-500 animate-pulse rounded-full"></div>
            <p className="text-sm text-gray-400">{incident.timestamp}</p>
            <p className="text-base">{incident.description}</p>
          </div>
        ))}

        {/* Filtered Timeline Updates */}
        {filteredIncidents.map((incident, index) => (
          <div key={index} className="relative">
            <div className="absolute -left-2 top-2 w-4 h-4 bg-blue-500 rounded-full"></div>
            <p className="text-sm text-gray-400">{incident.timestamp}</p>
            <p className="text-base">{incident.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IncidentTimeline;
