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
} from "@/app/Components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { on } from "events";

const formSchema = z.object({
  delete: z.string().min(1, "Delete Statment is required"),
});

interface UpdateEmailDialogProps {
  open: boolean;
  newEmail: string;
  onClose: () => void;
}

export function UpdateEmailDialog({ open, newEmail, onClose}: UpdateEmailDialogProps) {
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);

  const toggleLoading = () => {
    setLoading((prev) => !prev);
  }

  useEffect(() => {
    setDisabled(loading);
  }, [loading]);

  const handleEmailUpdate = async () => {
    toggleLoading();
    try{
      toast.loading("Updating email...");
      const response = await fetch("/api/update-email", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          newEmail,
        }),
      });
      const data = await response.json(); 

      toast.dismiss();
      if(response.ok || response.status === 200){
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    }catch(error){
        setLoading(false);
        console.error("Error updating email: ", error);
    } finally {
        toggleLoading();
        onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Email</DialogTitle>
          <DialogDescription>
            Change your existing email to a new one
          </DialogDescription>
        </DialogHeader>
            <DialogFooter>
              <Button type="submit" className="bg-destructive items-center" disabled={disabled} onClick={handleEmailUpdate}>Update Email</Button>
              <Button type="submit" className=" items-center" disabled={disabled} onClick={onClose}>Cancel</Button>
            </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}