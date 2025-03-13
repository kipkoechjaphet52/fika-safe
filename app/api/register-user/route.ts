import { PrismaClient } from "@prisma/client";
import bcrypt from 'bcrypt';
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req:Request){
    if(req.method !== 'POST'){
        return new Response(JSON.stringify({message: 'Method not allowed'}), {status: 405});
    }

    try{
        const {firstName, secondName, email, phoneNumber, password} = await req.json();

        if(!firstName || !secondName || !email || !phoneNumber || !password){
            return NextResponse.json({error: 'Please fill all fields'}, {status: 400});
        }

        const existingUser = await prisma.user.findUnique({
            where:{email},
        });
        
        if(existingUser){
            return new Response(
                JSON.stringify({message: 'A User with these credentials already exists'}), 
                {status: 409}
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
            data:{
                firstName,
                secondName,
                email,
                phoneNumber,
                password: hashedPassword,
            }
        });

        return new Response(
            JSON.stringify({
                message: 'User registered successfully',
                user: {
                    id: newUser.id,
                    firstName: newUser.firstName,
                    secondName: newUser.secondName,
                    email: newUser.email,
                    phoneNumber: newUser.phoneNumber,
                },
            }),
            {status: 201}
        );
    }catch(error){
        console.error("Error registering User: ", error);
        return new Response(JSON.stringify(
            JSON.stringify({message: 'An error occurred while registering user'})),
            {status: 500}
        );
    }
}