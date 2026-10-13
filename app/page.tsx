import Hero from '@/components/Hero'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import React from 'react'

const page = () => {
  return (
    <main className="relative min-h-screen w-full bg-[#050610] text-white">
      <div className="pointer-events-none fixed inset-0 z-0">

      </div>
      <Navbar />
      <Hero />
      <Footer />
    </main>
  )
}

export default page