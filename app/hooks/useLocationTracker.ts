import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { fetchProfile } from "../lib/action";
import { UserRole } from "@prisma/client";

const NEXTAUTHURL = process.env.NEXT_PUBLIC_API_URL!;
console.log("NEXTAUTHURL: ", NEXTAUTHURL);
const socket = io(NEXTAUTHURL, { path: "/api/location-socket" });
// const socket = io("http://localhost:3000", { path: "/api/socket" });

interface UserProfile{
    id: string;
    createdAt: Date;
    firstName: string;
    secondName: string;
    phoneNumber: string;
    email: string;
    password: string;
    profilePic: string | null;
    userRole: UserRole;
}
interface Location {
    userId: string | undefined;
    latitude: number;
    longitude: number;
}
export default function useLocationTracker() {
  const [location, setLocation] = useState<Location | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  
  useEffect(() => {
    const handleProfile = async () => {
        try{
            const user = await fetchProfile();
            setProfile(user);
        }catch(error){
            console.error("Error fetching profile: ", error);
        }
    };
    handleProfile();
  },[]);
  const userId = profile?.id;

  useEffect(() => {
    if (!navigator.geolocation) {
      console.error("Geolocation is not supported by your browser.");
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const newLocation = { userId, latitude, longitude };

        setLocation(newLocation);

        // Send data via WebSocket
        socket.emit("locationUpdate", newLocation);

        // Also send data to the API to store in MongoDB
        await fetch("/api/user-location", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newLocation),
        });
      },
      (error) => {
        console.error("Error getting location:", error);
      },
      { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [userId]);

  return location;
}