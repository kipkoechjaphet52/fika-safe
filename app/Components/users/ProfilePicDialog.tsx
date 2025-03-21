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
import { z } from "zod";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import Image from "next/image";

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
  const [imageUrl, setImageUrl] = useState('');

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
          <Button variant='outline' disabled={disabled} onClick={handleButtonClick}>Select an Avatar</Button>
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

    useEffect(() => {
        const validateImage = (file: File): "IMAGE" | "invalid" => {
            if (!file) return "invalid";
        
            const imageTypes = ["image/png", "image/jpeg", "image/jpg", "image/gif", "image/webp"];
        
            if (imageTypes.includes(file.type)) {
            return "IMAGE";
            }
            return "invalid"; // Not an image
        };
        
        const validateImageExtension = (fileName: string): "IMAGE" | "invalid" => {
            const imageExtensions = [".png", ".jpg", ".jpeg", ".gif", ".webp"];
        
            const ext = fileName.slice(fileName.lastIndexOf(".")).toLowerCase();
        
            if (imageExtensions.includes(ext)) return "IMAGE";
            return "invalid";
        };
        
        // We use the two functions above to validate the image, this prevents spoofing
        const validateImageUpload = (file: File): "IMAGE" | "invalid" => {
            const validMimeType = validateImage(file);
            const validExtension = validateImageExtension(file.name);
        
            if (validMimeType === validExtension) { // Compares the value from the two functions, if they match, it's valid
            return validMimeType;
            }
            return "invalid"; // Mismatch in extension and MIME type
        };
        const mediaType = file ? validateImageUpload(file) : "invalid";
    
        // Upload file to Cloudinary
        const handleUpload = async () => {
            if (!file) return;
            if (mediaType === "invalid") {
            toast.error('Invalid file type');
            return;
            }
    
            const formData = new FormData();
            formData.append("file", file);
    
            try {
                toggleLoading();
                toast.loading('Uploading avatar...');
                const res = await fetch('/api/upload', {
                    method: 'POST',
                    body: formData,
                });
                
                const data = await res.json();
                if (data.url) {
                    toast.dismiss();
                    toast.success('Avatar uploaded successfully');
                    setImageUrl(data.url);
                }
            } catch (error) {
                toast.error('Error uploading avatar');
                console.error('Upload failed', error);
                toggleLoading();
            } finally {
                toggleLoading();
            }
        };
        handleUpload();
    },[file]);

    const handleProfilePic = async () => {
        if(!imageUrl){
            toast.error("Please select an image to upload");
            return;
        }
        try{
            toggleLoading();
            toast.loading("Updating profile...");
            const response = await fetch("/api/update-avatar", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    url: imageUrl,
                }),
            });
            toast.dismiss();
            const data = await response.json();
            if(response.ok || response.status === 200){
                toast.success(data.message);
                onClose();
            } else if(response.status === 400){
                toast.error(data.message);
            } else{
                toast.error(data.message);
            }
        }catch(error){
            toast.error("Error uploading your avatar")
            console.error("Error uploading avatar: ", error);
        } finally {
            toggleLoading();
        }
    };    

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Profile Picture</DialogTitle>
          <DialogDescription>
            Change your existing profile picture or upload a new one
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 mt-4">
                <Image src={file ? URL.createObjectURL(file) : "/avatar.png"} alt="avatar" className="w-36 h-36 rounded-lg object-contain" width={500} height={500}/>
                <h1>{file?.name}</h1>
            </div>
          </DialogDescription>
        </DialogHeader>
            <DialogFooter>
              <ChangeAvatarButton/>
              <Button type="submit" className=" items-center" disabled={disabled} onClick={handleProfilePic} >Upload Avatar</Button>
            </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}