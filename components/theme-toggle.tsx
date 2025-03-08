'use client'

import { useState, useEffect } from 'react'
import { FiSun, FiMoon } from 'react-icons/fi'

export function ThemeToggle() {
    const [darkMode, setDarkMode] = useState(false)

    useEffect(() => {
        const isDark = localStorage.getItem('darkMode') === 'true'
        setDarkMode(isDark)
        document.documentElement.classList.toggle('dark', isDark)
    }, [])

    const toggleDarkMode = () => {
        const newMode = !darkMode
        setDarkMode(newMode)
        localStorage.setItem('darkMode', String(newMode))

        // Adicionar classe temporária para transição suave
        document.documentElement.classList.add('theme-transition')
        document.documentElement.classList.toggle('dark', newMode)

        setTimeout(() => {
            document.documentElement.classList.remove('theme-transition')
        }, 300)
    }

    return (
        <button
            onClick={toggleDarkMode}
            className="fixed top-4 right-4 z-50 p-2 rounded-full bg-white dark:bg-[#FCF360] shadow-lg hover:scale-105 transition-all duration-300"
        >
            {darkMode ? (
                <FiSun className="w-6 h-6 text-yellow-500 dark:text-[#6094FC] transition-colors duration-300" />
            ) : (
                <FiMoon className="w-6 h-6 text-gray-600 transition-colors duration-300" />
            )}
        </button>
    )
}