"use client";
import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const Header = () => {
    const lettersRef = useRef<HTMLDivElement[]>([]);

    useEffect(() => {
        const tl = gsap.timeline({
            defaults: { duration: 1.5, ease: "power4.inOut" }
        });

        tl.from(lettersRef.current, {
            y: 700,
            opacity: 0, // Adicionamos fade-in
            stagger: 0.15,
            delay: 0.5,
            persist: true // Mantém o estado final
        });
    }, []);

    return (
        <div className="w-full flex justify-between p-8">
            {['f', 'e', 'o', '.'].map((letter, i) => (
                <div
                    key={i}
                    ref={el => {
                        if (el) lettersRef.current[i] = el;
                    }}
                    className="relative font-carpenter text-[32vw] text-[#1a1a1a] leading-[1.125]"
                >
                    {letter}
                </div>
            ))}
        </div>
    );
};

export default Header;