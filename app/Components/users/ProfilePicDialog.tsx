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
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { on } from "events";
import { signOut } from "next-auth/react";

const formSchema = z.object({
  delete: z.string().min(1, "Delete Statment is required"),
});

interface ProfilePicDialogProps {
  open: boolean;
  onClose: () => void;
}

export function ProfilePicDialog({ open, onClose}: ProfilePicDialogProps) {
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const toggleLoading = () => {
    setLoading((prev) => !prev);
  }

  useEffect(() => {
    setDisabled(loading);
  }, [loading]);

    const ChangeAvatarButton = () => {
        const fileInputRef = useRef<HTMLInputElement | null>(null);
        
        const handleButtonClick = () => {
            fileInputRef.current?.click();
        };
        
        const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
            const file = event.target.files?.[0];
            if (file) {
                setFile(file);
            // You can now upload or preview the image
            }
        };    
      return (
          <>
          <Button variant='outline' onClick={handleButtonClick}>Select an Avatar</Button>
          <input 
              type="file" 
              accept="image/*" 
              ref={fileInputRef} 
              className="hidden" 
              onChange={handleImageUpload} 
          />
          </>
        );
      };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Profile Picture</DialogTitle>
          <DialogDescription>
            Change your existing profile picture or upload a new one
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 mt-4">
                <img src={file ? URL.createObjectURL(file) : "/avatar.png"} alt="avatar" className="w-36 h-36 rounded-lg object-contain" />
                <h1>{file?.name}</h1>
            </div>
          </DialogDescription>
        </DialogHeader>
            <DialogFooter>
              <ChangeAvatarButton/>
              <Button type="submit" className=" items-center" disabled={disabled} onClick={onClose}>Upload</Button>
            </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}