'use client'
import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Button } from '../ui/button'
import Input from '../Input'
import { useToast } from '../../hooks/use-toast'

export default function Profile() {
    const [formData, setFormData] = useState({
        FirstName: '',
        SecondName: '',
        PhoneNumber: '',
        Email: '',
        PrevPassword: '',
        NewPassword: '',
    });

    const {toast} = useToast();
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Here you would typically update the profile via API
        toast({
          title: "Profile Updated",
          description: "Your profile has been successfully updated.",
        });
      };
  return (
    <div>
        <Card>
            <CardContent>
                <>
                <div className="flex items-center gap-4 mt-6 mb-6">
                <Avatar className="h-24 w-24">
                    {/* <AvatarImage src={profile.image} alt={profile.name} /> */}
                    <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <Button>Change Avatar</Button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                    <Input
                        id='FName'
                        name='FirstName'
                        label='First Name'
                        required
                        type='text'
                        placeholder='John'
                        disabled={false}
                        value={formData.FirstName}
                        onChange={(e) => setFormData(e.target.value)}
                    />
                    </div>
                    <div>
                    <Input
                        id='SName'
                        name='SecondName'
                        label='Second Name'
                        required
                        type='text'
                        placeholder='Doe'
                        disabled={false}
                        value={formData.SecondName}
                        onChange={(e) => setFormData(e.target.value)}
                    />
                    </div>
                    <div>
                    <Input
                        id='PNo'
                        name='PhoneNumber'
                        label='Phone Number'
                        required
                        type='tel'
                        placeholder='Doe'
                        disabled={false}
                        value={formData.PhoneNumber}
                        onChange={(e) => setFormData(e.target.value)}
                    />
                    </div>
                    <div>
                    <Input
                        id='Email'
                        name='Email'
                        label='Email'
                        required
                        type='email'
                        placeholder='johndoe@gmail.com'
                        disabled={false}
                        value={formData.Email}
                        onChange={(e) => setFormData(e.target.value)}
                    />
                    </div>
                    <div>
                    <Input
                        id='PrevPassword'
                        name='PrevPassword'
                        label='Previous Password'
                        required
                        type='text'
                        placeholder='**********'
                        disabled={false}
                        value={formData.PrevPassword}
                        onChange={(e) => setFormData(e.target.value)}
                    />
                    </div>
                    <div>
                    <Input
                        id='NewPassword'
                        name='NewPassword'
                        label='New Password'
                        required
                        type='text'
                        placeholder='**********'
                        disabled={false}
                        value={formData.NewPassword}
                        onChange={(e) => setFormData(e.target.value)}
                    />
                    </div>
                </div>
                <Button type="submit">Save Changes</Button>
                </form>
                </>
            </CardContent>
        </Card>
    </div>
  )
}
