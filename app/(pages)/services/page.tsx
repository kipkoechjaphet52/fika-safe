import Header from "@/app/Components/Header";
import Footer from "@/app/Components/Footer";
import Services from "@/app/Components/Services";
import ChatButton from "@/app/Components/ChatButton";


export default function Home() {
  return (
    <>
      <div className="w-full h-full">
        <Header/>
        <Services/>
        <Footer/>
        <ChatButton/>
      </div>
    </>
  );
}
