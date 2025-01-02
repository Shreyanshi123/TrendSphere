import React from 'react'
import { ShoppingCart, UserPlus, LogIn, LogOut, Lock } from 'lucide-react'
import { Link } from 'react-router-dom'
export default function Navbar() {
  return (
    <div>
     <header className='fixed top-0 left-0 w-full bg-deep-plum bg-opacity-90 shadow-lg z-40 transition-all duration-300 border-b border-soft-purple-shadow '>
        <div className='container mx-auto px-5 py-4'>
            <Link to='/' className=' text-2xl text-light-lavender font-bold items-center space-x-2 flex'>
            TrendSphere</Link>
            <nav className='flex flex-wrap items-center gap-5'>
                <Link to='/' className=''>Home</Link>
                <Link to='/' className=''>Home</Link>
            </nav>
        </div>
     </header>
    </div>
  )
}
