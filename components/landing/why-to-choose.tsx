'use client'

import { useEffect, useRef, useState } from 'react'
import { Search, Shield, MessageCircle } from 'lucide-react'
import { SignInButton, useAuth } from "@clerk/nextjs"
import { useRouter } from 'next/navigation'

const timelineData = [
  {
    id: 1,
    icon: <Search className="w-8 h-8 text-amber-700" />,
    title: "Smart Matching",
    description: "Find roommates based on your preferences, lifestyle, and study habits with our intelligent matching algorithm."
  },
  {
    id: 2,
    icon: <Shield className="w-8 h-8 text-amber-800" />,
    title: "Verified Profiles",
    description: "All users verify their student status with resume or LinkedIn profiles, ensuring authentic connections."
  },
  {
    id: 3,
    icon: <MessageCircle className="w-8 h-8 text-amber-700" />,
    title: "Real-time Chat",
    description: "Connect instantly with potential roommates through secure messaging and build relationships before moving in."
  }
]

export default function WhyChooseTimeline() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [mounted, setMounted] = useState(false)
  const itemRefs = useRef<(HTMLDivElement | null)[]>([])
  const { isSignedIn } = useAuth()
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const handleScroll = () => {
      const windowCenter = window.innerHeight / 2

      itemRefs.current.forEach((item, index) => {
        if (!item) return
        const itemRect = item.getBoundingClientRect()
        const itemCenter = itemRect.top + itemRect.height / 2
        
        if (Math.abs(itemCenter - windowCenter) < 200) {
          setActiveIndex(index)
        }
      })
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [mounted])

  const setItemRef = (index: number) => (el: HTMLDivElement | null) => {
    itemRefs.current[index] = el
  }

  const handleGetStarted = () => {
    if (isSignedIn) {
      router.push('/dashboard')
    }
  }

  return (
    <section className="py-20 px-4 min-h-screen" style={{
      background: 'linear-gradient(135deg, #ffffff 0%, #fefefe 10%, #fdfdfd 20%, #fafafa 30%, #f8f8f8 40%, #f5f5f5 50%, #f0f0f0 60%, #ede7de 70%, #e8dcc6 80%, #deb887 90%, #d2b48c 100%)'
    }}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Why Choose findmate.com?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Built specifically for students, by students. We understand what makes a 
            great roommate match.
          </p>
        </div>

        {/* Timeline Container */}
        <div className="relative max-w-4xl mx-auto">
          {/* Central Timeline Line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-gray-200 h-full">
            <div 
              className="w-full transition-all duration-1000 ease-out"
              style={{
                height: `${((activeIndex + 1) / timelineData.length) * 100}%`,
                background: 'linear-gradient(to bottom, #8B4513, #A0522D, #CD853F)'
              }}
            />
          </div>

          {/* Timeline Items */}
          <div className="space-y-24">
            {timelineData.map((item, index) => (
              <div
                key={item.id}
                ref={setItemRef(index)}
                className={`flex items-center transition-all duration-700 ${
                  index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
                }`}
              >
                {/* Content Card */}
                <div className="w-5/12">
                  <div
                    className={`p-8 rounded-2xl shadow-lg transition-all duration-700 transform ${
                      activeIndex >= index
                        ? 'bg-white scale-100 opacity-100 translate-y-0'
                        : 'bg-gray-50 scale-95 opacity-60 translate-y-8'
                    }`}
                  >
                    <div className="flex items-center mb-4">
                      <div className={`p-3 rounded-full transition-all duration-500 ${
                        activeIndex >= index
                          ? 'bg-gradient-to-r from-amber-100 to-orange-100 scale-110'
                          : 'bg-gray-200 scale-100'
                      }`}>
                        {item.icon}
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 ml-4">
                        {item.title}
                      </h3>
                    </div>
                    <p className="text-gray-600 text-lg leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* Timeline Node */}
                <div className="w-2/12 flex justify-center relative z-10">
                  <div
                    className={`w-6 h-6 rounded-full border-4 transition-all duration-500 relative ${
                      activeIndex >= index
                        ? 'bg-white border-amber-600 scale-125 shadow-lg'
                        : 'bg-gray-300 border-gray-400 scale-100'
                    }`}
                  >
                    {activeIndex >= index && (
                      <div className="absolute inset-0 rounded-full bg-amber-600 animate-ping opacity-75" />
                    )}
                  </div>
                </div>

                {/* Spacer */}
                <div className="w-5/12" />
              </div>
            ))}
          </div>
        </div>

        {/* CTA with SignIn */}
        <div className="text-center mt-20">
          {mounted ? (
            isSignedIn ? (
              <button 
                onClick={handleGetStarted}
                className="bg-gradient-to-r from-amber-600 to-orange-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                Go to Dashboard
              </button>
            ) : (
              <SignInButton mode="modal">
                <button 
                  className="bg-gradient-to-r from-amber-600 to-orange-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                  suppressHydrationWarning={true}
                >
                  Get Started Today
                </button>
              </SignInButton>
            )
          ) : (
            <button 
              className="bg-gradient-to-r from-amber-600 to-orange-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-xl transform hover:scale-105 transition-all duration-300 opacity-50 cursor-not-allowed"
              disabled
            >
              Get Started Today
            </button>
          )}
        </div>
      </div>
    </section>
  )
}