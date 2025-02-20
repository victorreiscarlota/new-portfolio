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