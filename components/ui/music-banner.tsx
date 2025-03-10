'use client'
import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

declare global {
  interface Window {
    webkitAudioContext: typeof AudioContext
  }
}

const vertexShaderSource = `
attribute vec2 a_position;
void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`

const fragmentShaderSource = `
precision mediump float;

uniform vec2 u_resolution;
uniform float u_time;
uniform float u_audioData;

vec2 hash(vec2 p) {
    p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
    return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
}

float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(dot(hash(i + vec2(0.0, 0.0)), f - vec2(0.0, 0.0)),
                   dot(hash(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0)), u.x),
               mix(dot(hash(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0)),
                   dot(hash(i + vec2(1.0, 1.0)), f - vec2(1.0, 1.0)), u.x), u.y);
}

vec3 getGradientColor(float t) {
    vec3 pink = vec3(211.0/255.0, 37.0/255.0, 178.0/255.0);
    vec3 yellow = vec3(203.0/255.0, 168.0/255.0, 24.0/255.0);
    float cycle = fract(t);
    if (cycle < 0.5) {
        return mix(pink, yellow, cycle * 2.0);
    } else {
        return mix(yellow, pink, (cycle - 0.5) * 2.0);
    }
}

void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution;
    uv = uv * 2.0 - 1.0;
    uv.x *= u_resolution.x / u_resolution.y;

    float radius = 0.5 + u_audioData * 0.5;
    float edgeThickness = 0.05;

    float dist = length(uv) - radius;
    float n = noise(uv * 4.0 + vec2(u_time * 0.5, u_time * 0.5)) * 0.1;
    n += noise(uv * 8.0 + vec2(u_time * 0.3, -u_time * 0.3)) * 0.05;

    float edge = smoothstep(edgeThickness, 0.0, dist + n);
    float gradientSpeed = 0.02;
    float gradientPosition = fract(uv.x * 0.25 - u_time * gradientSpeed);
    vec3 color = getGradientColor(gradientPosition);

    color *= edge;
    gl_FragColor = vec4(color, edge);
}
`

const createShader = (gl: WebGLRenderingContext, type: number, source: string) => {
    const shader = gl.createShader(type)
    if (!shader) return null
    gl.shaderSource(shader, source)
    gl.compileShader(shader)
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(shader))
        gl.deleteShader(shader)
        return null
    }
    return shader
}

const createProgram = (gl: WebGLRenderingContext, vertexShader: WebGLShader, fragmentShader: WebGLShader) => {
    const program = gl.createProgram()
    if (!program) return null
    gl.attachShader(program, vertexShader)
    gl.attachShader(program, fragmentShader)
    gl.linkProgram(program)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error(gl.getProgramInfoLog(program))
        gl.deleteProgram(program)
        return null
    }
    return program
}

