"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Mic } from "lucide-react"

export default function VoiceProcessingPage() {
  const router = useRouter()
  const [transcript, setTranscript] = useState("")

  // Simulate voice processing with a timer
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/schemes-result")
    }, 3000)

    return () => clearTimeout(timer)
  }, [router])

  // Simulate transcript updating
  useEffect(() => {
    const phrases = ["कि...", "किसान...", "किसान योजना...", "किसान योजना बताओ"]

    let index = 0
    const interval = setInterval(() => {
      if (index < phrases.length) {
        setTranscript(phrases[index])
        index++
      } else {
        clearInterval(interval)
      }
    }, 700)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex flex-col min-h-screen bg-orange-50 items-center justify-center p-6">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full flex flex-col items-center">
        {/* Animated Microphone */}
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-green-500 rounded-full opacity-20 animate-ping"></div>
          <div className="relative bg-green-600 rounded-full p-6">
            <Mic className="w-12 h-12 text-white animate-pulse" />
          </div>
        </div>

        {/* Audio Waveform Visualization */}
        <div className="flex items-center justify-center gap-1 mb-6 h-12">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="w-2 bg-green-500 rounded-full animate-bounce"
              style={{
                height: `${Math.max(10, Math.floor(Math.random() * 40))}px`,
                animationDelay: `${i * 0.05}s`,
              }}
            ></div>
          ))}
        </div>

        {/* Transcription */}
        {transcript && (
          <div className="bg-green-100 p-4 rounded-lg mb-6 w-full">
            <p className="text-center text-green-800">{transcript}</p>
          </div>
        )}

        {/* Processing Message */}
        <p className="text-lg text-center font-medium text-gray-700">हम आपकी योजना ढूंढ रहे हैं…</p>
      </div>
    </div>
  )
}

