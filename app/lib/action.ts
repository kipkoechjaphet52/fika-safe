'use server';
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import {authOptions} from "../utils/authOptions";
import { getDistance } from "geolib";

const prisma = new PrismaClient();

export async function fetchProfile() {
  try{
    const session = await getServerSession(authOptions);
    if(!session || !session.user?.email){
        throw new Error("User not authenticated");
    }
    const email = session?.user?.email;

    const user = await prisma.user.findUnique({
        where: {email: email,},
    });
    return user;
  }catch(error){
    console.error("Error fetching profile: ", error);
    throw new Error("Could not fetch user profile");
  }
}

export async function userReportStats () {
  try{
    const session = await getServerSession(authOptions);
    if(!session || !session.user?.email){
        throw new Error("User not authenticated");
    }
    const email = session?.user?.email;

    const user = await prisma.user.findUnique({
        where: {email},
        select: {id: true},
    });
    const userId = user?.id;

    const totalReports = await prisma.report.count({
        where: {userId},
    });
    const unverifiedReports = await prisma.report.count({
        where: {
          userId,
          verificationStatus: 'UNVERIFIED',
        },
    });
    const verifiedReports = await prisma.report.count({
        where: {
          userId,
          verificationStatus: 'VERIFIED',
        },
    });

    return {totalReports, unverifiedReports, verifiedReports};
  }catch(error){
    console.error("Error fetching user report stats: ", error);
    throw new Error("Could not fetch user report stats");
  }
}

export async function fetchUserReports(){
  try{
    const session = await getServerSession(authOptions);
    if(!session || !session.user?.email){
        throw new Error("User not authenticated");
    }
    const email = session?.user?.email;

    const user = await prisma.user.findUnique({
        where: {email},
        select: {id: true},
    });
    const userId = user?.id;

    const reports = await prisma.report.findMany({
        where: {userId},
        orderBy: {createdAt: 'desc'},
    });
    return reports;
  }catch(error){
    console.error("Error fetching user reports: ", error);
    throw new Error("Could not fetch user reports");
  }
}

export async function fetchLiveIncidents(){
  try{
    const incidents = await prisma.report.findMany({
      where: {
        createdAt: {
          gte: new Date(new Date().setHours(new Date().getHours() - 24)), // get reports from the last 24 hours
        }
      },
      orderBy: {createdAt: 'desc'},
    })

    return incidents;
  }catch(error){
    console.error("Error fetching live incidents: ", error);
    throw new Error("Could not fetch live incidents");
  }
}

export async function fetchAllIncidents(){
  try{
    const incidents = await prisma.report.findMany({
      orderBy: {createdAt: 'desc'},
    })

    return incidents;
  }catch(error){
    console.error("Error fetching all incidents: ", error);
    throw new Error("Could not fetch all incidents");
  }
}

// function getDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
//   const R = 6371; // Radius of Earth in km
//   const toRad = (angle: number) => (angle * Math.PI) / 180;

//   const dLat = toRad(lat2 - lat1);
//   const dLon = toRad(lon2 - lon1);
//   const a =
//       Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//       Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
//       Math.sin(dLon / 2) * Math.sin(dLon / 2);

//   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//   return R * c; // Distance in km
// }


export async function checkNewAlerts() {
  try{
    const session = await getServerSession(authOptions);
    if(!session || !session.user?.email){
        throw new Error("User not authenticated");
    }
    const email = session?.user?.email;

    const user = await prisma.user.findUnique({
        where: {email},
        include: {
          locations: true,
        }
    });  
    if (!user || user.locations.length === 0) {
      console.error("User not found or no location available");
      throw new Error("User not found or no location available");
    };

    const userId = user.id;
    const userLatitude = user.locations[0].latitude;
    const userLongitude = user.locations[0].longitude;
  
    // Fetch recent incidents (e.g., last 24 hours)
    const recentIncidents = await prisma.report.findMany({
        where: {
            createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }, // Last 24 hours
        },
        select: { id: true, title: true, location: true, latitude: true, longitude: true, severity: true, type: true },
    });
  
    for (const incident of recentIncidents) {
      const distance = getDistance(
        { latitude: userLatitude, longitude: userLongitude },
        { latitude: incident.latitude, longitude: incident.longitude }
      );

      if (distance <= 5000) {
        // **Check if an alert for this incident already exists**
        const existingAlert = await prisma.alert.findFirst({
          where: {
            userId: userId,
            message: {
              contains: `${incident.title}, ${incident.location}, ${incident.latitude}, ${incident.longitude}` // Match location in message
            }
          }
        });

        // **Only create an alert if it doesn't already exist**
        if (!existingAlert) {
          await prisma.alert.create({
            data: {
              message: `Alert: An incident occurred near your new location. Title: ${incident.title}, Location: ${incident.location}, Longitude: ${incident.latitude}, Latitude: ${incident.longitude}, Severity: ${incident.severity}, IncidentType: ${incident.type}`,
              status: "UNREAD",
              userId: userId
            }
          });
        }
      }
    }
  } catch(error){
    console.error("Error checking new alerts: ", error);
    throw new Error("Could not check new alerts");
  }
}

// export async function removeOldAlerts() {
//   const session = await getServerSession(authOptions);
//   if(!session || !session.user?.email){
//       throw new Error("User not authenticated");
//   }
//   const email = session?.user?.email;

//   const user = await prisma.user.findUnique({
//       where: {email},
//       include: {
//         locations: true,
//       }
//   });  
//   if (!user) {
//     console.error("User not found");
//     throw new Error("User not found");
//   };

//   const alerts = await prisma.alert.findMany({
//       where: { id: user.id },
//       select: { id: true, message: true },
//   });

//   for (const alert of alerts) {
//       // Extract location from message (assuming it contains incident info)
//       const incident = extractIncidentFromMessage(alert.message);
      
//       if (incident) {
//           const distance = getDistance(user.locations[0].latitude, user.locations[0].longitude, incident.latitude, incident.longitude);

//           if (distance > 5) {
//               await prisma.alert.delete({ where: { id: alert.id } });
//           }
//       }
//   }
// }

export async function fetchAlerts(){
  try{
    const session = await getServerSession(authOptions);
    if(!session || !session.user?.email){
        throw new Error("User not authenticated");
    }
    const email = session?.user?.email;

    const user = await prisma.user.findUnique({
        where: {email},
        select: {id: true},
    });
    const userId = user?.id;

    const alerts = await prisma.alert.findMany({
        where: {userId},
        orderBy: {createdAt: 'desc'},
    });

    return alerts;
  }catch(error){
    console.error("Error fetching alerts: ", error);
    throw new Error("Could not fetch alerts");
  }
}