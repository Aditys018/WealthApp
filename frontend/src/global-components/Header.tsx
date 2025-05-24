import { Link } from '@tanstack/react-router'
import { useEffect, useState } from 'react'

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={`w-full z-50 transition-all duration-300 px-4 sm:px-6 lg:px-8 ${
        isScrolled ? 'py-2 sm:py-3 lg:py-4 shadow-md' : 'py-3 sm:py-4 lg:py-5'
      }`}
      style={{ backgroundColor: '#1d1d1d' }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-start">
        {/* Logo Only */}
        <Link to="/" className="flex items-center gap-2">
          <img
            src="/Logo.png"
            alt="WealthApp Logo"
            className="w-[150px] h-[48px] object-contain"
          />
        </Link>
      </div>
    </header>
  )
}