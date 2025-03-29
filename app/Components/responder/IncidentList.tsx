"use client";

import { useState } from "react";
import Search from "@/app/Components/Search";
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
import { CheckIcon, EyeIcon } from "lucide-react";
import IncidentVerificationDialog from "@/app/Components/responder/IncidentVerificationDialog";
import { IncidentType, MediaType, SeverityLevel, VerificationStatus } from "@prisma/client";

interface Report {
    id: string;
    createdAt: Date;
    userId: string;
    location: string;
    title: string;
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
export default function IncidentList({ reports }: { reports: Report[] }) {
  const [searchTerm, setSearchTerm] = useState<string | null>(null);
  const [searchDate, setSearchDate] = useState<Date | null>(null);
  const [openDelete, setOpenDelete] = useState(false);
  const [reportId, setReportId] = useState("");

  const handleOpenDelete = (id: string) => {
    setReportId(id);
    setOpenDelete(true);
  };

  return (
    <div>
      <div className="my-5">
        <Search
          placeholder="Search Incidents..."
          onSearch={(term, date) => {
            setSearchTerm(term);
            setSearchDate(date);
          }}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Incidents</CardTitle>
          <CardDescription>A list of all reported incidents</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
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
                    <TableCell className="font-medium">{report.title}</TableCell>
                    <TableCell className="font-medium">{report.type}</TableCell>
                    <TableCell>{report.location}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          report.verificationStatus === "UNVERIFIED"
                            ? "secondary"
                            : "success"
                        }
                      >
                        {report.verificationStatus}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(report.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell className="flex justify-between">
                      <EyeIcon className="w-5 h-5 cursor-pointer" />
                      <CheckIcon
                        className="w-5 h-5 cursor-pointer text-green-400"
                        onClick={() => handleOpenDelete(report.id)}
                      />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    No reports found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <IncidentVerificationDialog open={openDelete} id={reportId} />
    </div>
  );
}
