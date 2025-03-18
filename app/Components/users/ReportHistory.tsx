"use client";

import { Badge } from "@/app/Components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/Components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/Components/ui/table";
import { fetchUserReports } from "@/app/lib/action";
import { IncidentType, MediaType, SeverityLevel, VerificationStatus } from "@prisma/client";
import { EyeIcon, Pencil, TrashIcon } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const reports = [
  {
    id: 1,
    incidentType: "THEFT",
    location: "Sichirai",
    status: "pending",
    reportedAt: "2024-03-20",
  },
  {
    id: 2,
    incidentType: "MEDICAL",
    location: "Kooromatangi",
    status: "resolved",
    reportedAt: "2024-03-15",
  },
];

interface Report {
  id: string;
  createdAt: Date;
  userId: string;
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
export function ReportHistory() {
  const [reports, setReports] = useState<Report[]>([]);

  useEffect(() => {
    const handleReports = async () => {
      try{
        const results = await fetchUserReports();
        
        setReports(results);
      }catch(error){
        toast.error("Error fetching reports");
        console.error("Error fetching reports: ", error);
      }
    };
    handleReports();
  }, []);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Incidents History</CardTitle>
        <CardDescription>Your reported incidents and their status</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Incident Type</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Reported On</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reports.length > 0 ? (
              reports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell className="font-medium">{report.type}</TableCell>
                  <TableCell>{report.location}</TableCell>
                  <TableCell>
                    <Badge
                      variant={report.verificationStatus === "UNVERIFIED" ? "secondary" : "success"}
                    >
                      {report.verificationStatus}
                    </Badge>
                  </TableCell>
                  <TableCell>{report.createdAt.toLocaleDateString()}</TableCell>
                  <TableCell className="flex justify-between">
                    <EyeIcon className="w-5 h-5 " />
                    <Pencil className="w-5 h-5 text-sky-500" />
                    <TrashIcon className="w-5 h-5 text-destructive" />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center">No reports found</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
