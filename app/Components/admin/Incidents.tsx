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
import { fetchAllIncidents, fetchUserReports } from "@/app/lib/action";
import { IncidentType, MediaType, SeverityLevel, VerificationStatus } from "@prisma/client";
import { EyeIcon, Pencil, TrashIcon } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Loader from "../Loader";

const reports = [
  {
    id: 1,
    incidentTitle: "THEFT",
    location: "Sichirai",
    incidentsType: "MEDICAL",
    incidentSeverity: "CRITICAL",
    status: "pending",
    dateSubmitted: "2024-03-20",
  },
  {
    id: 2,
    incidentTitle: "MEDICAL",
    incidentsType: "MEDICAL",
    incidentSeverity: "CRITICAL",
    location: "Kooromatangi",
    status: "resolved",
    dateSubmitted: "2024-03-15",
  },
];

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
export function Incidents() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        const response = await fetchAllIncidents();
        if (response) {
          setReports(response);
          toast.success("Reports fetched successfully");
        } 
      } catch (error) {
        toast.error("Error fetching reports: " + error);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  if (loading){
    return <Loader />;
  }
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
              <TableHead>Incident Title </TableHead>
              <TableHead>Severity Level</TableHead>
              <TableHead> IncidentsType</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Approval Status</TableHead>
              <TableHead>Date Submitted</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reports.length > 0 ? (
              reports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell className="font-medium">{report.title}</TableCell>
                  <TableCell>{report.severity}</TableCell>
                  <TableCell>{report.type}</TableCell>
                  <TableCell>{report.location}</TableCell>
                  <TableCell>
                    <Badge
                      variant={report.verificationStatus === "UNVERIFIED" ? "secondary" : "success"}
                    >
                      {report.verificationStatus}
                    </Badge>
                  </TableCell>
                  <TableCell>{report.createdAt.toLocaleString()}</TableCell>
                  <TableCell className="flex justify-between">
                    <EyeIcon className="w-5 h-5 " />
                    <TrashIcon className="w-5 h-5 text-destructive" />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center">No reports found</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
