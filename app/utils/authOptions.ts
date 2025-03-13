import { UserRole } from '@prisma/client';
import NextAuth, { Session, User } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import prisma from '@/app/lib/prismadb';
import bcrypt from 'bcrypt';
import { AuthOptions } from 'next-auth';
import {PrismaAdapter} from '@next-auth/prisma-adapter';
import { JWT } from 'next-auth/jwt';
import { AdapterUser } from 'next-auth/adapters';

type UserType = {
  id: string;
  firstName: string;
  secondName: string;
  phoneNumber: string;
  email: string;
  userRole: UserRole;
  password: string;
  createdAt: Date;
};
type CustomJWT = {
  id: string;
  firstName: string;
  secondName: string;
  phoneNumber: string;
  email: string;
  userRole: UserRole;
  createdAt: Date;
} & JWT;

type CustomSession = Session & {
  user: {
    id: string;
    firstName: string;
    secondName: string;
    phoneNumber: string;
    email: string;
    userRole: UserRole;
    createdAt: Date;
  };
};
export const authOptions: AuthOptions = {
  session: {
    strategy: 'jwt', 
  },
  adapter: PrismaAdapter(prisma), 
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email'},
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials: Record<'email' | 'password', string> | undefined): Promise<UserType | null>  {
        if (!credentials) {
          return null;
        } 


        const client = await prisma.user.findUnique ({
          where: { 
            email: credentials?.email, 
        },
          select:{
            id: true,
            firstName: true,
            secondName: true,
            phoneNumber: true,
            email: true,
            userRole: true,
            password: true,
            createdAt: true,
          },
        });

        if(client){
        const isStudentPassworValid = await bcrypt.compare(credentials.password, client.password);

        if(!isStudentPassworValid){
          throw new Error('Incorrect email or password');
        }

        return {
          id: client.id,
          firstName: client.firstName,
          secondName: client.secondName,
          password: client.password,
          phoneNumber: client.phoneNumber,
          email: client.email,
          userRole: client.userRole,
          createdAt: client.createdAt,
        };
        }

        const staff = await prisma.staff.findUnique({
          where: {
            email: credentials.email,
          },
          select: {
            id: true,
            firstName: true,
            secondName: true,
            email: true,
            phoneNumber: true,
            userRole: true,
            password: true,
            createdAt: true,
          },
        });

        if (staff && staff.userRole !== 'USER') {
          const isStaffPasswordValid = await bcrypt.compare(credentials.password, staff.password);
          if (!isStaffPasswordValid) {
            throw new Error('Incorrect email or password');
          }

          return {
            id: staff.id,
            firstName: staff.firstName,
            secondName: staff.secondName,
            email: staff.email,
            phoneNumber: staff.phoneNumber,
            userRole: staff.userRole,
            password: staff.password,
            createdAt: staff.createdAt,
          };
        }
        throw new Error ('User not found or Unauthorized')
      },
    }),
  ],
//   pages: {
//     signIn: '/auth/signin', 
//     error: '/auth/error',   
//   },
  callbacks: {
    async jwt({ token, user }: { token: JWT, user?: User | AdapterUser  }): Promise<CustomJWT> {
      if(user){
        return{
            ...token,
            id: user.id,
            firstName: (user as UserType).firstName,
            secondName: (user as UserType).secondName,
            password: (user as UserType).password,
            email: user.email ?? '',
            userRole: (user as UserType).userRole,
            createdAt: (user as UserType).createdAt,
            phoneNumber: (user as UserType).phoneNumber,
        };
      } 
      return token as CustomJWT;
    },
    async session({ session, token }: { session: Session, token: JWT }) {
      return{
        ...session,
        user: {
          id: (token as CustomJWT).id,
          firstName: (token as CustomJWT).firstName,
          secondName: (token as CustomJWT).secondName,
          email: (token as CustomJWT).email,
          createdAt: (token as CustomJWT).createdAt,
          phoneNumber: (token as CustomJWT).phoneNumber,
        },
        userRole: (token as CustomJWT).userRole,
      };
    },
  },
  secret: process.env.NEXTAUTH_SECRET, 
};

export default NextAuth(authOptions);
