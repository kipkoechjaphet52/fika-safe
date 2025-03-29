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

interface DeleteResponseDialogProps {
    isOpen: boolean;
    onClose: () => void;
    id: string;
}
export default function RespondDialog({isOpen, onClose, id}: DeleteResponseDialogProps) {
//   const [isOpen, setIsOpen] = useState(false);

  const handleResponse = async () => {
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Respond to this incident</DialogTitle>
          <DialogDescription>
            Please confirm your response to this incident
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
        <Button className="items-center" onClick={onClose}>Cancel Response</Button>
        <Button type="submit" className="bg-destructive items-center" onClick={() => handleResponse()}>Yes, I am Responding</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
