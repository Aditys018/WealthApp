import { Link, useRouterState } from '@tanstack/react-router'
import { Menu, X } from 'lucide-react'
import { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet'
import logo from '../logo.svg'

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'About Us', to: '/about' },
  { label: 'Properties', to: '/properties' },
  { label: 'Services', to: '/services' },
]

export function Header() {
  const { location } = useRouterState()
  const currentPath = location.pathname
  const [isScrolled, setIsScrolled] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

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
      } bg-secondary`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img
            src="/Logo.png"
            alt="WealthApp Logo"
            className="w-[140px] h-[40px] object-contain"
          />
        </Link>

        {/* Desktop Navigation - Centered */}
        <div className="hidden md:flex flex-1 items-center justify-center">
          <nav className="flex gap-3 lg:gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-4 py-2 rounded-lg font-medium transition-colors duration-300 text-sm lg:text-base ${
                  currentPath === link.to
                    ? 'bg-[#262626] text-white shadow-md'
                    : 'text-white/80 hover:text-white hover:bg-[#1a1a1a]'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Register Now Button - Right Side */}
        <div className="hidden md:flex">
          <Button
            className="ml-3 lg:ml-6 bg-[#FF9500] hover:bg-[#ffb84d] text-black font-bold text-sm lg:text-lg px-4 lg:px-8 py-2 lg:py-4 rounded-lg shadow-lg hover:shadow-xl transition-transform duration-300 transform hover:-translate-y-1"
            size="lg"
          >
            Register Now
          </Button>
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/10 rounded-full h-10 w-10"
              >
                <Menu className="size-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>

            <SheetContent
              side="right"
              className="bg-[#0E0E0E] text-white p-0 w-full sm:max-w-sm border-l border-white/10 flex flex-col"
            >
              <div className="flex justify-between items-center border-b border-white/10 p-4">
                <div className="flex items-center gap-2">
                  <img
                    src={logo}
                    alt="WealthApp Logo"
                    className="h-8 w-8 object-contain"
                  />
                  <span className="text-xl font-semibold">WealthApp</span>
                </div>
                <SheetClose className="rounded-full h-8 w-8 flex items-center justify-center hover:bg-white/10">
                  <X className="size-5" />
                  <span className="sr-only">Close menu</span>
                </SheetClose>
              </div>

              <div className="flex flex-col gap-6 py-8 flex-grow">
                <nav className="flex flex-col gap-2 px-4">
                  {navLinks.map((link) => (
                    <SheetClose key={link.to} asChild>
                      <Link
                        to={link.to}
                        className={`px-4 py-3 rounded-lg font-medium text-lg transition-colors duration-200 ${
                          currentPath === link.to
                            ? 'bg-[#262626] text-white'
                            : 'text-white/80 hover:text-white hover:bg-[#1a1a1a]'
                        }`}
                        onClick={() => setIsOpen(false)}
                      >
                        {link.label}
                      </Link>
                    </SheetClose>
                  ))}
                </nav>

                <div className="px-4 mt-auto">
                  <SheetClose asChild>
                    <Button className="w-full bg-[#FF9500] hover:bg-[#ffb84d] text-black font-bold text-lg py-6 rounded-lg shadow-lg transition-all duration-300">
                      Register Now
                    </Button>
                  </SheetClose>
                </div>
              </div>

              <div className="p-4 border-t border-white/10 text-center text-sm text-white/60">
                © 2025 WealthApp. All rights reserved.
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}