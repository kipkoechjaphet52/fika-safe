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
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const formSchema = z.object({
  delete: z.string().min(1, "Delete Statment is required"),
});

interface DeleteResponseDialogProps {
    open: boolean;
    id: string;
}
export default function DeleteResponseDialog({open, id}: DeleteResponseDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      delete: "",
    },
  });

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

  const handleDelete = async () => {
    try{
      toast.loading('Sending Request...');
      const response = await fetch('/api/delete-incident', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(
          {
            reportId: id,
            confirmation: form.getValues("delete"),
          }
        ),
      });

      toast.dismiss();

      const data = await response.json();
      if(response.ok && response.status === 200){
        toast.success(data.message);
      }else if (response.status === 400){
        const errorData = await response.json();
        toast.error(errorData.error);
      } else {
        toast.error('Failed to delete response');
      }
      
    }catch(error){
      console.error('Error Deleting response: ',error);
      toast.error('An error occurred while deleting response');
    }
  };
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Response</DialogTitle>
          <DialogDescription>
            Delete a response
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="delete"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Delete Response. Type &quot;DELETE RESPONSE&quot;</FormLabel>
                  <FormControl>
                    <Input placeholder="DELETE RESPONSE" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" className="bg-destructive items-center" onClick={() => handleDelete()}>Delete Response</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
