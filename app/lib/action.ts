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