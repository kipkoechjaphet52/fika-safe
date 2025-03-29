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
import { respondToAnIncident } from "@/app/lib/action";
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
      const response = await respondToAnIncident(id);

      toast.dismiss();

      if(response){
        toast.success('Response sent successfully');
        onClose();
      }else{
        toast.error('Failed to send response');
      }      
    }catch(error){
      console.error('Error Sending a response: ',error);
      toast.error('An error occurred while sending response');
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
        <Button type="submit" className="bg-destructive items-center" onClick={() => handleResponse()}>Confirm Response</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
