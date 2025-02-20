'use client';
import React, { useEffect, useState } from "react";
import LoadingSpinner from "./pages/loading-globe";
import { Nav } from "./pages/nav";
import { Scroll } from "./pages/scroll";
import { Beams } from "./pages/beams";
import { Card } from "./pages/card";
import { AnimatedPin } from "./pages/animated-pin";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 4500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="text-slate-700 xl">
      <LoadingSpinner isLoading={isLoading} />
      
      {!isLoading && (
        <>
          <Nav />
          <Scroll />
          <Beams />
          <Card />
          <AnimatedPin />
        </>
      )}
    </div>
  );
}