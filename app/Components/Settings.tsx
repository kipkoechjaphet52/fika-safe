import React from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { ArrowDown, ChevronDownIcon, Cog, MoveDownIcon, SettingsIcon, User } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu'
import { useTheme } from 'next-themes'
import {Button} from './ui/button'
import { Switch } from './ui/switch'

export default function Settings({isOpen, onClose}: {isOpen: boolean, onClose: () => void}) {
  const {theme, setTheme } = useTheme();

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
                        <div>
                            <div className='border-b-2 pb-2 flex justify-between items-center'>
                                <h1 className=''>Theme</h1>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant='ghost' className='flex items-center gap-2'>
                                            <span>{theme}</span>
                                            <ChevronDownIcon className='w-4 h-4'/>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => setTheme("light")}>
                                        Light
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => setTheme("dark")}>
                                        Dark
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => setTheme("system")}>
                                        System
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                            <div className='border-b-2 py-2 flex justify-between items-center'>
                                <h1 className=''>Language</h1>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant='ghost' className='flex items-center gap-2'>
                                            <span>English</span>
                                            <ChevronDownIcon className='w-4 h-4'/>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem>English</DropdownMenuItem>
                                        <DropdownMenuItem>Swahili</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                            <div className='border-b-2 py-2 flex justify-between items-center'>
                                <h1 className=''>Notifications</h1>
                                <Switch/>
                            </div>
                            <div className='border-b-2 py-2 flex justify-between items-center'>
                                <h1 className=''>Location</h1>
                                <Switch/>
                            </div>
                            <div className='border-b-2 py-2 flex justify-between items-center'>
                                <h1 className=''>Privacy</h1>
                                <Switch/>
                            </div>
                            {/* <h1 className='font-bold'>Danger Zone</h1> */}
                            <div className='border-b-2 py-2 flex justify-between items-center'>
                                <h1 className=''>Archive all incidents</h1>
                                <Button variant='outline' className='rounded-full'>Archive all</Button>
                            </div>
                            <div className='border-b-2 py-2 flex justify-between items-center'>
                                <h1 className=''>Delete all incidents</h1>
                                <Button variant='destructive' className='rounded-full'>Delete all</Button>
                            </div>
                            <div className='py-2 flex justify-between items-center'>
                                <h1 className=''>Log out on this device</h1>
                                <Button variant='outline' className='rounded-full'>Log out</Button>
                            </div>
                        </div>
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
