"use client";

import { Button } from "@/app/Components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/app/Components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/app/Components/ui/form";
import { Input } from "@/app/Components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/Components/ui/select";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const formSchema = z.object({
  fName: z.string().min(1, "First Name is required"),
  sName: z.string().min(1, "Second Name is required"),
  email: z.string().email("Invalid email address"),
  userRole: z.enum(["USER", "GUEST", "ADMIN", "POLICE", "AMBULANCE", "CARRIER"]),
  phoneNo: z.string().min(1, "Phone number is required"),
});

interface CreateUserDialogProps {
  open: boolean;
}
export function CreateUserDialog({ open }: CreateUserDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setisLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const toggleLoading = () => {
    setisLoading((prevLoading) => !prevLoading);
  };
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fName: "",
      sName: "",
      email: "",
      userRole: "USER",
      phoneNo: "",
    },
  });

  const email = form.getValues('email');

  const isValidEmail = (email: string) => {
    const emailRegex = /^[a-z][a-z0-9._%+-]*@[a-z0-9.-]+\.[a-z]{2,}$/; //This rejects emails like 123@gmail.com and accepts emails like example123@gmail.com, all emails must be lowercase
    return emailRegex.test(email);
  };

  const validatePhoneNumber = (value: string) => {
    // Ensure it starts with '0' and has exactly 10 digits
    return /^0\d{9}$/.test(value);
  };

  const selectedRole = form.watch('userRole');

  useEffect(() => {
    if (open) {
      setIsOpen(true);
    }
  }, [open]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    setIsOpen(false);
    form.reset();
  }
  
  const handleSubmit = async () => {
    if (!isValidEmail(email)) {
      toggleLoading();
      toast.error('Please enter a valid email address');
      return;
    }
    if (!validatePhoneNumber(form.getValues('phoneNo'))) {
      toggleLoading();
      toast.error('Please enter a valid phone number');
      return;
    }

    setIsSubmitting(true);
    if(selectedRole === 'USER' || selectedRole === 'GUEST'){
    try{
      try{
        toast.loading("Sending request...");

        const response = await fetch('/api/register-user', {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
          },
          body: JSON.stringify({
            firstName: form.getValues('fName'),
            secondName: form.getValues('sName'),
            email,
            password: process.env.NEXT_PUBLIC_USER_SECRET!,
            phoneNumber: form.getValues('phoneNo'),
            // userRole: selectedRole,
          }),
        });

        toast.dismiss();

        // Check response status and act accordingly
        if (response.ok && response.status === 200 || response.status === 201) {
          toast.success('User Registered Successfully');
        } else if (response.status === 400) {
          const errorData = await response.json();
          toast.error(errorData.error);
        } else if (response.status === 409) {
          toast.error('User with these credentials already exists');
        } else {
          toast.error('Unexpected error occurred');
        }
      }catch(error){
        toast.dismiss();
        toast.error('Failed to send request. Please try again.');
      }
    } catch (error) {
      toast.dismiss();
      toast.error('Something went wrong');
    } finally {
      toggleLoading();
      setIsSubmitting(false);
    }
  };
  if(selectedRole === 'ADMIN' || selectedRole === 'POLICE' || selectedRole === 'AMBULANCE' || selectedRole === 'CARRIER'){
    try{
      toast.loading("Sending request...");

      const response = await fetch('/api/register-staff', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          firstName: form.getValues('fName'),
          secondName: form.getValues('sName'),
          email,
          password: process.env.NEXT_PUBLIC_USER_SECRET!,
          phoneNumber: form.getValues('phoneNo'),
          userRole: selectedRole,
        }),
      });

      toast.dismiss();

      // Check response status and act accordingly
      if (response.ok && response.status === 200 || response.status === 201) {
        toast.success(`${selectedRole} Registered Successfully`);
      } else if (response.status === 400) {
        const errorData = await response.json();
        toast.error(errorData.error);
      } else if (response.status === 409) {
        toast.error('Staff with these credentials already exists');
      } else {
        toast.error('Unexpected error occurred');
      }
    }catch(error){
      console.error('Error creating staff:', error);
    }finally{
      toggleLoading();
  }
  };
};

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create User</DialogTitle>
          <DialogDescription>
            Add a new user to the system
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="fName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="sName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Second Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="john.doe@university.edu"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="userRole"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="ADMIN">Admin</SelectItem>
                      <SelectItem value="CARRIER">Carrier</SelectItem>
                      <SelectItem value="POLICE">Police</SelectItem>
                      <SelectItem value="AMBULANCE">Ambulance</SelectItem>
                      <SelectItem value="USER">User</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phoneNo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone No</FormLabel>
                  <FormControl>
                    <Input placeholder="0700000000" maxLength={10} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button disabled={isSubmitting} type="submit" onClick={() => handleSubmit()}>Create User</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}