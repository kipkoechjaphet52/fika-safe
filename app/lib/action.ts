'use server';
import { AlertStatus, PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import {authOptions} from "../utils/authOptions";
import { getDistance } from "geolib";
import { Server } from "socket.io";
import { io } from "../utils/socket";
import nodemailer from "nodemailer";
import cloudinary from "../config/cloudinary";

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

export async function fetchGuestProfile(){
  try{
    const guest = await prisma.user.findFirst({
        where: {userRole: 'GUEST',},
    });
    return guest;
  }catch(error){
    console.error("Error fetching profile: ", error);
    throw new Error("Could not fetch user profile");
  }
}

export async function fetchStaffProfile() {
  try{
    const session = await getServerSession(authOptions);
    if(!session || !session.user?.email){
        throw new Error("User not authenticated");
    }
    const email = session?.user?.email;

    const staff = await prisma.staff.findUnique({
        where: {email: email,},
    });
    return staff;
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
      await prisma.alert.createMany({ data: alertData });

      const createdAlerts = await prisma.alert.findMany({
        where: { reportId: report.id },
      });

      // Notify users in real-time
      nearbyUsers.forEach((user) => {
        console.log(`📡 Sending alert to user: ${user.id}`);
        newIo.to(user.id).emit("newAlert", {
          alerts: createdAlerts.filter(alert => alert.userId === user.id), // Send only the alerts for this user
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
        where: {
          userId: userId,
          status: 'UNREAD',
        },
        orderBy: {createdAt: 'desc'},
    });

    return alerts;
  }catch(error){
    console.error("Error fetching alerts: ", error);
    throw new Error("Could not fetch alerts");
  }
}

export async function deleteIncident(reportId: string){
  try{
    const session = await getServerSession(authOptions);
    const email = session?.user?.email;
    
    const user = await prisma.user.findUnique({
      where: {email: email!},
      select: {id: true},
    });
    const userId = user?.id;

    await prisma.report.delete({
      where:{
        id: reportId,
        userId: userId,
      }
    })

    
  }catch(error){
    console.error("Error deleting incident: ", error)
  }
}

export async function fetchStaffStats() {
  try{
    const session = await getServerSession(authOptions);
    if(!session || !session.user?.email){
        throw new Error("User not authenticated");
    }
    const email = session?.user?.email;

    const staff = await prisma.staff.findUnique({
        where: {email},
        select: {id: true},
    });
    const staffId = staff?.id;

    const totalReports = await prisma.report.count({
        where: {verifierId: staffId},
    });
    const unverifiedReports = await prisma.report.count({
        where: {
          verifierId: staffId,
          verificationStatus: 'UNVERIFIED',
        },
    });
    const verifiedReports = await prisma.report.count({
        where: {
          verifierId: staffId,
          verificationStatus: 'VERIFIED',
        },
    });

    return {totalReports, unverifiedReports, verifiedReports};
  }catch(error){
    console.error("Error fetching staff stats: ", error);
    throw new Error("Could not fetch staff stats");
  }
}

export async function respondToAnIncident(id: string){
  try{
    const session = await getServerSession(authOptions);
    const email = session?.user?.email;
    if(!email){
      throw new Error("User not authenticated");
    }
    const staff = await prisma.staff.findUnique({
      where: {email},
      select: {id: true},
    })
    if(!staff){
      throw new Error('Staff not found');
    }
    const staffId = staff.id;

    const report = await prisma.report.findUnique({
      where: {id},
    })
    if(!report){
      throw new Error('Report not found');
    }

    const respondedIncident = await prisma.report.update({
      where: {id},
      data: {
        verifier: {
          connect: {id: staffId},
        }
      }
    })

    return respondedIncident;
  }catch(error){
    console.error('Error responding to the incident: ', error);
  }
}

export async function sendEmail(to: string, subject: string, text: string) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
    replyTo: process.env.EMAIL_USER,
  };

  await transporter.sendMail(mailOptions);
}

export async function sendEmailToUser(){
  try{
    const session = await getServerSession(authOptions);
    const userEmail = session?.user?.email;
    if(!userEmail){
      throw new Error("User not authenticated");
    }
    const user = await prisma.user.findUnique({
      where: {email: userEmail},
    })
    if(!user){
      throw new Error("User not found");
    }

    const subject = 'Incident Alert';
    const text = `Hello ${user.firstName} ${user.secondName},\n\nYou have created an incident and it is being verified by the staff. You will be notified once the incident is verified. A staff member is responding to the incident and they will be in touch with you if they need any more information about the incident.\n\nThank you for using our service.\n\nBest regards,\nFika safe team`;
    await sendEmail(userEmail, subject, text);

    const message = `Email sent to ${user.firstName} ${user.secondName} (${userEmail})`;
    return message;
  }catch(error){
    console.error("Error sending emails: ", error);
    throw new Error("Could not send emails to users");
  }
}

export async function sendEmailToStaff(reportId:string){
  try{
    const report = await prisma.report.findUnique({
      where: { id: reportId },
    });
    if (!report) {
      throw new Error("Report not found");
    }

    const staff = await prisma.staff.findMany({
      include:{
        locations: {
          orderBy: { timestamp: "desc" }, // Get the latest location
          take: 1, // Limit to the latest location
        },
      }
    });
    if (!staff || staff.length === 0) {
      throw new Error("No staff found");
    }

    // Filter staff within 5 km of the incident
    const nearbyStaff = staff
      .map((staff) => {
        if (staff.locations.length === 0) return null; // Skip staff without location

        const location = staff.locations[0]; // Get the latest location
        const distance = getDistance(
          { latitude: location.latitude, longitude: location.longitude },
          { latitude: report.latitude, longitude: report.longitude }
        ) / 1000; // Convert meters to km

        return { ...staff, distance };
      })
      .filter((staff) => staff !== null && staff.distance <= 5); // Filter valid staff

    if (nearbyStaff.length === 0) {
      throw new Error("No staff found within 5 km of the incident");
    }
    // Send personalized emails
    const subject = "Incident Alert";
    const emailPromises = nearbyStaff.map((staff) => {
      if (!staff) {
        throw new Error("Staff is null");
      }
      const text = `Hello ${staff.firstName} ${staff.secondName},

An incident has occurred near your location.
Title: ${report.title}
Location: ${report.location}
Longitude: ${report.longitude}
Latitude: ${report.latitude}
Severity: ${report.severity}
Incident Type: ${report.type}

You are approximately ${staff.distance.toFixed(2)} km away from the incident.

Please respond to the incident as soon as possible.

Best regards,  
Fika Safe Team`;

      console.log(`Sending email to ${staff.firstName} ${staff.secondName} (${staff.email})...`);

      return sendEmail(staff.email, subject, text);
    });

    console.log(`Sending email to ${nearbyStaff.length} staff members...`);
    await Promise.all(emailPromises);

    return emailPromises;
  }catch(error){
    console.error("Error sending emails to staff: ", error);
    throw new Error("Could not send emails to staff");
  }
}

export async function fetchActiveIncidents(){ //Active events are those that are unverified and have been created in the last hour
  try{
    const session = await getServerSession(authOptions);
    const email = session?.user?.email;
    if(!email){
      throw new Error("User not authenticated");
    }

    const oneHourAgo = new Date();
    oneHourAgo.setHours(oneHourAgo.getHours() - 1);

    const incidents = await prisma.report.findMany({
      where: {
        verificationStatus: 'UNVERIFIED',
        verifierId: null,
        createdAt: {
          gte: oneHourAgo,
        },
      },
      orderBy: {createdAt: 'desc'},
    })

    const staff = await prisma.staff.findUnique({
      where: {email},
      include: {
        locations: true,
      },
    });
    if(!staff){
      throw new Error("Staff not found");
    }
    // Ensure staff has a recorded location
    if (!staff.locations || staff.locations.length === 0) {
      throw new Error("Staff location not available");
    }

    const staffLocation = staff.locations[0];

    // Map and filter incidents within 5 km
    const staffActiveIncidents = incidents
      .map((incident) => {
        if (!incident.latitude || !incident.longitude) return null; // Skip if incident has no coordinates

        const distance = getDistance(
          { latitude: incident.latitude, longitude: incident.longitude },
          { latitude: staffLocation.latitude, longitude: staffLocation.longitude }
        ) / 1000; // Convert meters to km

        return distance <= 5 ? { ...incident } : null;
      })
      .filter(Boolean); // Remove null values

    if (staffActiveIncidents.length === 0) {
      throw new Error("No active incidents found within 5 km of the staff member's location");
    }
    if(!staffActiveIncidents){
      throw new Error("No active incidents found");
    }

    return staffActiveIncidents;
  }catch(error){
    console.error("Error fetching active incidents: ", error);
    throw new Error("Could not fetch active incidents");
  }
}

export async function fetchStaffResponses(){
  try{
    const session = await getServerSession(authOptions);
    if(!session || !session.user?.email){
        throw new Error("User not authenticated");
    }
    const email = session?.user?.email;

    const staff = await prisma.staff.findUnique({
        where: {email},
        select: {id: true},
    });
    const staffId = staff?.id;

    const incidents = await prisma.report.findMany({
      where: {
        verifierId: staffId,
      },
      orderBy: {createdAt: 'desc'},
    })

    return incidents;
  }catch(error){
    console.error("Error fetching staff responses: ", error);
    throw new Error("Could not fetch staff responses");
  }
}

export async function fetchAdminStats(){
  try{
    const session = await getServerSession(authOptions);
    if(!session || !session.user?.email){
        throw new Error("User not authenticated");
    }
    const email = session?.user?.email;

    const admin = await prisma.staff.findUnique({
        where: {
          email,
          userRole: 'ADMIN',
        },
        select: {id: true},
    });
    if(!admin){
      throw new Error("Admin not found");
    }

    const totalUsers = await prisma.user.count();
    const totalStaff = await prisma.staff.count({
      where: {
        userRole: {in: ['AMBULANCE', 'CARRIER', 'POLICE']},
      }
    });
    const totalReports = await prisma.report.count();

    return {totalUsers, totalStaff, totalReports};
  }catch(error){
    console.error("Error fetching admin stats: ", error);
    throw new Error("Could not fetch admin stats");
  }
}

export async function fetchIncidentsStats(){
  try{
    const session = await getServerSession(authOptions);
    if(!session || !session.user?.email){
        throw new Error("User not authenticated");
    }
    const email = session?.user?.email;

    const admin = await prisma.staff.findUnique({
        where: {
          email,
          userRole: 'ADMIN',
        },
        select: {id: true},
    });
    if(!admin){
      throw new Error("Admin not found");
    }

    const incidents = await prisma.report.groupBy({
      by: ["type"], //fetch based on type of incident
      _count: { type: true }, // Count incidents in each category i.e assault, theft, etc.
    })

    const formattedData = incidents.map((incident) => ({
      category: incident.type,
      count: incident._count.type,
    }));

    const reportStats = await prisma.report.groupBy({
      by: ['createdAt'],
      _count: {_all: true},
      orderBy: {createdAt: 'asc'},
    })
    // Transform the results to group data by month
    const monthlyData = reportStats.reduce((acc, record) => {
    const month = new Date(record.createdAt).toLocaleString('default', { month: 'short' });
    const year = new Date(record.createdAt).getFullYear();
    const monthKey = `${month} ${year}`; // Example: "Jan 2025"

    if (!acc[monthKey]) {
      acc[monthKey] = {
        month: monthKey,
        incidents: 0,
      };
    }

    acc[monthKey].incidents += record._count._all;

    return acc;
  }, {} as Record<string, { month: string; incidents: number }>);

  // Object.values(monthlyData) is used to Convert the grouped data to an array

    return {formattedData, monthlyData: Object.values(monthlyData)};
  }catch(error){
    console.error("Error fetching graph stats: ", error);
    throw new Error("Could not fetch graph stats");
  }
}

export async function fetchSingleIncident(id: string){
  try{
    const incident = await prisma.report.findUnique({
      where: {
        id,
      },
    })

    return incident;
  }catch(error){
    console.error("Error fetching single incident: ", error);
    throw new Error("Could not fetch single incident");
  }
}

export async function uploadFileAction(formData: FormData) {
  try {
    const file = formData.get('file') as File | null;
    if (!file) {
      throw new Error("File is required");
    }
    // Convert the file to a buffer for uploading to Cloudinary
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    interface UploadResult {
      secure_url?: string;
    }
    // Upload to Cloudinary using the stream API
    const uploadResult: UploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { resource_type: 'auto', folder: 'uploads' },
        (error, result) => {
          if (error) reject(error);
          else resolve(result as UploadResult);
        }
      ).end(buffer);
    });

    // Check if upload was successful and return URL
    if (!uploadResult?.secure_url) {
      throw new Error("Upload Failed");
    }
    const url = uploadResult.secure_url

    return url;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw new Error("Could not Upload file");
  }
}

export async function fetchUsers(){
  try{
    const session = await getServerSession(authOptions);
    if(!session || !session.user?.email){
        throw new Error("Admin not authenticated");
    }
    const email = session?.user?.email;

    const admin = await prisma.staff.findUnique({
        where: {
          email,
          userRole: 'ADMIN',
        },
        select: {id: true},
    });
    if(!admin){
      throw new Error("Admin not found");
    }

    const users = await prisma.user.findMany({
      orderBy: {createdAt: 'desc'},
    })

    const staff = await prisma.staff.findMany({
      orderBy: {createdAt: 'desc'},
    })

    return {users, staff};
  }catch(error){
    console.error("Error fetching users: ", error);
    throw new Error("Could not fetch users");
  }
}