'use client'

import { useRef, useEffect, useState } from 'react'

const ScrambleText = () => {
    const languages = ["WELCOME!", "WILLKOMMEN!"]
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    const [currentText, setCurrentText] = useState(languages[0])
    const [isHovering, setIsHovering] = useState(false)
    const intervalRef = useRef<NodeJS.Timeout | null>(null)
    const cycleRef = useRef<NodeJS.Timeout | null>(null)
    const isMounted = useRef(true)

    const scrambleText = (target: string) => {
        let iteration = 0
        
        setCurrentText(
            Array.from({ length: target.length }, 
                () => letters[Math.floor(Math.random() * 26)]
            ).join('')
        )

        if (intervalRef.current) clearInterval(intervalRef.current)
        
        intervalRef.current = setInterval(() => {
            setCurrentText(prev => {
                return target.split('')
                    .map((_, index) => {
                        if(index < iteration) return target[index]
                        return letters[Math.floor(Math.random() * 26)]
                    })
                    .join('')
            })

            if(iteration >= target.length) {
                clearInterval(intervalRef.current!)
                if(!isHovering && isMounted.current) {
                    cycleRef.current = setTimeout(() => {
                        const nextIndex = (languages.indexOf(target) + 1) % languages.length
                        scrambleText(languages[nextIndex])
                    }, 2000)
                }
            }
            
            iteration += 0.4
        }, 30)
    }

    const handleMouseOver = () => {
        setIsHovering(true)
        if (cycleRef.current) clearTimeout(cycleRef.current)
        scrambleText(currentText)
    }

    const handleMouseLeave = () => {
        setIsHovering(false)
        if (cycleRef.current) clearTimeout(cycleRef.current)
        cycleRef.current = setTimeout(() => {
            const nextIndex = (languages.indexOf(currentText) + 1) % languages.length
            scrambleText(languages[nextIndex])
        }, 2000)
    }

    useEffect(() => {
        scrambleText(languages[0])
        return () => {
            isMounted.current = false
            if(intervalRef.current) clearInterval(intervalRef.current)
            if(cycleRef.current) clearTimeout(cycleRef.current)
        }
    }, [])

    return (
        <div className="min-h-screen grid place-items-center bg-[#1ecbe1] dark:bg-black overflow-hidden">
            <h1
                onMouseOver={handleMouseOver}
                onMouseLeave={handleMouseLeave}
                className="clickable font-mono text-[clamp(3rem,10vw,10rem)] text-white px-[clamp(1rem,2vw,3rem)] rounded-[clamp(0.4rem,0.75vw,1rem)] hover:bg-[#E11E69] dark:hover:bg-white hover:text-[#1ee196] dark:hover:text-black transition-colors cursor-default"
            >
                {currentText}
            </h1>
        </div>
    )
}

export default ScrambleText