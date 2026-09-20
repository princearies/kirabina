import { useState } from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import CalculatorGrid from './components/CalculatorGrid'
import ConcreteCalculator from './components/calculators/ConcreteCalculator'
import StairCalculator from './components/calculators/StairCalculator'
import RoofCalculator from './components/calculators/RoofCalculator'
import DeckCalculator from './components/calculators/DeckCalculator'
import BrickCalculator from './components/calculators/BrickCalculator'
import FenceCalculator from './components/calculators/FenceCalculator'
import TubeMiterCalculator from './components/calculators/TubeMiterCalculator'
import TubeNotchCalculator from './components/calculators/TubeNotchCalculator'
import RoundSquareReducerCalculator from './components/calculators/RoundSquareReducerCalculator'
import RebarCalculator from './components/calculators/RebarCalculator'
import Testimonials from './components/Testimonials'
import Footer from './components/Footer'

function App() {
  const [activeCalculator, setActiveCalculator] = useState<string | null>(null)

  const renderCalculator = () => {
    switch (activeCalculator) {
      case 'concrete': return <ConcreteCalculator />
      case 'stair': return <StairCalculator />
      case 'roof': return <RoofCalculator />
      case 'deck': return <DeckCalculator />
      case 'brick': return <BrickCalculator />
      case 'fence': return <FenceCalculator />
      case 'tube-miter': return <TubeMiterCalculator />
      case 'tube-notch': return <TubeNotchCalculator />
      case 'round-square-reducer': return <RoundSquareReducerCalculator />
      case 'rebar': return <RebarCalculator />
      default: return null
    }
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <Header />
      
      {activeCalculator ? (
        <div className="max-w-7xl mx-auto px-4 py-8">
          <button 
            onClick={() => setActiveCalculator(null)}
            className="mb-6 flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to All Calculators
          </button>
          {renderCalculator()}
        </div>
      ) : (
        <>
          <Hero />
          <CalculatorGrid onSelectCalculator={setActiveCalculator} />
          <Testimonials />
        </>
      )}
      
      <Footer />
    </div>
  )
}

export default App
