import React, { useEffect, useState } from 'react'
import { Button } from '../ui/button'
import Input from '../Input'
import { useSession } from 'next-auth/react';
import { UpdateEmailDialog } from './UpdateEmailDialog';
import toast from 'react-hot-toast';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

export default function AccountSettings() {
    const [newEmail, setNewEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [prevPassword, setPrevPassword] = useState('');
    const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);

    const isValidEmail = (email: string) => {
        const emailRegex = /^[a-z][a-z0-9._%+-]*@[a-z0-9.-]+\.[a-z]{2,}$/; //This rejects emails like 123@gmail.com and accepts emails like example123@gmail.com, all emails must be lowercase
        return emailRegex.test(email);
      };
      
    const handleOpenUpdateDialog = () => {
        if (!isValidEmail(newEmail)) {
            toast.error("Invalid email format. Please enter a valid email.");
            return;
        }
        setOpenUpdateDialog(true);
    }
    const session = useSession();
    const currentEmail = session.data?.user?.email;

    const togglePasswordVisibility = () => {
        setShowPassword((prevShowPassword) => !prevShowPassword);
      };
    const toggleNewPasswordVisibility = () => {
    setShowNewPassword((prevShowPassword) => !prevShowPassword);
    };

    
    const handleSubmitPassword = async () => {
        if(!prevPassword || !newPassword){
            toast.error("Please provide both current and new password");
            return;
        }
        if(newPassword === prevPassword){
            toast.error("New password cannot be the same as the current password");
            return;
        }
        try{
            const formData = {
                newPassword: newPassword,
                currentPassword: prevPassword,
            }
            toast.loading("Updating password...");
            const response = await fetch('/api/update-password', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();
            toast.dismiss();

            if(response.ok || response.status === 200){
                toast.success("Password updated successfully");
            } else if(response.status === 400){
                toast.error(data.message);
                console.error("Bad request: ", data.message);
            } else {
                toast.error(data.message);
                console.error("Error updating password: ", data.message);
            }
        }catch(error){
            console.error("Error updating password: ", error);
            toast.error("Could not update password");}
    };
  return (
    <div>
        <div className='border-b-2 py-2 '>
            {/* <h1 className=''>Change Email</h1> */}
            <div className='flex justify-between items-center'>
                <div className='w-44'>
                    <Input
                        id='Email'
                        name='Email'
                        label='Enter new email'
                        required
                        type='email'
                        placeholder={currentEmail!}
                        disabled={false}
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                    />
                </div>
                <Button variant='outline' className='rounded-full ml-4 mb-2' onClick={handleOpenUpdateDialog}>Change Email</Button>
            </div>
        </div>
        <div className='border-b-2 py-2 '>
            {/* <h1 className=''>Change Email</h1> */}
            <div className='relative w-44'>
                <Input
                id='PrevPassword'
                name='PrevPassword'
                label=''
                required
                type={showPassword ? 'text' : 'password'}
                placeholder='Current Password'
                disabled={false}
                value={prevPassword}
                onChange={(e) => setPrevPassword(e.target.value)}
                />
                <div
                    className='absolute inset-y-0 right-0 flex pr-1 cursor-pointer items-center'
                    onClick={togglePasswordVisibility} 
                >
                    {showPassword ? (
                    <EyeSlashIcon className='w-4 max-[425px]:w-3'/>
                    ) : (
                    <EyeIcon className='w-4 max-[425px]:w-3'/>
                    )}
                </div>
            </div>
            <div className='flex justify-between items-center'>
                <div className='relative w-44'>
                    <Input
                    id='PrevPassword'
                    name='PrevPassword'
                    label=''
                    required
                    type={showNewPassword ? 'text' : 'password'}
                    placeholder='New Password'
                    disabled={false}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <div
                        className='absolute inset-y-0 right-0 flex pr-1 cursor-pointer items-center '
                        onClick={toggleNewPasswordVisibility} 
                    >
                        {showNewPassword ? (
                        <EyeSlashIcon className='w-4 max-[425px]:w-3'/>
                        ) : (
                        <EyeIcon className='w-4 max-[425px]:w-3'/>
                        )}
                    </div>
                </div>
                <Button variant='outline' className='rounded-full ml-4 mb-2' onClick={handleSubmitPassword}>Change Password</Button>
            </div>
        </div>
        <div className='border-b-2 py-2 flex justify-between items-center'>
            <div>
                <h1 className=''>Log out of all devices</h1>
                <p className='text-xs'>Log out of all active sessions across all devices, including your current session. It may take up to 30 minutes for other devices to be logged out.</p>
            </div>
            <Button variant='outline' className='rounded-full'>Log out all</Button>
        </div>
        <div className='border-b-2 py-2 flex justify-between items-center'>
            <h1 className=''>Delete account</h1>
            <Button variant='destructive' className='rounded-full'>Delete account</Button>
        </div>
        <UpdateEmailDialog open={openUpdateDialog} newEmail={newEmail} onClose={() => setOpenUpdateDialog(false)}/>
    </div>
  )
}