export const Banner = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [isPlaying, setIsPlaying] = useState(false)
    const audioRef = useRef<HTMLAudioElement | null>(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const gl = canvas.getContext('webgl', { alpha: true })
        if (!gl) return

        const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource)
        const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource)
        if (!vertexShader || !fragmentShader) return

        const program = createProgram(gl, vertexShader, fragmentShader)
        if (!program) return

        const positionBuffer = gl.createBuffer()
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
        const positions = [-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW)

        const positionLocation = gl.getAttribLocation(program, "a_position")
        gl.enableVertexAttribArray(positionLocation)
        gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0)

        gl.useProgram(program)

        const resolutionLocation = gl.getUniformLocation(program, "u_resolution")
        const timeLocation = gl.getUniformLocation(program, "u_time")
        const audioDataLocation = gl.getUniformLocation(program, "u_audioData")

        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)()
        const analyser = audioCtx.createAnalyser()
        analyser.fftSize = 256
        const bufferLength = analyser.frequencyBinCount
        const dataArray = new Uint8Array(bufferLength)

        const audio = new Audio('https://assets.codepen.io/1468070/Ardie+Son+-+First+Sunrise.mp3')
        audio.crossOrigin = "anonymous"
        const source = audioCtx.createMediaElementSource(audio)
        source.connect(analyser)
        source.connect(audioCtx.destination)
        audioRef.current = audio

        const updateCanvasSize = () => {
            if (!canvas) return
            canvas.width = canvas.clientWidth
            canvas.height = canvas.clientHeight
            gl.viewport(0, 0, canvas.width, canvas.height)
        }

        const render = (time: number) => {
            time *= 0.001
            updateCanvasSize()

            if (resolutionLocation && timeLocation && audioDataLocation) {
                gl.uniform2f(resolutionLocation, canvas.width, canvas.height)
                gl.uniform1f(timeLocation, time)

                analyser.getByteFrequencyData(dataArray)
                const average = dataArray.reduce((sum, value) => sum + value, 0) / bufferLength
                const audioData = average / 256.0

                gl.uniform1f(audioDataLocation, audioData)
            }

            gl.clear(gl.COLOR_BUFFER_BIT)
            gl.drawArrays(gl.TRIANGLES, 0, 6)

            requestAnimationFrame(render)
        }

        updateCanvasSize()
        window.addEventListener('resize', updateCanvasSize)
        requestAnimationFrame(render)

        return () => {
            window.removeEventListener('resize', updateCanvasSize)
            audio.pause()
            audioCtx.close()
        }
    }, [])

    const toggleAudio = () => {
        if (!audioRef.current) return
        if (isPlaying) {
            audioRef.current.pause()
        } else {
            audioRef.current.play().catch(() => {
                // Handle autoplay restrictions
            })
        }
        setIsPlaying(!isPlaying)
    }

    return (
        <div className="relative w-full h-screen overflow-hidden bg-black">
            <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full z-30"
            />

            <motion.div
                className="absolute inset-0 w-full h-full z-20"
                style={{
                    backgroundImage: `
                        linear-gradient(rgba(40, 40, 40, 0.3) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(40, 40, 40, 0.3) 1px, transparent 1px)
                    `,
                    backgroundSize: '20px 20px',
                    backgroundColor: 'black'
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 2 }}
            />

            <motion.div
                className="clickable fixed top-4 left-4 z-50 cursor-pointer"
                onClick={toggleAudio}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
            >
                <AnimatePresence mode='wait'>
                    {isPlaying ? (
                        <motion.svg
                            key="sound-on"
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-8 w-8 text-white"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            initial={{ scale: 0, y: 20 }}
                            animate={{ 
                                scale: 1,
                                y: 0,
                                transition: {
                                    type: "spring",
                                    stiffness: 200,
                                    damping: 8
                                }
                            }}
                            exit={{ 
                                scale: 0,
                                y: -20,
                                transition: { duration: 0.1 }
                            }}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            <path d="M3 14v-4a1 1 0 0 1 1-1h2l3.5-3A1 1 0 0 1 11 7v10a1 1 0 0 1-1.5.866L6 15H4a1 1 0 0 1-1-1z"/>
                            <path d="M16 12h4M18 10v4"/>
                        </motion.svg>
                    ) : (
                        <motion.svg
                            key="sound-off"
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-8 w-8 text-white"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            initial={{ scale: 0, y: -20 }}
                            animate={{ 
                                scale: 1,
                                y: 0,
                                transition: {
                                    type: "spring",
                                    stiffness: 200,
                                    damping: 8
                                }
                            }}
                            exit={{ 
                                scale: 0,
                                y: 20,
                                transition: { duration: 0.1 }
                            }}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            <path d="M3 14v-4a1 1 0 0 1 1-1h2l3.5-3A1 1 0 0 1 11 7v10a1 1 0 0 1-1.5.866L6 15H4a1 1 0 0 1-1-1z"/>
                            <path d="M17 9l4 4m0-4l-4 4"/>
                        </motion.svg>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    )
}