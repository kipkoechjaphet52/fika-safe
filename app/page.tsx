import Image from "next/image";
import AuthForm from "./Components/AuthForm";
import { ShieldPlusIcon } from "lucide-react";
import { ThemeToggle } from "./Components/ThemeToggle";
import Header from "./Components/Header";

export default function Home() {
  return (
    <>
      <div className="w-full h-full">
        <Header/>
      </div>
    </>
  );
}

{/* <div className="w-full h-screen flex items-center justify-center">
        <div className="absolute top-0 right-0 m-4 ">
          <ThemeToggle/>
        </div>
          <div className="w-full h-full flex flex-col items-center justify-center">
            <div className="flex items-center gap-2 px-2 mx-auto pt-1">
              <ShieldPlusIcon className="h-6 w-6" />
              <span className="font-semibold">Fika Safe</span>
            </div>
            <div className="">
              <AuthForm></AuthForm>
            </div>
          </div>
      </div> */}