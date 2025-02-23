// components/ui/CreativeLoader.tsx
'use client'

import { motion, useAnimation } from 'framer-motion'
import { forwardRef, useImperativeHandle, useEffect } from 'react'

type CreativeLoaderProps = {
  onComplete?: () => void
  duration?: number
}

export type CreativeLoaderHandle = {
  complete: () => Promise<void>
}

const CreativeLoader = forwardRef<CreativeLoaderHandle, CreativeLoaderProps>(
  ({ onComplete, duration = 4.5 }, ref) => {
    const controls = useAnimation()
    const maskControls = useAnimation()
    const progressControls = useAnimation()

    const triggerCompleteAnimation = async () => {
      // Animação da máscara
      await maskControls.start({
        scale: 4,
        transition: { duration: 1.5, ease: [0.87, 0, 0.13, 1] }
      })

      // Animação de fade out
      await controls.start({
        opacity: 0,
        transition: { duration: 0.5 }
      })

      onComplete?.()
    }

    useImperativeHandle(ref, () => ({
      async complete() {
        await triggerCompleteAnimation()
      }
    }))

    useEffect(() => {
      const load = async () => {
        // Animação da barra de progresso
        await progressControls.start({
          width: '100%',
          transition: { duration: duration - 1.5, ease: 'linear' }
        })
        
        // Dispara animação de conclusão
        await triggerCompleteAnimation()
      }

      load()
    }, [duration])

    return (
      <motion.div
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800"
        initial={{ opacity: 1 }}
        animate={controls}
      >
        {/* Efeito de partículas */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate={maskControls}
          initial={{ scale: 0.1 }}
        >
          <div className="absolute h-24 w-24 rounded-full bg-white/10 backdrop-blur-lg" />
          
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute h-2 w-2 rounded-full bg-teal-400"
              initial={{ scale: 0, opacity: 1 }}
              animate={{
                scale: [0, 1, 0],
                x: Math.cos((i * 30 * Math.PI) / 180) * 60,
                y: Math.sin((i * 30 * Math.PI) / 180) * 60
              }}
              transition={{
                repeat: Infinity,
                duration: 1.5,
                delay: i * 0.1,
                ease: 'anticipate'
              }}
            />
          ))}
        </motion.div>

        {/* Conteúdo central */}
        <div className="relative z-10 flex flex-col items-center gap-4">
          {/* Barra de progresso */}
          <div className="h-1 w-48 bg-gray-600 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-teal-400 to-cyan-400"
              initial={{ width: '0%' }}
              animate={progressControls}
            />
          </div>

          {/* Texto animado */}
          <motion.span
            className="font-mono text-2xl tracking-wider text-teal-400"
            animate={{
              textShadow: [
                '0 0 10px rgba(34, 211, 238, 0.5)',
                '2px 2px 0 rgba(45, 212, 191, 0.8), -2px -2px 0 rgba(34, 211, 238, 0.8)',
                '0 0 10px rgba(34, 211, 238, 0.5)'
              ]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: 'reverse'
            }}
          >
            LOADING EXPERIENCE
          </motion.span>
        </div>
      </motion.div>
    )
  }
)

CreativeLoader.displayName = 'CreativeLoader'

export { CreativeLoader }