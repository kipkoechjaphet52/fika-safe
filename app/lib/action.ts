'use server';
import { AlertStatus, PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import {authOptions} from "../utils/authOptions";
import { getDistance } from "geolib";
import { Server } from "socket.io";
import { io } from "../utils/socket";

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

const newIo = io;
export async function createAlertForIncident(reportId: string) {
  try {
      // Fetch the report details
      const report = await prisma.report.findUnique({
          where: { id: reportId },
      });

      if (!report) {
          throw new Error("Report not found");
      }

      // Find nearby users within 5km radius
      const nearbyUsers = await prisma.user.findMany({
          where: {
              AND: [
                  {
                      locations: {
                          some: {
                              latitude: {
                                  gte: report.latitude - 0.045, // ~5km range
                                  lte: report.latitude + 0.045,
                              },
                          },
                      },
                  },
                  {
                      locations: {
                          some: {
                              longitude: {
                                  gte: report.longitude - 0.045,
                                  lte: report.longitude + 0.045,
                              },
                          },
                      },
                  },
              ],
          },
          select: { id: true },
      });

      // Create alerts for each user
      const alertData = nearbyUsers.map((user) => ({
          reportId: report.id,
          userId: user.id,
          message: `An incident occurred near your new location. Title: ${report.title}, Location: ${report.location}, Longitude: ${report.latitude}, Latitude: ${report.longitude}, Severity: ${report.severity}, IncidentType: ${report.type}`,
          status: "UNREAD" as AlertStatus,
      }));

      // Store alerts in the database
      const alert = await prisma.alert.createMany({ data: alertData });

      // Notify users in real-time
      nearbyUsers.forEach((user) => {
        console.log(`📡 Sending alert to user: ${user.id}`);
        newIo.to(user.id).emit("newAlert", {
            alert: alert,
            message: `New Alert: Title: ${report.title}, ${report.type} near ${report.location}`,
            alertId: report.id,
        });
      });

      console.log(`Alert sent to ${nearbyUsers.length} users.`);
  } catch (error) {
      console.error("Error creating alert: ", error);
  }
}

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