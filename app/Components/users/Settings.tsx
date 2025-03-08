import React from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { Cog, SettingsIcon, User } from 'lucide-react'
import GeneralSettings from './GeneralSettings'
import Profile from './Profile'
import AccountSettings from './AccountSettings'


export default function Settings({isOpen, onClose}: {isOpen: boolean, onClose: () => void}) {

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className='sm:max-w-[375px] md:max-w-[40vw]'>
            <DialogHeader>
                <DialogTitle>Settings</DialogTitle>
                <DialogDescription>Configure your settings here</DialogDescription>
            </DialogHeader>

            <div className='mt-3 border-t-2 pt-3'>
                <Tabs className='flex flex-row space-x-5 bg-card'>
                    <TabsList className='flex flex-col space-y-4 h-full'>
                        <TabsTrigger value="general"><SettingsIcon className='w-4 h-4 mr-2'/> General</TabsTrigger>
                        <TabsTrigger value="profile"><User className='w-4 h-4 mr-2'/> Profile</TabsTrigger>
                        <TabsTrigger value="account"><Cog className='w-4 h-4 mr-2'/> Account</TabsTrigger>
                    </TabsList>
                <div className='w-full h-full'>
                    <TabsContent value="general">
                        <GeneralSettings/>
                    </TabsContent>
                    <TabsContent value="profile">
                        <Profile/>
                    </TabsContent>
                    <TabsContent value="account">   
                        <AccountSettings/>
                    </TabsContent>
                </div>
                </Tabs>
            </div>
        </DialogContent>
    </Dialog>
  )
}
