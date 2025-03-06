'use client'
import React, { useState, useRef, useEffect, createContext, useContext } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { IconX } from "@tabler/icons-react"
import Image, { ImageProps } from "next/image"
import { cn } from "@/lib/utils"
import { useOutsideClick } from "@/hooks/use-outside-click"

interface CarouselProps {
    items: JSX.Element[]
    initialScroll?: number
}

type Card = {
    src: string
    title: string
    category: string
    content: React.ReactNode
}

const DragIndicator = ({ visible }: { visible: boolean }) => {
    const [position, setPosition] = useState({ x: 0, y: 0 })
    const rafRef = useRef<number>()

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            cancelAnimationFrame(rafRef.current!)
            rafRef.current = requestAnimationFrame(() => {
                setPosition({ x: e.clientX + 15, y: e.clientY + 15 })
            })
        }

        if (visible) {
            window.addEventListener('mousemove', handleMouseMove)
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove)
            cancelAnimationFrame(rafRef.current!)
        }
    }, [visible])

    return (
        <div
            className="fixed z-50 pointer-events-none -translate-x-1/2 -translate-y-1/2 transition-opacity duration-150"
            style={{
                left: position.x,
                top: position.y,
                opacity: visible ? 1 : 0,
            }}
        >
            <div className="bg-black/80 backdrop-blur-sm px-6 py-2 rounded-full flex items-center gap-3 border-2 border-white/20 shadow-lg">
                <span className="text-sm font-medium text-white tracking-wider font-mono">DRAG</span>
                <div className="flex items-center gap-2">
                    <span className="text-white text-lg">◀</span>
                    <span className="text-white text-lg">▶</span>
                </div>
            </div>
        </div>
    )
}

interface CarouselContextType {
    onCardClose: (index: number) => void
    currentIndex: number
    startDrag: (e: React.MouseEvent) => void
    doDrag: (e: React.MouseEvent) => void
    endDrag: () => void
}

export const CarouselContext = createContext<CarouselContextType>({
    onCardClose: () => { },
    currentIndex: 0,
    startDrag: () => { },
    doDrag: () => { },
    endDrag: () => { },
})

export const Carousel = ({ items, initialScroll = 0 }: CarouselProps) => {
    const carouselRef = useRef<HTMLDivElement>(null)
    const [isDragging, setIsDragging] = useState(false)
    const [startX, setStartX] = useState(0)
    const [scrollLeft, setScrollLeft] = useState(0)

    const startDrag = (e: React.MouseEvent) => {
        if (!carouselRef.current) return
        setIsDragging(true)
        setStartX(e.pageX - carouselRef.current.offsetLeft)
        setScrollLeft(carouselRef.current.scrollLeft)
    }

    const doDrag = (e: React.MouseEvent) => {
        if (!isDragging || !carouselRef.current) return
        e.preventDefault()
        const x = e.pageX - carouselRef.current.offsetLeft
        const walk = (x - startX) * 3
        carouselRef.current.scrollLeft = scrollLeft - walk
    }

    const endDrag = () => {
        setIsDragging(false)
    }

    useEffect(() => {
        if (carouselRef.current) {
            carouselRef.current.scrollLeft = initialScroll
        }
    }, [initialScroll])

    return (
        <CarouselContext.Provider
            value={{
                onCardClose: () => { },
                currentIndex: 0,
                startDrag,
                doDrag,
                endDrag,
            }}
        >
            <div
                ref={carouselRef}
                className={cn(
                    "flex w-full overflow-x-scroll overscroll-x-auto py-10 md:py-20 scroll-smooth",
                    "scrollbar-hide snap-x",
                    isDragging ? "cursor-grabbing" : "cursor-grab"
                )}
                style={{ scrollBehavior: 'smooth' }}
            >
                <div className="flex flex-nowrap pl-4 pr-[20%]">
                    {items.map((item, index) => (
                        <motion.div
                            key={index}
                            className="snap-center flex-shrink-0 rounded-3xl overflow-hidden relative"
                            transition={{ type: "spring", stiffness: 300, damping: 15 }}
                        >
                            {React.cloneElement(item, { index })}
                        </motion.div>
                    ))}
                </div>
            </div>
        </CarouselContext.Provider>
    )
}

// export const Card = ({
//     card,
//     index,
//     layout = false,
// }: {
//     card: Card
//     index: number
//     layout?: boolean
// }) => {
//     const [open, setOpen] = useState(false)
//     const [showDrag, setShowDrag] = useState(false)
//     const [isDragging, setIsDragging] = useState(false)
//     const containerRef = useRef<HTMLDivElement>(null)
//     const { startDrag, doDrag, endDrag } = useContext(CarouselContext)

//     useEffect(() => {
//         const handleKeyDown = (e: KeyboardEvent) => {
//             if (e.key === 'Escape') handleClose()
//         }

//         if (open) {
//             document.body.style.overflow = 'hidden'
//             window.addEventListener('keydown', handleKeyDown)
//         } else {
//             document.body.style.overflow = 'auto'
//         }

//         return () => {
//             window.removeEventListener('keydown', handleKeyDown)
//         }
//     }, [open])

//     useOutsideClick(containerRef, () => handleClose())

//     const handleOpen = () => {
//         if (!isDragging) setOpen(true)
//     }

