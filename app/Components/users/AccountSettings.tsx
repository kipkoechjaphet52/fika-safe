import React, { useState } from 'react'
import { Button } from '../ui/button'
import Input from '../Input'

export default function AccountSettings() {
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [prevPassword, setPrevPassword] = useState('');

  return (
    <div>
        <div className='border-b-2 py-2 '>
            {/* <h1 className=''>Change Email</h1> */}
            <div className='flex justify-between items-center'>
                <div className='w-44'>
                    <Input
                        id='Email'
                        name='Email'
                        label=''
                        required
                        type='email'
                        placeholder='johndoe@gmail.com'
                        disabled={false}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <Button variant='outline' className='rounded-full ml-4 mb-2'>Change Email</Button>
            </div>
        </div>
        <div className='border-b-2 py-2 '>
            {/* <h1 className=''>Change Email</h1> */}
            <div className='w-44'>
            <Input
                id='PrevPassword'
                name='PrevPassword'
                label=''
                required
                type='text'
                placeholder='Current Password'
                disabled={false}
                value={prevPassword}
                onChange={(e) => setPrevPassword(e.target.value)}
            />
            </div>
            <div className='flex justify-between items-center'>   
                <div className='w-44'>
                <Input
                    id='Password'
                    name='Password'
                    label=''
                    required
                    type='text'
                    placeholder='New Password'
                    disabled={false}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    />
                </div>
                <Button variant='outline' className='rounded-full ml-4 mb-2'>Change Password</Button>
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
            <Button variant='destructive' className='rounded-full'>Delete all</Button>
        </div>
    </div>
  )
}
