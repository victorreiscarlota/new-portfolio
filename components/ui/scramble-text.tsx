'use client'

import { useRef, useEffect } from 'react'

const ScrambleText = () => {
    const h1Ref = useRef<HTMLHeadingElement>(null)
    const intervalRef = useRef<NodeJS.Timeout | null>(null)
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"

    const handleMouseOver = () => {
        if (!h1Ref.current) return

        let iteration = 0
        const target = h1Ref.current
        const value = target.dataset.value || ''

        if (intervalRef.current) clearInterval(intervalRef.current)

        intervalRef.current = setInterval(() => {
            target.innerText = value
                .split('')
                .map((_, index) => {
                    if (index < iteration) {
                        return value[index]
                    }
                    return letters[Math.floor(Math.random() * 26)]
                })
                .join('')

            if (iteration >= value.length && intervalRef.current) {
                clearInterval(intervalRef.current)
            }

            iteration += 1 / 3
        }, 30)
    }

    useEffect(() => {
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current)
        }
    }, [])

    return (
        <div className="min-h-screen grid place-items-center bg-black overflow-hidden">
            <h1
                ref={h1Ref}
                data-value="WELCOME!"
                onMouseOver={handleMouseOver}
                className="font-mono text-[clamp(3rem,10vw,10rem)] text-white px-[clamp(1rem,2vw,3rem)] rounded-[clamp(0.4rem,0.75vw,1rem)] hover:bg-white hover:text-black transition-colors"
            >
                WELCOME!
            </h1>
        </div>
    )
}

export default ScrambleText