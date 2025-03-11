import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from '@/app/lib/prismadb';
import bcrypt from "bcrypt";
import {PrismaAdapter} from '@next-auth/prisma-adapter';
import { UserRole } from "@prisma/client";



export const authOptions: AuthOptions = {
  session: {
    strategy: "jwt",
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }

        // Check both User and Staff tables
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          select: {
            id: true,
            firstName: true,
            secondName: true,
            phoneNumber: true,
            email: true,
            userRole: true,
            password: true,
            createdAt: true,
          }
        });

        const staff = await prisma.staff.findUnique({
          where: { email: credentials.email },
          select: {
            id: true,
            firstName: true,
            secondName: true,
            phoneNumber: true,
            email: true,
            userRole: true,
            password: true,
            createdAt: true,
          }
        });

        const account = user || staff; // Determine which table the account belongs to

        if (!account) {
          throw new Error("User not found");
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(credentials.password, account.password);
        if (!isValidPassword) {
          throw new Error("Incorrect email or password");
        }

        return {
          id: account.id,
          firstName: account.firstName,
          secondName: account.secondName,
          phoneNumber: account.phoneNumber,
          email: account.email,
          userRole: account.userRole, // Role can be USER, ADMIN, POLICE, or EMERGENCY_RESPONDER
          createdAt: account.createdAt,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: { token: any; user?: any }) {
      if (user) {
        return {
            ...token,
            id: user.id,
            firstName: user.firstName,
            secondName: user.secondName,
            phoneNumber: user.phoneNumber,
            email: user.email,
            createdAt: user.createdAt,
            userRole: user.userRole as UserRole
        };
      }
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      return {
        ...session,
        id: token.id,
        firstName: token.firstName,
        secondName: token.secondName,
        email: token.email,
        phoneNumber: token.phoneNumber,
        userRole: token.userRole,
        createdAt: token.createdAt,
      };
    },
  },
  secret: process.env.NEXTAUTH_SECRET, // Ensure this is set in your .env file
};

export default NextAuth(authOptions);
