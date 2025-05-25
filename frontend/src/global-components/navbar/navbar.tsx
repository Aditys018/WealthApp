import { Link, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'

export const Navbar = () => {
  const navigate = useNavigate()
  const [activeSection, setActiveSection] = useState('dashboard')

  const navItems = [
   
    {
      label: 'DASHBOARD',
      path: '/admindashboard',
      
    },
    
    {
      label: 'PROPERTIES',
      path: '/properties',
      
    },
     {
      label: 'PROFILE',
      path: '/profile',
     
    },
   
  ]

  const handleNavigation = (path: string, label: string) => {
    navigate({ to: path })
    setActiveSection(label.toLowerCase())
  }

  return (
    <header className="w-full z-50 bg-[#1d1d1d] px-4 sm:px-6 lg:px-8 py-3 sm:py-4 lg:py-5">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img
            src="/Logo.png"
            alt="WealthApp Logo"
            className="w-[150px] h-[48px] object-contain"
          />
        </Link>

        {/* Navigation Items - Centered */}
        <nav className="flex-1 flex items-center justify-center">
          <div className="flex items-center space-x-4">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => handleNavigation(item.path, item.label)}
                className={`${
                  activeSection === item.label.toLowerCase()
                    ? 'text-[#ff9500]'
                    : 'text-gray-300 hover:text-[#ff9500]'
                } px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center space-x-2`}
              >
               
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </nav>

        {/* Empty div to maintain spacing */}
        <div className="w-[150px]"></div>
      </div>
    </header>
  )
}
