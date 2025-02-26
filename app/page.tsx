import Image from "next/image";
import AuthForm from "./Components/AuthForm";
import { ShieldPlusIcon } from "lucide-react";
import { ThemeToggle } from "./Components/ThemeToggle";

export default function Home() {
  return (
    <>
      <div className="w-full h-screen flex items-center justify-center">
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
      </div>
    </>
  );
}


{/* <div className="w-full h-screen flex items-center justify-center">
  <div className="absolute inset-0">
    <Image src={Map} alt="Background" layout="fill" objectFit="cover" className="opacity-30" />
    <div className="absolute inset-0 bg-gray-900 opacity-20"></div>
  </div>
  <div className="relative z-10 w-full h-full flex flex-col items-center justify-center">
    <div className="absolute top-0 right-0 border-2 border-gray-100 rounded-lg m-4">
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
  </div>
</div> */}
