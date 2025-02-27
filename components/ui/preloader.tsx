"use client";
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

const Preloader = () => {
    const [counter, setCounter] = useState<number>(0);
    const counterRef = useRef<HTMLDivElement>(null);
    const barsRef = useRef<HTMLDivElement[]>([]);
    const timeoutIds = useRef<NodeJS.Timeout[]>([]);

    useEffect(() => {
        let currentValue = 0;

        const updateCounter = () => {
            if (currentValue >= 100) return;

            currentValue += Math.floor(Math.random() * 10) + 1;
            if (currentValue > 100) currentValue = 100;

            setCounter(currentValue);

            const delay = Math.floor(Math.random() * 200) + 50;
            const timeoutId = setTimeout(updateCounter, delay);
            timeoutIds.current.push(timeoutId);
        };

        updateCounter();

        const tl = gsap.timeline({ delay: 3.5 });
        tl.to(counterRef.current, { opacity: 0, duration: 0.25 })
            .to(barsRef.current, {
                height: 0,
                duration: 1.5,
                stagger: { amount: 0.5 },
                ease: "power4.inOut",
            });

        return () => {
            tl.kill();
            timeoutIds.current.forEach(id => clearTimeout(id));
        };
    }, []);

    return (
        <div className="fixed w-screen h-screen z-[2] flex">
            <div
                ref={counterRef}
                className="fixed w-full h-full flex justify-end items-end z-[10000] text-[#bcbcc4] p-[0.2em_0.4em] text-[20vw] font-carpenter"
            >
                {counter}
            </div>
            {[...Array(10)].map((_, i) => (
                <div
                    key={i}
                    ref={el => {
                        if (el) barsRef.current[i] = el;
                    }}
                    className="w-[10vw] h-[105vh] bg-[#1a1a1a]"
                />
            ))}
        </div>
    );
};

export default Preloader;