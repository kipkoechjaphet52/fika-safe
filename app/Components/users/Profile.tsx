'use client'
import React, { useEffect, useRef, useState } from 'react'
import { Card, CardContent } from '../ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import profilePic from '@/public/images/face.webp';
import { Button } from '../ui/button'
import Input from '../Input'
import { useToast } from '../../hooks/use-toast'
import { fetchProfile, fetchStaffProfile } from '@/app/lib/action';
import { UserRole } from '@prisma/client';
import { ProfilePicDialog } from './ProfilePicDialog';

interface UserProfile{
  id: string;
  firstName: string;
  secondName: string;
  phoneNumber: string;
  email: string;
  password: string;
  profilePic: string | null;
  createdAt: Date;
  userRole: UserRole;
}
export default function Profile() {
    const [formData, setFormData] = useState({
        FirstName: '',
        SecondName: '',
        PhoneNumber: '',
        Email: '',
        PrevPassword: '',
        NewPassword: '',
    });
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [openProfileDialog, setOpenProfileDialog] = useState(false);

    const avatar = profile?.profilePic;
    const avatarFallback = `${profile?.firstName.substring(0, 1).toUpperCase()} ${profile?.secondName.substring(0, 1).toUpperCase()}`;
    const name = `${profile?.firstName} ${profile?.secondName}`;

    useEffect(() => {
        const handleProfile = async () => {
          try{
            const user = await fetchProfile();
            const staff = await fetchStaffProfile();
            if (staff) {
              setProfile(staff);
            } else {
              setProfile(user);
            }
          }catch(error){
            console.error("Error fetching profile: ", error);
          }
        }
        handleProfile();
    },[]);

  return (
    <div>
        <Card>
            <CardContent>
                <>
                <div className="flex items-center gap-4 mt-6 mb-6">
                <Avatar className="h-24 w-24">
                    <AvatarImage src={avatar!} alt={name} />
                    <AvatarFallback>{avatarFallback}</AvatarFallback>
                </Avatar>
                <Button onClick={() => {setOpenProfileDialog(true)}}>Change Avatar</Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                    <Input
                        id='FName'
                        name='FirstName'
                        label='First Name'
                        required
                        type='text'
                        placeholder={profile?.firstName || 'First Name'}
                        disabled={true}
                        value={formData.FirstName}
                        onChange={(e) => setFormData({ ...formData, FirstName: e.target.value })}
                    />
                    </div>
                    <div>
                    <Input
                        id='SName'
                        name='SecondName'
                        label='Second Name'
                        required
                        type='text'
                        placeholder={profile?.secondName || 'Second Name'}
                        disabled={true}
                        value={formData.SecondName}
                        onChange={(e) => setFormData({...formData, SecondName: e.target.value})}
                    />
                    </div>
                    <div>
                    <Input
                        id='PNo'
                        name='PhoneNumber'
                        label='Phone Number'
                        required
                        type='tel'
                        placeholder={profile?.phoneNumber || 'Phone Number'}
                        disabled={true}
                        value={formData.PhoneNumber}
                        onChange={(e) => setFormData({...formData, PhoneNumber: e.target.value})}
                    />
                    </div>
                    <div>
                    <Input
                        id='Email'
                        name='Email'
                        label='Email'
                        required
                        type='email'
                        placeholder={profile?.email || 'email'}
                        disabled={true}
                        value={formData.Email}
                        onChange={(e) => setFormData({...formData, Email: e.target.value})}
                    />
                    </div>
                </div>
                </>
            </CardContent>
        </Card>
        <ProfilePicDialog open={openProfileDialog} onClose={() => {setOpenProfileDialog(false)}} />
    </div>
  )
}
