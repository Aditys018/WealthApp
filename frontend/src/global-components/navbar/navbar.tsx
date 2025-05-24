import { useNavigate } from '@tanstack/react-router'
import { useState } from 'react'

export const Navbar = () => {
  const navigate = useNavigate()
  const [activeSection, setActiveSection] = useState('dashboard')

  const navItems = [
    { label: 'DASHBOARD', path: '/dashboard' },
    { label: 'TEAMS', path: '/teams' },
    { label: 'PROPERTIES', path: '/properties' },
  ]

  const handleNavigation = (path: string, label: string) => {
    navigate({ to: path })
    setActiveSection(label.toLowerCase())
  }

  return (
    <nav className="flex justify-center items-center space-x-4 mr-128">
      {navItems.map((item) => (
        <button
          key={item.label}
          onClick={() => handleNavigation(item.path, item.label)}
          className={`${
            activeSection === item.label.toLowerCase()
              ? 'text-[#ff9500]'
              : 'text-gray-300 hover:text-[#ff9500]'
          } px-3 py-2  rounded-md text-sm font-medium transition-colors duration-200 flex items-center space-x-2`}
        >
          <span>{item.label}</span>
        </button>
      ))}
    </nav>
  )
}
