"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/app/Components/ui/card'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";
import { Users, AlertTriangle, Shield } from "lucide-react";
import { useEffect, useState } from 'react';
import { fetchAdminStats } from '@/app/lib/action';

// Sample Data
const data = [
  { name: "Jan", incidents: 30 },
  { name: "Feb", incidents: 45 },
  { name: "Mar", incidents: 25 },
  { name: "Apr", incidents: 50 },
];

export default function AdminPage() {
  const [reportTotals, setReportTotals] = useState(0);
  const [userTotals, setUserTotals] = useState(0);
  const [responderTotals, setResponderTotals] = useState(0);

  useEffect(() => {
    const handleTotals = async () => {
      try {
        const response = await fetchAdminStats();
        setReportTotals(response.totalReports);
        setUserTotals(response.totalUsers);
        setResponderTotals(response.totalStaff);
      } catch (error) {
        console.error("Error fetching totals:", error);
      }
    }
    handleTotals();
    const interval = setInterval(handleTotals, 3000); // Poll every 3 seconds
    return () => clearInterval(interval);
  },[])

  return (
    <div className="space-y-6 p-6">
      {/* Top Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Total Incidents</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between p-6">
            <span className="text-3xl font-bold">{reportTotals}</span>
            <AlertTriangle className="text-red-500 w-10 h-10" />
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Total Users</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between p-6">
            <span className="text-3xl font-bold">{userTotals}</span>
            <Users className="text-blue-500 w-10 h-10" />
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Total Emergency Responders</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between p-6">
            <span className="text-3xl font-bold">{responderTotals}</span>
            <Shield className="text-green-500 w-10 h-10" />
          </CardContent>
        </Card>
      </div>

      {/* Incidents Overview Chart */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Incidents Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="incidents" fill="#3182CE" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
