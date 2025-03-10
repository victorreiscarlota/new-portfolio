"use client";
import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

const transition = {
    type: "spring",
    bounce: 0.4,
    stiffness: 300,
    damping: 15,
    restDelta: 0.001,
};

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
};

const childVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { type: "spring", bounce: 0.4, duration: 0.5 },
    },
};

export const MenuItem = ({
    setActive,
    active,
    item,
    children,
    isWide = false,
}: {
    setActive: (item: string | null) => void;
    active: string | null;
    item: string;
    children?: React.ReactNode;
    isWide?: boolean;
}) => {
    return (
        <div
            onMouseEnter={() => setActive(item)}
            onMouseLeave={() => setActive(null)}
            className="relative z-50 cursor-pointer"
        >
            <motion.div
                whileHover={{
                    scale: 1.05,
                    transition: { duration: 0.2 }
                }}
                className="text-black dark:text-[#3dbfc2] px-3 py-1 rounded-lg hover:bg-red-100 dark:hover:bg-[#3dbfc2]/20 transition-colors duration-300"
            >
                {item}
            </motion.div>

            <AnimatePresence>
                {active === item && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scaleY: 0.9 }}
                        animate={{ opacity: 1, y: 0, scaleY: 1 }}
                        exit={{ opacity: 0, y: 10, scaleY: 0.9 }}
                        transition={transition}
                        className="absolute top-full pt-2"
                        style={{
                            zIndex: 9999,
                            left: isWide ? '-600%' : '0%',
                            transform: isWide ? 'translateX(-50%)' : 'none',
                            maxWidth: isWide ? '750px' : '300px',
                            width: '100vw'
                        }}
                    >
                        <div className={`px-4 w-full mx-auto ${isWide ? 'max-w-screen-xl' : 'max-w-xs'}`}>
                            <motion.div
                                className="bg-white dark:bg-[#0d1b2a] backdrop-blur-sm rounded-2xl overflow-visible border border-black/[0.1] dark:border-black/30 shadow-xl transition-colors duration-300"
                                layoutId="active"
                            >
                                <div className="p-4">
                                    {children}
                                </div>
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
    const [isClicked, setIsClicked] = useState(false);
    const [isDesktop, setIsDesktop] = useState(true);
    const { scrollY } = useScroll();
    const opacity = useTransform(scrollY, [0, 50], [1, 0.7]);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const mediaQuery = window.matchMedia("(min-width: 768px)");
        
        const handleResize = () => {
            const matches = mediaQuery.matches;
            setIsDesktop(matches);
            if (!matches) setActive(null);
        };

        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [setActive]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsClicked(false);
                setActive(null);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [setActive]);

    return (
        <motion.nav
            ref={menuRef}
            initial={false}
            animate={{
                width: isClicked ? "auto" : 120,
                height: isClicked ? "auto" : 48,
                borderRadius: 22,
                transition: {
                    type: "spring",
                    bounce: 0.4,
                    stiffness: 300,
                    damping: 15,
                }
            }}
            style={{ 
                originX: 0.5,
                originY: 0.5,
                opacity
            }}
            className="nav-container clickable fixed left-1/2 top-4 -translate-x-1/2 transform border dark:border-black/30 bg-white dark:bg-[#0d1b2a] shadow-xl flex items-center justify-center z-50 cursor-pointer transition-colors duration-300"
            onClick={() => setIsClicked(!isClicked)}
        >
            <motion.div
                className="absolute flex space-x-1"
                animate={{
                    opacity: isClicked ? 0 : 1,
                    scale: isClicked ? 0 : 1,
                }}
            >
                {[...Array(3)].map((_, i) => (
                    <motion.span
                        key={i}
                        className="w-2 h-2 bg-blue-500 dark:bg-[#3dbfc2] rounded-full"
                        animate={{
                            y: [0, -8, 0],
                            scale: [1, 1.3, 1]
                        }}
                        transition={{
                            duration: 1,
                            repeat: Infinity,
                            delay: i * 0.15
                        }}
                    />
                ))}
            </motion.div>

            <AnimatePresence>
                {isClicked && (
                    <motion.div
                        key="content"
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={transition}
                        className="flex space-x-4 px-8 py-6 items-center relative"
                    >
                        <motion.button
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsClicked(false);
                                setActive(null);
                            }}
                            className="absolute -top-3 -right-3 p-1.5 bg-white dark:bg-[#0d1b2a] rounded-full border shadow-lg hover:bg-red-50 dark:hover:bg-[#3dbfc2]/20 transition-colors duration-300"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-6 h-6 text-red-600 dark:text-[#3dbfc2]"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </motion.button>

                        <motion.div
                            className="flex space-x-4 [&>*:not(:last-child)]:border-r [&>*:not(:last-child)]:border-gray-300 dark:[&>*:not(:last-child)]:border-black/30"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                        >
                            {React.Children.map(children, (child) => (
                                <motion.div 
                                    variants={childVariants}
                                    className="pr-4"
                                >
                                    {child}
                                </motion.div>
                            ))}
                        </motion.div>
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
        <Link href={href} className="clickable flex space-x-2 group">
            <motion.div
                whileHover={{
                    scale: 1.02,
                    transition: { duration: 0.2 }
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
                    <h4 className="text-xl font-bold mb-1 text-black dark:text-[#3dbfc2] group-hover:text-red-600">
                        {title}
                    </h4>
                    <p className="text-neutral-700 text-sm dark:text-[#3dbfc2] group-hover:text-red-500 line-clamp-3">
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
                scale: 1.05,
                transition: { duration: 0.2 }
            }}
        >
            <Link
                {...rest}
                className="clickable text-neutral-700 dark:text-[#3dbfc2] hover:text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 transition-colors duration-300"
            >
                {children}
            </Link>
        </motion.div>
    );
};