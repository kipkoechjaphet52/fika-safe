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

export function Incidents() {
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
                  <TableCell className="font-medium">{report.incidentTitle}</TableCell>
                  <TableCell>{report.incidentSeverity}</TableCell>
                  <TableCell>{report.incidentsType}</TableCell>
                  <TableCell>{report.location}</TableCell>
                  <TableCell>
                    <Badge
                      variant={report.status === "UNVERIFIED" ? "secondary" : "success"}
                    >
                      {report.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{report.dateSubmitted}</TableCell>
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
