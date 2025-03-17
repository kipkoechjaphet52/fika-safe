'use server';
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import {authOptions} from "../utils/authOptions";

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