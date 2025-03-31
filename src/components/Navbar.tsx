import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { FaGithub, FaDownload } from 'react-icons/fa'
import { HiMenu, HiX } from 'react-icons/hi'
import { useRouter } from 'next/router'
import { withBasePath } from '@/utils/paths'

// Navigation array - can be moved to a central config in the future
const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Features', href: '/features' },
  { name: 'Download', href: '/download' },
  { name: 'Docs', href: '/docs' },
  { name: 'Contact', href: '/contact' },
]

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled)
      }
    }

    document.addEventListener('scroll', handleScroll)
    return () => {
      document.removeEventListener('scroll', handleScroll)
    }
  }, [scrolled])

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  const closeMenu = () => {
    setIsOpen(false)
  }

  return (
    <header 
      className={`sticky top-0 z-50 w-full bg-black transition-all duration-300 border-b ${
        scrolled ? 'border-zinc-800 shadow-lg' : 'border-transparent'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <Link href={withBasePath('/')} className="flex items-center space-x-2">
            <span className="text-3xl font-bold font-modern-girl">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 to-pink-500">re</span>
              <span className="text-white">Namer</span>
              <span style={{ color: "#ffcc00" }}>X</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              href={withBasePath('/')} 
              className={`text-gray-200 hover:text-white transition-colors ${
                router.pathname === '/' || router.pathname === withBasePath('/') ? 'font-medium' : ''
              }`}
            >
              Home
            </Link>
            <Link 
              href={withBasePath('/docs')} 
              className={`text-gray-200 hover:text-white transition-colors ${
                router.pathname.includes('/docs') ? 'font-medium' : ''
              }`}
            >
              Documentation
            </Link>
            <Link 
              href={withBasePath('/download')} 
              className={`text-gray-200 hover:text-white transition-colors ${
                router.pathname === '/download' || router.pathname === withBasePath('/download') ? 'font-medium' : ''
              }`}
            >
              Downloads
            </Link>
            <a 
              href="https://github.com/Gcavazo1/reNamerX" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center text-gray-200 hover:text-white transition-colors"
            >
              <FaGithub className="mr-1" />
              <span>GitHub</span>
            </a>
            <Link
              href={withBasePath('/download')}
              className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white ml-2 py-2 px-4 rounded-md flex items-center justify-center hover:shadow-glow transition-all"
            >
              <FaDownload className="mr-2" />
              <span>Download</span>
            </Link>
          </nav>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center">
            <button 
              className="text-gray-200 hover:text-white transition-colors p-2" 
              onClick={toggleMenu}
              aria-label="Toggle Menu"
            >
              {isOpen ? <HiX className="h-6 w-6" /> : <HiMenu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className={`md:hidden ${isOpen ? 'block' : 'hidden'} bg-black border-t border-zinc-800`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <Link 
            href={withBasePath('/')} 
            className={`block px-3 py-2 rounded-md text-gray-200 hover:text-white hover:bg-gray-900 transition-colors ${
              router.pathname === '/' || router.pathname === withBasePath('/') ? 'font-medium' : ''
            }`}
            onClick={closeMenu}
          >
            Home
          </Link>
          <Link 
            href={withBasePath('/docs')} 
            className={`block px-3 py-2 rounded-md text-gray-200 hover:text-white hover:bg-gray-900 transition-colors ${
              router.pathname.includes('/docs') ? 'font-medium' : ''
            }`}
            onClick={closeMenu}
          >
            Documentation
          </Link>
          <Link 
            href={withBasePath('/download')} 
            className={`block px-3 py-2 rounded-md text-gray-200 hover:text-white hover:bg-gray-900 transition-colors ${
              router.pathname === '/download' || router.pathname === withBasePath('/download') ? 'font-medium' : ''
            }`}
            onClick={closeMenu}
          >
            Downloads
          </Link>
          <a
            href="https://github.com/Gcavazo1/reNamerX" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="block px-3 py-2 rounded-md text-gray-200 hover:text-white hover:bg-gray-900 transition-colors flex items-center"
            onClick={closeMenu}
          >
            <FaGithub className="mr-2" />
            <span>GitHub</span>
          </a>
          <Link
            href={withBasePath('/download')}
            className="block px-3 py-2 mt-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:from-cyan-600 hover:to-blue-600 rounded-md flex items-center"
            onClick={closeMenu}
          >
            <FaDownload className="mr-2" />
            <span>Download</span>
          </Link>
        </div>
      </div>
    </header>
  )
}

export default Navbar 