"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

const DragScroll = ({ hide }: { hide: boolean }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [isHidden, setIsHidden] = useState(false);
    const startY = useRef(0);
    const dragElementRef = useRef<HTMLDivElement>(null);

    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const smoothX = useSpring(mouseX, { stiffness: 500, damping: 30 });
    const smoothY = useSpring(mouseY, { stiffness: 500, damping: 30 });

    useEffect(() => {
        document.body.classList.add('overflow-hidden');
        return () => document.body.classList.remove('overflow-hidden');
    }, []);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);

            const target = e.target as HTMLElement;
            const isOverClickable = target.closest('.clickable, .nav-container, a, button, [role="button"]');
            setIsHidden(!!isOverClickable);

            if (isDragging) {
                const deltaY = e.clientY - startY.current;
                window.scrollBy(0, -deltaY * 2.5);
                startY.current = e.clientY;
            }
        };

        const handleMouseDown = (e: MouseEvent) => {
            if (dragElementRef.current?.contains(e.target as Node)) {
                setIsDragging(true);
                startY.current = e.clientY;
                e.preventDefault();
            }
        };

        const handleMouseUp = () => setIsDragging(false);

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mouseup', handleMouseUp);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mousedown', handleMouseDown);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, mouseX, mouseY]);

    if (hide || isHidden) return null;

    return (
        <motion.div
            ref={dragElementRef}
            className={`drag-scroll fixed w-20 h-20 rounded-full bg-gray-200/30 dark:bg-gray-800/50 backdrop-blur-md border-2 border-gray-300 dark:border-gray-600 pointer-events-auto flex items-center justify-center z-[9999] ${
                isDragging ? 'cursor-grabbing scale-125' : 'cursor-grab scale-100'
            }`}
            style={{
                x: smoothX,
                y: smoothY,
                translateX: '-50%',
                translateY: '-50%',
            }}
        >
            <div className="absolute -top-7 left-1/2 -translate-x-1/2">
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ 
                        opacity: isDragging ? 1 : 0,
                        y: isDragging ? 0 : -10
                    }}
                    transition={{ type: 'spring', stiffness: 300 }}
                >
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M5 15L12 8L19 15" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                </motion.div>
            </div>

            <div className="absolute -bottom-7 left-1/2 -translate-x-1/2">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ 
                        opacity: isDragging ? 1 : 0,
                        y: isDragging ? 0 : 10
                    }}
                    transition={{ type: 'spring', stiffness: 400 }}
                >
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M5 9L12 16L19 9" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                </motion.div>
            </div>

            
            <motion.div
                key={isDragging ? 'arrows' : 'text'}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 200 }}
                className="flex items-center justify-center"
            >
                {isDragging ? (
                    <div className="flex gap-2">
                        
                    </div>
                ) : (
                    <div className="text-sm uppercase font-medium flex flex-col items-center">
                        <span>Scroll</span>
                    </div>
                )}
            </motion.div>
        </motion.div>
    );
};

export default DragScroll;