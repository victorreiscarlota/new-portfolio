'use client';
import React, { useEffect, useState } from "react";
import LoadingSpinner from "./pages/loading-globe";
import { Nav } from "./pages/nav";
import { Scroll } from "./pages/scroll";
import { Beams } from "./pages/beams";
import { Banner } from "@/components/ui/music-banner";
import { Apple } from "./pages/apple-carousel";
import { ThemeToggle } from "@/components/theme-toggle"; 
import  ScrambleText  from "./pages/scramble";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 4500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="text-slate-700 dark:bg-gray-900 dark:text-gray-300 xl">
      <LoadingSpinner isLoading={isLoading} />
      
      {!isLoading && (
        <>
          <Nav />
          <ThemeToggle />
          <ScrambleText/>
          <Banner />
          <Scroll />
          <Beams />
          <Apple/>
        </>
      )}
    </div>
  );
}