"use client";

import { ActiveIncidents } from "@/app/Components/responder/ActiveIncidents";
import { ResponseHistory } from "@/app/Components/responder/ResponseHistory";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/Components/ui/card";
import { fetchStaffStats } from "@/app/lib/action";
import { AlertTriangle, BadgeCheck, BadgeAlertIcon } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function Dashboard() {
  const [totalResponses, setTotalResponses] = useState(0);
  const [unverifiedReports, setUnverifiedReports] = useState(0);
  const [verifiedReports, setVerifiedReports] = useState(0);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
console.log(selectedReport);
  useEffect(() => {
    const fetchReportStats = async () => {
      try{
        const results = await fetchStaffStats();
        setTotalResponses(results.totalReports);
        setUnverifiedReports(results.unverifiedReports);
        setVerifiedReports(results.verifiedReports);
      }catch(error){
        toast.error("Error fetching report stats");
        console.error("Error fetching report stats: ", error);
      }
    };
    fetchReportStats();
  }, []);
  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Responses</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalResponses}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unverified Reports</CardTitle>
            <BadgeAlertIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{unverifiedReports}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Verified Reports</CardTitle>
            <BadgeCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{verifiedReports}</div>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-8 md:grid-cols-2">
        <ActiveIncidents/>
        <ResponseHistory/>
      </div>
    </div>
  );
}