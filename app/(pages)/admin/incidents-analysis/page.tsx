"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from '@/app/Components/ui/card'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";
import { Users, AlertTriangle, Shield } from "lucide-react";

// Fetch Data from API to display real-time data
const fetchIncidentsData = async () => {
  try {
    const res = await fetch("/api/incidents"); // Make sure to have an API endpoint to fetch incidents data
    if (!res.ok) throw new Error("Failed to fetch incidents data.");
    return await res.json(); // Assume the API returns an array with data
  } catch (error) {
    console.error("Error fetching incidents data:", error);
    return [];
  }
};

export default function AdminPage() {
  const [incidentsData, setIncidentsData] = useState([]);
  const [totalIncidents, setTotalIncidents] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalResponders, setTotalResponders] = useState(0);

  useEffect(() => {
    // Fetch incidents data and update state
    const getIncidentsData = async () => {
      const data = await fetchIncidentsData();
      setIncidentsData(data);

      // Example of how you might calculate totals if the data includes such details
      const incidents = data.reduce((acc: number, item: any) => acc + item.incidents, 0);
      setTotalIncidents(incidents);

      // Here you'd fetch users and responders from the backend similarly
      setTotalUsers(500); // Set this dynamically from a backend fetch if needed
      setTotalResponders(75); // Set this dynamically from a backend fetch if needed
    };

    getIncidentsData();
  }, []);

  return (
    <div className="space-y-6 p-6">
      {/* Top Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Total Incidents</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between p-6">
            <span className="text-3xl font-bold">{totalIncidents}</span>
            <AlertTriangle className="text-red-500 w-10 h-10" />
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Total Users</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between p-6">
            <span className="text-3xl font-bold">{totalUsers}</span>
            <Users className="text-blue-500 w-10 h-10" />
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Total Emergency Responders</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between p-6">
            <span className="text-3xl font-bold">{totalResponders}</span>
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
            <BarChart data={incidentsData}>
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
