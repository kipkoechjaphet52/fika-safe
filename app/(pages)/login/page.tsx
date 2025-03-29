import { ShieldCheck } from "lucide-react";
import { ThemeToggle } from "@/app/Components/ThemeToggle";
import StaffAuthForm from "@/app/Components/responder/StaffAuthForm";

export default function StaffLoginPage() {
  return (
    <>
      <div className="w-full h-screen flex items-center justify-center">
        <div className="absolute top-0 right-0 border-2 border-gray-100 rounded-lg m-4 ">
          <ThemeToggle/>
        </div>
          <div className="w-full h-full flex flex-col items-center justify-center">
            <div className="flex items-center gap-2 px-2 mx-auto pt-1">
              <ShieldCheck className="h-6 w-6" />
              <span className="font-semibold">Fika Safe</span>
            </div>
            <div className="">
              <StaffAuthForm/>
            </div>
          </div>
      </div>
    </>
  );
}
