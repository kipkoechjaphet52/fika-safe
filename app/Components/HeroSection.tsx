"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/app/Components/ui/button";

const images = [
  "/images/map_on_screen.jpg",
  "/images/cameras.jpg",
  "/images/Map_on_phone.jpg",
  "/images/calling_in_distress.jpg",
];

const Hero = () => {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative h-[calc(100vh-3.5rem)] overflow-hidden">
      {images.map((src, index) => (
        <Image
          key={src}
          src={src}
          alt={`BabyGal hero image ${index + 1}`}
          layout="fill"
          objectFit="cover"
          className={`transition-opacity duration-1000 ${
            index === currentImage ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-5xl font-bold mb-4">Witness Incidents As They Happen and Get Firsthand Reports From Those on The Scene</h1>
          <p className="text-xl mb-8">Stay informed with real-time updates and verified alerts</p>
          <Button size="lg">Report an Incident</Button>
        </div>
      </div>
    </section>
  );
};

export default Hero;