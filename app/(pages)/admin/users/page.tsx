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

interface User{
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
  const [users, setUsers] = useState<User[]>([]);

  const handleOpen = () => {
    setOpen((prev) => !prev);
  }
  useEffect(() => {
    const handleUsers = async () => {
      try{
        const users = await fetchUsers();
        setUsers(users || []);
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
          <h2 className="text-2xl font-bold tracking-tight">Users</h2>
          <p className="text-muted-foreground">
            Manage system users and their roles
          </p>
        </div>
        <Button onClick={() => handleOpen()}>
          <UserPlus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <CardDescription>A list of all users in the system</CardDescription>
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
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.firstName} {user.secondName}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{user.userRole}</Badge>
                  </TableCell>
                  <TableCell>{user.phoneNumber}</TableCell>
                  <TableCell className="flex items-center gap-2">
                    <Button variant="ghost" size="icon">
                      <PenSquare className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <CreateUserDialog open={open} /*onOpenChange={setOpen}*/ />
    </div>
  );
}