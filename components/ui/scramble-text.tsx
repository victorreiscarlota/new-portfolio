'use client'

import { useRef, useEffect, useState } from 'react'

const ScrambleText = () => {
    const languages = ["WELCOME!", "WILLKOMMEN!"]
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    const [currentText, setCurrentText] = useState(languages[0])
    const [isHovering, setIsHovering] = useState(false)
    const [loadingLayers, setLoadingLayers] = useState([true, true, true])
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
        const timer1 = setTimeout(() => setLoadingLayers([false, true, true]), 300)
        const timer2 = setTimeout(() => setLoadingLayers([false, false, true]), 600)
        const timer3 = setTimeout(() => setLoadingLayers([false, false, false]), 900)
        
        scrambleText(languages[0])

        return () => {
            isMounted.current = false
            clearTimeout(timer1)
            clearTimeout(timer2)
            clearTimeout(timer3)
            if(intervalRef.current) clearInterval(intervalRef.current)
            if(cycleRef.current) clearTimeout(cycleRef.current)
        }
    }, [])

    return (
        <div className="min-h-screen grid place-items-center bg-[#1ecbe1] dark:bg-black overflow-hidden relative">
            {loadingLayers.map((visible, index) => (
                <div
                    key={index}
                    className={`absolute inset-0 grid place-items-center transition-transform duration-500 ease-in-out ${
                        index === 0 ? 'bg-red-500 dark:bg-[#3d1a1a]' : 
                        index === 1 ? 'bg-blue-900 dark:bg-gray-800' : 
                        'bg-[#1ecbe1] dark:bg-black'
                    }`}
                    style={{
                        zIndex: 3 - index,
                        transform: visible ? 'translateY(0)' : 'translateY(-100%)',
                        border: '4px solid white',
                        boxShadow: 'inset 0 0 15px rgba(0,0,0,0.2)',
                    }}
                >
                    <div className="absolute inset-0 border-4 border-white/30 transform scale-95" />
                </div>
            ))}
            
            <h1
                onMouseOver={handleMouseOver}
                onMouseLeave={handleMouseLeave}
                className={`clickable font-mono text-[clamp(3rem,10vw,10rem)] text-white px-[clamp(1rem,2vw,3rem)] rounded-[clamp(0.4rem,0.75vw,1rem)] hover:bg-[#E11E69] dark:hover:bg-white hover:text-[#1ee196] dark:hover:text-black transition-all cursor-default ${
                    loadingLayers.some(Boolean) ? 'opacity-0' : 'opacity-100'
                }`}
                style={{ 
                    transition: 'opacity 0.5s 1s, background-color 0.3s, color 0.3s',
                    textShadow: '0 2px 10px rgba(0,0,0,0.2)'
                }}
            >
                {currentText}
            </h1>
        </div>
    )
}

export default ScrambleText