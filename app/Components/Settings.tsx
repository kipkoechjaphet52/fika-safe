import React from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Cog, SettingsIcon, User } from 'lucide-react'

export default function Settings({isOpen, onClose}: {isOpen: boolean, onClose: () => void}) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Settings</DialogTitle>
                <DialogDescription>Configure your settings here</DialogDescription>
            </DialogHeader>

            <div className='w-96 h-96 mt-5'>
                <Tabs className='flex flex-row space-x-5 bg-card'>
                    <TabsList className='flex flex-col space-y-4 h-full'>
                        <TabsTrigger value="general"><SettingsIcon className='w-4 h-4 mr-2'/> General</TabsTrigger>
                        <TabsTrigger value="profile"><User className='w-4 h-4 mr-2'/> Profile</TabsTrigger>
                        <TabsTrigger value="account"><Cog className='w-4 h-4 mr-2'/> Account</TabsTrigger>
                    </TabsList>
                <div className='w-full h-full'>
                    <TabsContent value="general">
                        <div>General settings</div>
                    </TabsContent>
                    <TabsContent value="profile">
                        <div>Profile settings</div>
                    </TabsContent>
                    <TabsContent value="account">   
                        <div>Account settings</div>
                    </TabsContent>
                </div>
                </Tabs>
            </div>
        </DialogContent>
    </Dialog>
  )
}
