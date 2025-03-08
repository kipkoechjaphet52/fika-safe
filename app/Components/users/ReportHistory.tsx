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
import { EyeIcon, Pencil, TrashIcon } from "lucide-react";

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

export function ReportHistory() {
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
            {reports.map((report) => (
              <TableRow key={report.id}>
                <TableCell className="font-medium">{report.incidentType}</TableCell>
                <TableCell>{report.location}</TableCell>
                <TableCell>
                  <Badge
                    variant={report.status === "pending" ? "secondary" : "success"}
                  >
                    {report.status}
                  </Badge>
                </TableCell>
                <TableCell>{report.reportedAt}</TableCell>
                <TableCell className="flex justify-between">
                  <EyeIcon className="w-5 h-5 " />
                  <Pencil className="w-5 h-5 text-sky-500" />
                  <TrashIcon className="w-5 h-5 text-destructive" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}