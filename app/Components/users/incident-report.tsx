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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/app/Components/ui/form";
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
import { Textarea } from "../ui/textarea";
import Input from "../Input";
import { useEffect, useState } from "react";
import { IncidentType, MediaType, SeverityLevel, VerificationStatus } from "@prisma/client";
import toast from "react-hot-toast";
import { fromLonLat } from "ol/proj";
import { set } from "ol/transform";
import { uploadFileAction } from "@/app/lib/action";

const formSchema = z.object({
  incidentType: z.string().min(1, "Incident type is required"),
  severity: z.string().min(1, "Severity level is required"),
  description: z.string().min(5, "Description must be at least 5 characters"),
  file: z.string().optional(),
});

interface Report {
  id: string;
  createdAt: Date;
  userId: string;
  title: string;
  location: string;
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
export function IncidentReport({selectedReport, onUpdate}: {selectedReport: Report | null, onUpdate: () => void}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const [disabled, setDisabled] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [street, setStreet] = useState("");
  const [title, setTitle] = useState("");
  const [mediaType, setMediaType] = useState<MediaType | string>('');
  const [fileUrl, setFileUrl] = useState('');
  const [longitude, setLongitude] = useState(0);
  const [latitude, setLatitude] = useState(0);
  const [reportId, setReportId] = useState('');
  const [loading, setLoading] = useState(false);

  const incidentType = form.watch('incidentType');
  const severity = form.watch('severity');
  const description = form.watch('description');
  
  useEffect(() => {
    if(selectedReport){
      setReportId(selectedReport.id);
      setTitle(selectedReport.title);
      setStreet(selectedReport.location);
      setFileUrl(selectedReport.mediaUrl || '');
      setMediaType(selectedReport.mediaType);
      form.setValue('incidentType', selectedReport.type);
      form.setValue('severity', selectedReport.severity);
      form.setValue('description', selectedReport.description);
    }
  },[selectedReport, form]);

  // Check if the file is an image or video and get user coordinates
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setLatitude(latitude);
        setLongitude(longitude);
      },
      (error) => {
        console.error("Error getting location:", error);
      },
      { enableHighAccuracy: true }
    );
    
    const validateFile = (file: File): "IMAGE" | "VIDEO" | "invalid" => {
      if (!file) return "invalid";
    
      const imageTypes = ["image/png", "image/jpeg", "image/jpg", "image/gif", "image/webp"];
      const videoTypes = ["video/mp4", "video/webm", "video/ogg", "video/mov", "video/avi"];
    
      if (imageTypes.includes(file.type)) {
        return "IMAGE";
      }
      if (videoTypes.includes(file.type)) {
        return "VIDEO";
      }
      return "invalid"; // Not an image or video
    };
  
    const validateFileExtension = (fileName: string): "IMAGE" | "VIDEO" | "invalid" => {
      const imageExtensions = [".png", ".jpg", ".jpeg", ".gif", ".webp"];
      const videoExtensions = [".mp4", ".webm", ".ogg", ".mov", ".avi"];
    
      const ext = fileName.slice(fileName.lastIndexOf(".")).toLowerCase();
    
      if (imageExtensions.includes(ext)) return "IMAGE";
      if (videoExtensions.includes(ext)) return "VIDEO";
      return "invalid";
    };
  
    // We use the two functions above to validate the file, this prevents spoofing
    const validateFileUpload = (file: File): "IMAGE" | "VIDEO" | "invalid" => {
      const validMimeType = validateFile(file);
      const validExtension = validateFileExtension(file.name);
    
      if (validMimeType === validExtension) { // Compares the value from the two functions, if they match, it's valid
        return validMimeType;
      }
      return "invalid"; // Mismatch in extension and MIME type
    };
    const mediaType = file ? validateFileUpload(file) : "invalid";
    setMediaType(mediaType);

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
        toast.loading('Uploading file...');
        // const results = await uploadFileAction(formData);
        // if (results) {
        //   toast.dismiss();
        //   toast.success('File uploaded successfully');
        //   setFileUrl(results);
        // }

        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        
        let data;
        try {
          data = await res.json();
        } catch (e) {
          toast.dismiss();
          console.error("Upload failed: Invalid JSON response", e);
          toast.error("Unexpected response from server");
          return;
        }

        toast.dismiss();
        if(res.ok || res.status == 200 || res.status == 201){
          toast.success('File uploaded successfully');
          setFileUrl(data.url);
        } else if (res.status === 400) {
          toast.error('File is Required');
        } else {
          toast.error('Error submitting report');
        }
      } catch (error) {
        toast.dismiss();
        toast.error('Error uploading file');
        console.error('Upload failed', error);
      }
    };
    handleUpload();
  }, [file]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  const handleSubmit = async () => {
    if (selectedReport) {
      // Edit existing task
      try {
        toast.loading("Updating task...");
        const response = await fetch('/api/update-incident', {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: reportId,
            title,
            location: street,
            description,
            type: incidentType,
            severity,
            mediaUrl: fileUrl,
            mediaType,
          }),
        });
        
        toast.dismiss()
        if (response.ok) {
          toast.success("Task updated successfully");
          onUpdate();
          setLoading(false);
          setFile(null);
          setTitle("");
          setStreet("");
          setFileUrl("");
          setMediaType("");
          setReportId("");
          form.reset({
            incidentType: "",
            severity: "",
            description: "",
            file: "",
          });
        } else {
          toast.error("Failed to update task");
          setDisabled(false)
        }
      } catch (error) {
        console.error("Error updating task:", error);
        toast.error("Error updating task");
      }
    } else {
      const reportData = {
        title, 
        location: street,
        latitude,
        longitude,
        description: description,
        type: incidentType,
        severity: severity,
        mediaUrl: fileUrl,
        mediaType: mediaType,
      };

      try{
        setDisabled(true);
        toast.loading('Submitting report...');
        const response = await fetch('/api/create-report', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(reportData),
        });
        
        toast.dismiss();
        if (response.ok || response.status === 200 || response.status === 201) {
          toast.success('Report submitted successfully');
          setDisabled(false);
        } else if (response.status === 400) {
          toast.error('Please fill all the fields');
          setDisabled(false);
        } else{
          toast.error('Error submitting report');
          setDisabled(false);
        }
      }catch(error){
        toast.dismiss();
        toast.error('Error submitting report');
        console.error("Error submitting report: ", error);
        setDisabled(false);
      }
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{selectedReport ? "Edit Incident Report" : "Report an Incident"}</CardTitle>
        <CardDescription>{selectedReport ? "Modify the report details" : "Submit a new incident report"}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <Input
              id='Title'
              name="title"
              label={"Incident Title"} 
              placeholder={"Enter title name"} 
              type="text"
              required
              disabled={disabled}
              value = {title}
              onChange={(e) => setTitle(e.target.value)}                  
            />
            <Input
              id='Street'
              name="street"
              label={"Street Name"} 
              placeholder={"Enter street name"} 
              type="text"
              required
              disabled={disabled}
              value = {street}
              onChange={(e) => setStreet(e.target.value)}                  
            />
            <FormField
              control={form.control}
              name="incidentType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Incident Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type of incident" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="THEFT">Theft</SelectItem>
                      <SelectItem value="ASSAULT">Assault</SelectItem>
                      <SelectItem value="ACCIDENT">Accident</SelectItem>
                      <SelectItem value="FIRE">Fire</SelectItem>
                      <SelectItem value="MEDICAL">Medical</SelectItem>
                      <SelectItem value="OTHER">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="severity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Incident Severity</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a level of severity" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="LOW">Low</SelectItem>
                      <SelectItem value="MEDIUM">Medium</SelectItem>
                      <SelectItem value="HIGH">High</SelectItem>
                      <SelectItem value="CRITICAL">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Input
              id='File'
              name="file"
              label={"Upload File"} 
              placeholder={"Select an image or video"} 
              type="file"
              required
              disabled={disabled}
              accept="image/*, video/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}                  
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                    <Textarea 
                    placeholder="Describe the incident"
                    className="h-40"
                    {...field}                    
                    />                  
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button disabled={disabled} type="submit" onClick={() => handleSubmit()} className="w-full">
            {selectedReport ? "Update Report" : "Submit Report"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