//     const handleClose = () => {
//         setOpen(false)
//     }

//     const handleMouseMove = (e: React.MouseEvent) => {
//         if (isDragging) doDrag(e)
//     }

//     return (
//         <>
//             <AnimatePresence>
//                 {open && (
//                     <div className="fixed inset-0 h-screen z-50 overflow-auto">
//                         <motion.div
//                             initial={{ opacity: 0 }}
//                             animate={{ opacity: 1 }}
//                             exit={{ opacity: 0 }}
//                             className="bg-black/80 backdrop-blur-lg h-full w-full fixed inset-0"
//                         />
//                         <motion.div
//                             initial={{ opacity: 0 }}
//                             animate={{ opacity: 1 }}
//                             exit={{ opacity: 0 }}
//                             ref={containerRef}
//                             className="max-w-5xl mx-auto bg-white dark:bg-neutral-900 h-fit z-[60] my-10 p-4 md:p-10 rounded-3xl font-sans relative"
//                         >
//                             <button
//                                 className="sticky top-4 h-8 w-8 right-0 ml-auto bg-black dark:bg-white rounded-full flex items-center justify-center"
//                                 onClick={handleClose}
//                             >
//                                 <IconX className="h-6 w-6 text-neutral-100 dark:text-neutral-900" />
//                             </button>
//                             <p className="text-base font-medium text-black dark:text-white">
//                                 {card.category}
//                             </p>
//                             <p className="text-2xl md:text-5xl font-semibold text-neutral-700 mt-4 dark:text-white">
//                                 {card.title}
//                             </p>
//                             <div className="py-10">{card.content}</div>
//                         </motion.div>
//                     </div>
//                 )}
//             </AnimatePresence>

//             <div
//                 ref={containerRef}
//                 className="relative"
//                 onMouseEnter={() => setShowDrag(true)}
//                 onMouseLeave={() => {
//                     setShowDrag(false)
//                     endDrag()
//                     setIsDragging(false)
//                 }}
//                 onMouseMove={handleMouseMove}
//                 onMouseDown={(e) => {
//                     setIsDragging(true)
//                     startDrag(e)
//                 }}
//                 onMouseUp={() => {
//                     setIsDragging(false)
//                     endDrag()
//                 }}
//             >
//                 <DragIndicator visible={showDrag || isDragging} />

//                 <motion.button
//                     onClick={handleOpen}
//                     className={cn(
//                         "rounded-3xl bg-gray-100 dark:bg-neutral-900 h-80 w-56 md:h-[40rem] md:w-96",
//                         "overflow-hidden flex flex-col items-start justify-start relative",
//                         isDragging ? "cursor-grabbing" : "cursor-grab"
//                     )}
//                     whileHover={{ scale: 1.02 }}
//                     whileTap={{ scale: 0.98 }}
//                 >
//                     <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-transparent z-20" />
//                     <div className="relative z-30 p-6 text-left">
//                         <p className="text-sm text-white/80 mb-1">{card.category}</p>
//                         <h3 className="text-xl font-semibold text-white">{card.title}</h3>
//                     </div>
//                     <BlurImage
//                         src={card.src}
//                         alt={card.title}
//                         fill
//                         className="object-cover absolute inset-0 z-10"
//                     />
//                 </motion.button>
//             </div>
//         </>
//     )
// }



export const Card = ({
    card,
    index,
    layout = false,
}: {
    card: Card
    index: number
    layout?: boolean
}) => {
    const [showDrag, setShowDrag] = useState(false)
    const [isDragging, setIsDragging] = useState(false)
    const { startDrag, doDrag, endDrag } = useContext(CarouselContext)

    const handleMouseMove = (e: React.MouseEvent) => {
        if (isDragging) doDrag(e)
    }

    return (
        <div
            className="relative"
            onMouseEnter={() => setShowDrag(true)}
            onMouseLeave={() => {
                setShowDrag(false)
                endDrag()
                setIsDragging(false)
            }}
            onMouseMove={handleMouseMove}
            onMouseDown={(e) => {
                setIsDragging(true)
                startDrag(e)
            }}
            onMouseUp={() => {
                setIsDragging(false)
                endDrag()
            }}
        >
            <DragIndicator visible={showDrag || isDragging} />

            <motion.div
                className={cn(
                    "rounded-3xl bg-gray-100 dark:bg-neutral-900 h-80 w-56 md:h-[40rem] md:w-96",
                    "overflow-hidden flex flex-col items-start justify-start relative",
                    isDragging ? "cursor-grabbing" : "cursor-grab"
                )}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
            >
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-transparent z-20" />
                <div className="relative z-30 p-6 text-left">
                    <p className="text-sm text-white/80 mb-1">{card.category}</p>
                    <h3 className="text-xl font-semibold text-white">{card.title}</h3>
                </div>
                <BlurImage
                    src={card.src}
                    alt={card.title}
                    fill
                    className="object-cover absolute inset-0 z-10"
                />
            </motion.div>
        </div>
    )
}

export const BlurImage = (props: ImageProps) => {
    const [isLoading, setLoading] = useState(true)
    return (
        <Image
            {...props}
            className={cn(
                "transition duration-300",
                isLoading ? "blur-sm grayscale" : "blur-0 grayscale-0",
                props.className
            )}
            onLoadingComplete={() => setLoading(false)}
        />
    )
}