import React from 'react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu'
import {Button} from './ui/button'
import { Switch } from './ui/switch'
import { useTheme } from 'next-themes'
import { ChevronDownIcon } from 'lucide-react'


export default function GeneralSettings() {
  const {theme, setTheme } = useTheme();

  return (
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
  )
}
