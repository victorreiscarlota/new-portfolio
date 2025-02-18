"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { IconAxe } from "@tabler/icons-react";

const transition = {
    type: "spring",
    mass: 0.5,
    damping: 12,
    stiffness: 150,
    restDelta: 0.001,
    restSpeed: 0.001,
};

export const MenuItem = ({
    setActive,
    active,
    item,
    children,
}: {
    setActive: (item: string) => void;
    active: string | null;
    item: string;
    children?: React.ReactNode;
}) => {
    return (
        <div 
            onMouseEnter={() => setActive(item)}
            className="relative z-50 cursor-pointer"
        >
            <motion.p
                whileHover={{
                    rotate: [-2, 2, -2],
                    scale: 1.05,
                    transition: { duration: 0.3 }
                }}
                className="text-black dark:text-white px-3 py-1 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors"
            >
                {item}
            </motion.p>
            
            <AnimatePresence>
                {active === item && (
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 15 }}
                        transition={transition}
                        className="absolute top-full pt-4"
                        style={{ 
                            zIndex: 9999,
                            left: '-600%', 
                            transform: 'translateX(50%)', 
                            width: '100vw',
                            maxWidth: '750px',
                        }}
                    >
                        <div className="px-4 w-full max-w-screen-2xl mx-auto">
                            <motion.div
                                className="bg-white dark:bg-black backdrop-blur-sm rounded-2xl overflow-visible border border-black/[0.1] dark:border-white/[0.1] shadow-xl"
                                layoutId="active"
                                style={{
                                    // maxWidth: '1400px',
                                    margin: '0 auto',
                                }}
                            >
                                <motion.div className="p-4">
                                    {children}
                                </motion.div>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
export const Menu = ({
    setActive,
    children,
}: {
    setActive: (item: string | null) => void;
    children: React.ReactNode;
}) => {
    const [isHovered, setIsHovered] = React.useState(false);

    return (
        <motion.nav
            initial={false}
            animate={{
                width: isHovered ? "auto" : 60,
                height: isHovered ? "auto" : 60,
                borderRadius: isHovered ? 28 : 20,
                transition: { 
                    type: "spring", 
                    bounce: 0.15,
                    duration: 0.5
                }
            }}
            className="fixed top-4 right-4 border dark:border-white/[0.2] bg-white dark:bg-black shadow-xl flex items-center justify-center z-50"
            style={{ originX: 0.85, originY: 0.15 }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => {
                setIsHovered(false);
                setActive(null);
            }}
        >
            <motion.div
                className="absolute flex space-x-1"
                animate={{
                    opacity: isHovered ? 0 : 1,
                    scale: isHovered ? 0 : 1,
                }}
            >
                {[...Array(3)].map((_, i) => (
                    <motion.span
                        key={i}
                        className="w-2 h-2 bg-blue-500 dark:bg-blue-400 rounded-full"
                        animate={{
                            y: [0, -10, 0],
                            scale: [1, 1.4, 1]
                        }}
                        transition={{
                            duration: 1.2,
                            repeat: Infinity,
                            delay: i * 0.2
                        }}
                    />
                ))}
            </motion.div>

            <AnimatePresence>
                {isHovered && (
                    <motion.div
                        key="content"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="flex space-x-4 px-8 py-6"
                    >
                        {children}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
};

export const ProductItem = ({
    title,
    description,
    href,
    src,
}: {
    title: string;
    description: string;
    href: string;
    src: string;
}) => {
    return (
        <Link href={href} className="flex space-x-2 group">
            <motion.div
                whileHover={{
                    rotate: [-1, 1, -1],
                    scale: 1.02,
                    transition: { duration: 0.3 }
                }}
                className="flex space-x-2 w-full"
            >
                <Image
                    src={src}
                    width={140}
                    height={70}
                    alt={title}
                    className="flex-shrink-0 rounded-md shadow-2xl object-cover"
                />
                <div className="flex-1 min-w-[120px]">
                    <h4 className="text-xl font-bold mb-1 text-black dark:text-white group-hover:text-red-600 dark:group-hover:text-red-300">
                        {title}
                    </h4>
                    <p className="text-neutral-700 text-sm dark:text-neutral-300 group-hover:text-red-500 line-clamp-3">
                        {description}
                    </p>
                </div>
            </motion.div>
        </Link>
    );
};

export const HoveredLink = ({ children, ...rest }: any) => {
    return (
        <motion.div
            whileHover={{
                rotate: [-1, 1, -1],
                scale: 1.05,
                transition: { duration: 0.3 }
            }}
        >
            <Link
                {...rest}
                className="text-neutral-700 dark:text-neutral-200 hover:text-red-600 dark:hover:text-red-300 px-4 py-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors"
            >
                {children}
            </Link>
        </motion.div>
    );
};