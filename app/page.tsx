'use client'

import { useState, useEffect } from 'react'
import Hero from '@/components/Hero'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Preloader from '@/components/Preloader'
import { useAudio } from '@/components/AudioProvider'

export default function Page() {
  const [preloaderFinished, setPreloaderFinished] = useState<boolean | null>(null)
  const [showModal, setShowModal] = useState(false)
  const { audioInitialized, initializeAudio } = useAudio()

  // Check sessionStorage on mount to determine if preloader should show
  useEffect(() => {
    const hasSeenPreloader = sessionStorage.getItem('preloaderShown') === 'true'
    setPreloaderFinished(hasSeenPreloader)
  }, [])

  const handlePreloaderFinish = () => {
    setPreloaderFinished(true)
    sessionStorage.setItem('preloaderShown', 'true')
    if (!audioInitialized) {
      setShowModal(true)
    }
  }

  const handleMusicChoice = (withMusic: boolean) => {
    setShowModal(false)
    initializeAudio(withMusic)
  }

  // Show black screen while determining preloader state (prevents flash)
  if (preloaderFinished === null) {
    return <div className="min-h-screen bg-black" />
  }

  return (
    <main className="relative min-h-screen w-full bg-[#050610] text-white">
      {/* Preloader Animation */}
      {preloaderFinished === false && (
        <Preloader onFinish={handlePreloaderFinish} />
      )}

      {/* Music Choice Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/85 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-6 rounded-3xl border border-sky-500/30 bg-[#0a0e1a]/95 p-8 sm:p-10 shadow-[0_0_40px_rgba(56,189,248,0.2)] backdrop-blur-xl max-w-md w-full mx-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-white text-center tracking-wide">
              Welcome to <span className="text-sky-400">Nexora</span>
            </h2>
            <p className="text-sm text-gray-400 text-center -mt-2">
              Would you like background music?
            </p>
            <div className="flex flex-row gap-3 sm:gap-4 w-full justify-center">
              <button
                onClick={() => handleMusicChoice(true)}
                className="flex-1 bg-sky-500 text-white px-5 py-3 rounded-xl font-semibold text-sm transition-all duration-200 hover:bg-sky-400 hover:shadow-[0_0_20px_rgba(56,189,248,0.4)] active:scale-95"
              >
                Enter with Music
              </button>
              <button
                onClick={() => handleMusicChoice(false)}
                className="flex-1 bg-white/10 text-white px-5 py-3 rounded-xl border border-white/20 font-semibold text-sm transition-all duration-200 hover:bg-white/20 active:scale-95"
              >
                Enter without Music
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="pointer-events-none fixed inset-0 z-0" />
      <Navbar />
      <Hero />
      <Footer />
    </main>
  )
}