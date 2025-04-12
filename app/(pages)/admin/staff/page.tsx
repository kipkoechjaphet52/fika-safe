"use client";

import { Button } from "@/app/Components/ui/button";
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
import { CreateUserDialog } from "@/app/Components/admin/create-user-dialog";
import { useEffect, useState } from "react";
import { UserPlus, PenSquare, Trash2 } from "lucide-react";
import { Badge } from "@/app/Components/ui/badge";
import { fetchUsers } from "@/app/lib/action";
import { UserRole } from "@prisma/client";
import DeleteUserDialog from "@/app/Components/admin/delete-user-dialog";

interface Staff{
    id: string;
    createdAt: Date;
    firstName: string;
    secondName: string;
    phoneNumber: string;
    email: string;
    password: string;
    profilePic: string | null;
    userRole: UserRole;
}
export default function UsersPage() {
  const [open, setOpen] = useState(false);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [userId, setUserId] = useState("");
  const [openDelete, setOpenDelete] = useState(false);
  
  const handleOpenDelete = (id: string) => {
    setUserId(id);
    setOpenDelete(true);
  };
    
  const handleOpen = () => {
    setOpen((prev) => !prev);
  }
  useEffect(() => {
    const handleUsers = async () => {
      try{
        const staff = await fetchUsers();
        setStaff(staff.staff || []);
      }catch(error){
        console.error('Error fetching users', error);
      }
    }
    handleUsers();
    const interval = setInterval(handleUsers, 3000); // Poll every 3 seconds
    return () => clearInterval(interval);
  },[]);
  return (
    <div className="space-y-6 mx-5">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Staff</h2>
          <p className="text-muted-foreground">
            Manage system staff and their roles
          </p>
        </div>
        <Button onClick={() => handleOpen()}>
          <UserPlus className="mr-2 h-4 w-4" />
          Add Staff
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Staff</CardTitle>
          <CardDescription>A list of all staff in the system</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Phone Number</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {staff.length > 0 ? (
              staff.map((staff) => (
                <TableRow key={staff.id}>
                  <TableCell className="font-medium">{staff.firstName} {staff.secondName}</TableCell>
                  <TableCell>{staff.email}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{staff.userRole}</Badge>
                  </TableCell>
                  <TableCell>{staff.phoneNumber}</TableCell>
                  <TableCell className="flex items-center gap-2">
                    <Button variant="ghost" size="icon">
                      <PenSquare className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleOpenDelete(staff.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
                <TableRow>
                    <TableCell colSpan={5} className="text-center">
                    No staff found
                    </TableCell>
                </TableRow>
            )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <CreateUserDialog open={open} /*onOpenChange={setOpen}*/ />
      <DeleteUserDialog open={openDelete} userId={userId} onClose={() => setOpenDelete(false)} /> {/* Placeholder for delete dialog */}
    </div>
  );
}