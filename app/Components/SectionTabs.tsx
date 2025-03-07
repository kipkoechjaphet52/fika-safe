'use client'
import React, { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import Dashboard from '../(pages)/users/page';
import Link from 'next/link';

export default function SectionTabs() {
    const [activeTab, setActiveTab] = useState("overview");
  return (
    <div>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-5 mb-8">
                <Link href='/users'><TabsTrigger value="dashboard">Dashboard</TabsTrigger></Link>
                <Link href='/users/maps'><TabsTrigger value="live-maps">Live Maps</TabsTrigger></Link>
                <Link href='/users'><TabsTrigger value="incidents">Incidents</TabsTrigger></Link>
                <TabsTrigger value="help">Help</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            {/* <TabsContent value="dashboard">
                <Dashboard />
            </TabsContent> */}
        </Tabs>
    </div>
  )
}
