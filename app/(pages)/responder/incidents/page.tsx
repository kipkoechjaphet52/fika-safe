"use client";

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
import { fetchUserReports } from "@/app/lib/action";
import { IncidentType, MediaType, SeverityLevel, VerificationStatus } from "@prisma/client";
import { CheckIcon, EyeIcon } from "lucide-react";
import { Suspense, useEffect, useState } from "react";
import toast from "react-hot-toast";

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
const Loading = () => <div>Loading...</div>;
export default function Page() {
  const [reports, setReports] = useState<Report[]>([]);
  const [searchTerm, setSearchTerm] = useState<string | null>(null);
  const [searchDate, setSearchDate] = useState<Date | null>(null);

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
    <div className="mx-5">
        <div className="my-5">
            <Suspense fallback={<Loading/>}>
                <Search 
                placeholder='Search Incidents...'
                onSearch = {(term, date) => {
                    setSearchTerm(term);
                    setSearchDate(date);
                }}
                ></Search>
            </Suspense>
        </div>
        <div>
            <Suspense fallback={<Loading/>}>
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
                                variant={report.verificationStatus === "UNVERIFIED" ? "secondary" : "success"}
                                >
                                {report.verificationStatus}
                                </Badge>
                            </TableCell>
                            <TableCell>{report.createdAt.toLocaleDateString()}</TableCell>
                            <TableCell className="flex justify-between">
                                <EyeIcon className="w-5 h-5 " />
                                <CheckIcon className="w-5 h-5" />
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
            </Suspense>
        </div>
    </div>
  );
}
