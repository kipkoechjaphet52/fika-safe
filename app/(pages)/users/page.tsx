"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/app/Components/ui/card";
import { IncidentReport } from "@/app/Components/users/incident-report";
import { ReportHistory } from "@/app/Components/users/ReportHistory";
import { userReportStats } from "@/app/lib/action";
import { IncidentType, MediaType, SeverityLevel, VerificationStatus } from "@prisma/client";
import { BookOpen, FileCheck, AlertTriangle } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface Report {
  id: string;
  createdAt: Date;
  userId: string;
  title: string;
  location: string;
  latitude: number;
  longitude: number;
  type: IncidentType;
  severity: SeverityLevel;
  description: string;
  mediaUrl: string | null;
  mediaType: MediaType;
  verificationStatus: VerificationStatus;
  verifierId: string | null;
  updatedAt: Date;
}
export default function Dashboard() {
  const [totalReports, setTotalReports] = useState(0);
  const [unverifiedReports, setUnverifiedReports] = useState(0);
  const [verifiedReports, setVerifiedReports] = useState(0);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
console.log(selectedReport);
  useEffect(() => {
    const fetchReportStats = async () => {
      try{
        const results = await userReportStats();
        setTotalReports(results.totalReports);
        setUnverifiedReports(results.unverifiedReports);
        setVerifiedReports(results.verifiedReports);
      }catch(error){
        toast.error("Error fetching report stats");
        console.error("Error fetching report stats: ", error);
      }
    };
    fetchReportStats();
    const interval = setInterval(fetchReportStats, 3000); // Poll every 3 seconds
    return () => clearInterval(interval);
  }, []);
  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalReports}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unverified Reports</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{unverifiedReports}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Verified Reports</CardTitle>
            <FileCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{verifiedReports}</div>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-8 md:grid-cols-2">
        {/* <EnrolledCourses /> */}
        <IncidentReport selectedReport={selectedReport} onUpdate={() => setSelectedReport(null)}/>
        <ReportHistory onEdit={setSelectedReport} />
      </div>
    </div>
  );
}