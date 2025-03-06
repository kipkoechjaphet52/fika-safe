"use client";

import { Button } from "@/app/Components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import { Textarea } from "./ui/textarea";
import Input from "./Input";

const formSchema = z.object({
  incidentType: z.string(),
  severity: z.string(),
  description: z.string(),
  file: z.string(),
});

export function IncidentReport() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const file = form.watch('file');
  console.log(file);
  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Report an Incident</CardTitle>
        <CardDescription>Submit a new incident report</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="incidentType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Incident Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
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
            <FormField
              control={form.control}
              name="file"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Upload File</FormLabel>
                  <Input
                    label={""} placeholder={""} id='File'
                    type="file"
                    required
                    accept="image/*, video/*"
                    {...field}                  
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                    <Textarea 
                    placeholder="Describe the incident"
                    className="h-64"
                    {...field}                    
                    />                  
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">Submit Report</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}