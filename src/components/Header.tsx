import { useState } from 'react'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="bg-gradient-to-r from-slate-800 to-slate-900 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">BuildCalc</h1>
              <p className="text-xs text-slate-400 hidden sm:block">Construction & DIY Calculators</p>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            <a href="#" className="text-sm hover:text-amber-400 transition-colors">Home</a>
            <a href="#calculators" className="text-sm hover:text-amber-400 transition-colors">Calculators</a>
            <a href="#reviews" className="text-sm hover:text-amber-400 transition-colors">Reviews</a>
            <a href="#" className="text-sm hover:text-amber-400 transition-colors">Directory</a>
            <a href="#" className="text-sm hover:text-amber-400 transition-colors">Contact</a>
          </nav>

          {/* Mobile menu button */}
          <button 
            className="md:hidden p-2 rounded-lg hover:bg-slate-700"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Nav */}
        {mobileMenuOpen && (
          <nav className="md:hidden pb-4 border-t border-slate-700 pt-4 flex flex-col gap-3">
            <a href="#" className="text-sm hover:text-amber-400 transition-colors">Home</a>
            <a href="#calculators" className="text-sm hover:text-amber-400 transition-colors">Calculators</a>
            <a href="#reviews" className="text-sm hover:text-amber-400 transition-colors">Reviews</a>
            <a href="#" className="text-sm hover:text-amber-400 transition-colors">Directory</a>
            <a href="#" className="text-sm hover:text-amber-400 transition-colors">Contact</a>
          </nav>
        )}
      </div>
    </header>
  )
}
