"use client";
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LoadingSpinner({ isLoading }: { isLoading: boolean }) {
    const [progress, setProgress] = useState(0);
    const [phase, setPhase] = useState(0);

    useEffect(() => {
        if (isLoading) {
            const interval = setInterval(() => {
                setProgress((prev) => Math.min(prev + 1, 100));
            }, 30);
            return () => clearInterval(interval);
        }
    }, [isLoading]);

    useEffect(() => {
        if (progress === 100) {
            setPhase(1);
            setTimeout(() => setPhase(2), 800);
        }
    }, [progress]);

    return (
        <AnimatePresence>
            {phase !== 2 && (
                <motion.div
                    className="fixed inset-0 bg-[#020617] flex flex-col items-center justify-center z-50"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {/* Spinner Container */}
                    <motion.div
                        className="flex space-x-2 mb-4"
                        animate={phase === 0 ? {} : { scale: 5, rotate: 360 }}
                        transition={{ duration: 0.8, ease: "circInOut" }}
                    >
                        {[...Array(3)].map((_, i) => (
                            <motion.div
                                key={i}
                                className="w-4 h-4 bg-blue-400 rounded-full"
                                animate={{
                                    y: [0, -15, 0],
                                    scale: [1, 1.4, 1],
                                    backgroundColor: ["#60a5fa", "#3b82f6", "#60a5fa"]
                                }}
                                transition={{
                                    duration: 1.2,
                                    repeat: Infinity,
                                    delay: i * 0.2
                                }}
                            />
                        ))}
                    </motion.div>

                    {/* Percentage Text */}
                    <motion.div
                        className="text-2xl font-semibold text-blue-400"
                        animate={{
                            opacity: [0.8, 1, 0.8],
                            scale: [1, 1.05, 1]
                        }}
                        transition={{
                            duration: 1.5,
                            repeat: Infinity
                        }}
                    >
                        {progress}%
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}




// // components/LoadingSpinner.tsx
// "use client";
// import { useEffect, useState } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';

// export default function LoadingSpinner({ isLoading }: { isLoading: boolean }) {
//   const [progress, setProgress] = useState(0);
//   const [phase, setPhase] = useState(0);
//   const [selectedBall, setSelectedBall] = useState(0);

//   useEffect(() => {
//     if (isLoading) {
//       const interval = setInterval(() => {
//         setProgress((prev) => {
//           if (prev >= 100) {
//             clearInterval(interval);
//             return 100;
//           }
//           return prev + 1;
//         });
//       }, 30);
//       return () => clearInterval(interval);
//     }
//   }, [isLoading]);

//   useEffect(() => {
//     if (progress === 100) {
//       setPhase(1);
//       setTimeout(() => {
//         setSelectedBall(Math.floor(Math.random() * 3));
//         setPhase(2);
//       }, 500);
//     }
//   }, [progress]);

//   return (
//     <AnimatePresence>
//       {phase !== 2 && (
//         <motion.div
//           className="fixed inset-0 bg-[#020617] flex flex-col items-center justify-center z-50 overflow-hidden"
//           initial={{ opacity: 1 }}
//           exit={{ opacity: 0 }}
//           transition={{ duration: 0.8 }}
//         >
//           {/* Main Spinner */}
//           <motion.div className="flex space-x-2 mb-4 relative">
//             {[...Array(3)].map((_, i) => (
//               <motion.div
//                 key={i}
//                 className="w-4 h-4 bg-blue-400 rounded-full relative"
//                 animate={{
//                   y: phase === 0 ? [0, -15, 0] : 0,
//                   scale: phase === 0 ? [1, 1.4, 1] : i === selectedBall ? 1 : 0,
//                   backgroundColor: phase === 0 
//                     ? ["#60a5fa", "#3b82f6", "#60a5fa"] 
//                     : "#3b82f6",
//                   borderRadius: phase === 1 ? [20, 50, 20] : 20
//                 }}
//                 transition={{
//                   duration: phase === 0 ? 1.2 : 0.8,
//                   repeat: phase === 0 ? Infinity : 0,
//                   delay: phase === 0 ? i * 0.2 : 0,
//                   ease: "anticipate"
//                 }}
//               />
//             ))}
//           </motion.div>

//           {/* Percentage Text */}
//           <motion.div
//             className="text-2xl font-semibold text-blue-400 absolute bottom-8"
//             animate={{
//               opacity: phase === 0 ? 1 : 0,
//               y: phase === 0 ? 0 : 20
//             }}
//             transition={{ duration: 0.3 }}
//           >
//             {progress}%
//           </motion.div>

//           {/* Droplet Transition */}
//           <AnimatePresence>
//             {phase === 1 && (
//               <motion.div
//                 className="absolute w-64 h-64 bg-blue-400 rounded-full"
//                 initial={{ 
//                   scale: 0,
//                   borderRadius: 100,
//                   opacity: 0
//                 }}
//                 animate={{
//                   scale: 25,
//                   borderRadius: 0,
//                   opacity: 1
//                 }}
//                 exit={{ opacity: 0 }}
//                 transition={{ 
//                   duration: 1.2,
//                   ease: [0.87, 0, 0.13, 1]
//                 }}
//               />
//             )}
//           </AnimatePresence>
//         </motion.div>
//       )}
//     </AnimatePresence>
//   );
// }