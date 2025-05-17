import { Link, useRouterState } from '@tanstack/react-router'
import { Button } from './ui/button'
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetClose,
} from './ui/sheet'
import { Menu, X } from 'lucide-react'
import logo from '../logo.svg'
import { useState, useEffect } from 'react'

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'About Us', to: '/about' },
  { label: 'Properties', to: '/properties' },
  { label: 'Services', to: '/services' },
]

export default function Header() {
  const router = useRouterState()
  const currentPath = router.location.pathname
  const [isScrolled, setIsScrolled] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 w-full z-50 transition-all duration-300 py-3 sm:py-4 lg:py-5 px-4 sm:px-6 lg:px-8 
      ${isScrolled ? 'bg-black/95 shadow-lg backdrop-blur-sm' : 'bg-[#0E0E0E]'}`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <img
            src="/Logo.png"
            alt="WealthApp Logo"
            className="w-[160px] h-[48px]"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-2 lg:gap-4">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`px-3 py-2 lg:px-6 lg:py-2 rounded-lg font-medium transition-all duration-300 text-sm lg:text-base
              ${
                currentPath === link.to
                  ? 'bg-[#262626] text-white shadow-md'
                  : 'hover:bg-[#1a1a1a] text-white/80 hover:text-white'
              }`}
            >
              {link.label}
            </Link>
          ))}

          <div className="ml-2 lg:ml-6">
            <Button
              className="bg-[#FF9500] hover:bg-[#ffb84d] text-black font-bold text-sm lg:text-lg px-4 lg:px-8 py-2 lg:py-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              size="lg"
            >
              Register Now
            </Button>
          </div>
        </nav>

        {/* Mobile Hamburger Menu */}
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
              className="bg-[#0E0E0E] text-white p-0 w-full sm:max-w-sm border-l border-white/10"
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

              <div className="flex flex-col gap-6 py-8">
                <nav className="flex flex-col gap-2 px-4">
                  {navLinks.map((link) => (
                    <SheetClose key={link.to} asChild>
                      <Link
                        to={link.to}
                        className={`px-4 py-3 rounded-lg font-medium transition-all duration-200 text-lg flex items-center
                        ${
                          currentPath === link.to
                            ? 'bg-[#262626] text-white'
                            : 'hover:bg-[#1a1a1a] text-white/80 hover:text-white'
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
                    <Button className="w-full bg-[#FF9500] hover:bg-[#ffb84d] text-black font-bold text-lg py-6 rounded-lg shadow-lg border-none transition-all duration-300">
                      Register Now
                    </Button>
                  </SheetClose>
                </div>
              </div>

              <div className="mt-auto p-4 border-t border-white/10 text-center text-sm text-white/60">
                © 2025 WealthApp. All rights reserved.
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
