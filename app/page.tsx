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





// 'use client'

// import { useState, useRef } from 'react'
// import { AnimatePresence } from 'framer-motion'
// import { CreativeLoader, CreativeLoaderHandle } from '@/components/ui/loader'
// import { Nav } from './pages/nav'
// import { Scroll } from './pages/scroll'
// import { Beams } from './pages/beams'
// import { Card } from './pages/card'
// import { AnimatedPin } from './pages/animated-pin'

// export default function Home() {
//   const [isLoading, setIsLoading] = useState(true)
//   const loaderRef = useRef<CreativeLoaderHandle>(null)

//   return (
//     <div className="text-slate-700 xl">
//       <AnimatePresence mode="wait">
//         {isLoading && (
//           <CreativeLoader
//             ref={loaderRef}
//             onComplete={() => setIsLoading(false)}
//             duration={4.5}
//           />
//         )}
//       </AnimatePresence>

//       {!isLoading && (
//         <>
//           <Nav />
//           <Scroll />
//           <Beams />
//           <Card />
//           <AnimatedPin />
//         </>
//       )}
//     </div>
//   )
// }