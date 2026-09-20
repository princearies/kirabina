import { useState, useMemo } from 'react'
import { Unit, toInches, fromInches, formatMeasurement } from '../../utils/unitConversion'

type Shape = 'slab' | 'footing' | 'column' | 'stairs'

export default function ConcreteCalculator() {
  const [shape, setShape] = useState<Shape>('slab')
  const [length, setLength] = useState('10')
  const [width, setWidth] = useState('10')
  const [depth, setDepth] = useState('0.33')
  const [diameter, setDiameter] = useState('2')
  const [height, setHeight] = useState('8')
  const [numSteps, setNumSteps] = useState('3')
  const [stepRise, setStepRise] = useState('7')
  const [stepRun, setStepRun] = useState('11')
  const [unit, setUnit] = useState<Unit>('in')
  const [wastePercent, setWastePercent] = useState('10')
  const [pricePerYard, setPricePerYard] = useState('125')

  const results = useMemo(() => {
    // Convert all inputs to inches for calculation
    let volumeCubicInches = 0

    if (shape === 'slab' || shape === 'footing') {
      const L = toInches(parseFloat(length) || 0, unit)
      const W = toInches(parseFloat(width) || 0, unit)
      const D = toInches(parseFloat(depth) || 0, unit)
      volumeCubicInches = L * W * D
    } else if (shape === 'column') {
      const D = toInches(parseFloat(diameter) || 0, unit)
      const H = toInches(parseFloat(height) || 0, unit)
      const radius = D / 2
      volumeCubicInches = Math.PI * radius * radius * H
    } else if (shape === 'stairs') {
      const steps = parseInt(numSteps) || 0
      const rise = toInches(parseFloat(stepRise) || 0, unit)
      const run = toInches(parseFloat(stepRun) || 0, unit)
      // Each step is a rectangular block
      // Total volume = sum of all steps
      for (let i = 1; i <= steps; i++) {
        const stepHeight = rise * i
        volumeCubicInches += stepHeight * run * 36 // Assume 3ft width (36 inches)
      }
    }

    // Convert to various units
    const volumeCubicFeet = volumeCubicInches / 1728
    const volumeCubicYards = volumeCubicFeet / 27
    const volumeCubicMeters = volumeCubicInches * 0.0000163871

    // Add waste
    const waste = parseFloat(wastePercent) || 0
    const volumeWithWaste = volumeCubicYards * (1 + waste / 100)

    // Calculate bags needed (based on cubic feet)
    const volumeWithWasteCuFt = volumeWithWaste * 27
    const bags40 = Math.ceil(volumeWithWasteCuFt / 0.30)
    const bags60 = Math.ceil(volumeWithWasteCuFt / 0.45)
    const bags80 = Math.ceil(volumeWithWasteCuFt / 0.60)

    // Cost estimation
    const price = parseFloat(pricePerYard) || 0
    const totalCost = volumeWithWaste * price

    // Weight estimation (concrete ~150 lbs per cubic foot)
    const weightLbs = volumeCubicFeet * 150

    return {
      volumeCubicInches,
      volumeCubicFeet,
      volumeCubicYards,
      volumeCubicMeters,
      volumeWithWaste,
      bags40,
      bags60,
      bags80,
      totalCost,
      weightLbs,
      waste,
    }
  }, [shape, length, width, depth, diameter, height, numSteps, stepRise, stepRun, unit, wastePercent, pricePerYard])

  return (
    <div className="max-w-5xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-red-500 to-red-600 px-8 py-6 text-white">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🧱</span>
            <div>
              <h2 className="text-2xl font-bold">Concrete Volume Calculator</h2>
              <p className="text-red-100 text-sm mt-1">Calculate concrete needed for slabs, footings, columns & stairs</p>
            </div>
          </div>
        </div>

        <div className="p-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Input Section */}
            <div>
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Project Details</h3>
              
              <div className="space-y-4">
                {/* Shape Selection */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Shape Type
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'slab', label: 'Slab', icon: '▬' },
                      { id: 'footing', label: 'Footing', icon: '▭' },
                      { id: 'column', label: 'Column', icon: '▮' },
                      { id: 'stairs', label: 'Stairs', icon: '⊟' },
                    ].map((s) => (
                      <button
                        key={s.id}
                        onClick={() => setShape(s.id as Shape)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                          shape === s.id
                            ? 'bg-red-600 text-white'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        <span className="mr-1">{s.icon}</span> {s.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Unit System */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Unit System
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setUnit('in')}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        unit === 'in'
                          ? 'bg-red-600 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      Imperial (inches)
                    </button>
                    <button
                      onClick={() => setUnit('mm')}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        unit === 'mm'
                          ? 'bg-red-600 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      Metric (mm)
                    </button>
                  </div>
                </div>

                {/* Dimensions based on shape */}
                {(shape === 'slab' || shape === 'footing') && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Length ({unit === 'mm' ? 'mm' : unit === 'ft' ? 'ft' : 'inches'})
                      </label>
                      <input
                        type="number"
                        value={length}
                        onChange={(e) => setLength(e.target.value)}
                        step="any"
                        min="0"
                        className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
                        placeholder={unit === 'mm' ? 'e.g., 3000' : 'e.g., 120'}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Width ({unit === 'mm' ? 'mm' : unit === 'ft' ? 'ft' : 'inches'})
                      </label>
                      <input
                        type="number"
                        value={width}
                        onChange={(e) => setWidth(e.target.value)}
                        step="any"
                        min="0"
                        className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
                        placeholder={unit === 'mm' ? 'e.g., 3000' : 'e.g., 120'}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Depth/Thickness ({unit === 'mm' ? 'mm' : unit === 'ft' ? 'ft' : 'inches'})
                      </label>
                      <input
                        type="number"
                        value={depth}
                        onChange={(e) => setDepth(e.target.value)}
                        step="any"
                        min="0"
                        className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
                        placeholder={unit === 'mm' ? 'e.g., 100' : 'e.g., 4'}
                      />
                    </div>
                  </>
                )}

                {shape === 'column' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Diameter ({unit === 'mm' ? 'mm' : 'inches'})
                      </label>
                      <input
                        type="number"
                        value={diameter}
                        onChange={(e) => setDiameter(e.target.value)}
                        step="any"
                        min="0"
                        className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
                        placeholder={unit === 'mm' ? 'e.g., 600' : 'e.g., 24'}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Height ({unit === 'mm' ? 'mm' : 'inches'})
                      </label>
                      <input
                        type="number"
                        value={height}
                        onChange={(e) => setHeight(e.target.value)}
                        step="any"
                        min="0"
                        className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
                        placeholder={unit === 'mm' ? 'e.g., 2400' : 'e.g., 96'}
                      />
                    </div>
                  </>
                )}

                {shape === 'stairs' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Number of Steps
                      </label>
                      <input
                        type="number"
                        value={numSteps}
                        onChange={(e) => setNumSteps(e.target.value)}
                        min="1"
                        max="20"
                        className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
                        placeholder="e.g., 3"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Step Rise ({unit === 'mm' ? 'mm' : 'inches'})
                      </label>
                      <input
                        type="number"
                        value={stepRise}
                        onChange={(e) => setStepRise(e.target.value)}
                        step="any"
                        min="0"
                        className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
                        placeholder={unit === 'mm' ? 'e.g., 180' : 'e.g., 7'}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Step Run ({unit === 'mm' ? 'mm' : 'inches'})
                      </label>
                      <input
                        type="number"
                        value={stepRun}
                        onChange={(e) => setStepRun(e.target.value)}
                        step="any"
                        min="0"
                        className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
                        placeholder={unit === 'mm' ? 'e.g., 280' : 'e.g., 11'}
                      />
                    </div>
                  </>
                )}

                {/* Waste Percentage */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Waste Percentage (%)
                  </label>
                  <input
                    type="number"
                    value={wastePercent}
                    onChange={(e) => setWastePercent(e.target.value)}
                    min="0"
                    max="30"
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
                    placeholder="10"
                  />
                  <p className="text-xs text-slate-500 mt-1">Standard: 10% for slabs, 5-15% for footings</p>
                </div>

                {/* Cost per yard */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Price per Cubic Yard ($)
                  </label>
                  <input
                    type="number"
                    value={pricePerYard}
                    onChange={(e) => setPricePerYard(e.target.value)}
                    min="0"
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
                    placeholder="125"
                  />
                  <p className="text-xs text-slate-500 mt-1">Ready-mix concrete: $125-$150 per yard</p>
                </div>
              </div>
            </div>

            {/* Results Section */}
            <div className="lg:col-span-2">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Results</h3>
              
              {results ? (
                <div className="space-y-4">
                  {/* Volume Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                      <div className="text-xs text-slate-500">Volume</div>
                      <div className="text-lg font-bold text-red-600">{results.volumeCubicYards.toFixed(2)}</div>
                      <div className="text-xs text-slate-500">cubic yards</div>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                      <div className="text-xs text-slate-500">Volume</div>
                      <div className="text-lg font-bold text-slate-800">{results.volumeCubicFeet.toFixed(2)}</div>
                      <div className="text-xs text-slate-500">cubic feet</div>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                      <div className="text-xs text-slate-500">Volume</div>
                      <div className="text-lg font-bold text-slate-800">{results.volumeCubicMeters.toFixed(3)}</div>
                      <div className="text-xs text-slate-500">cubic meters</div>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                      <div className="text-xs text-slate-500">Weight</div>
                      <div className="text-lg font-bold text-slate-800">{(results.weightLbs / 2000).toFixed(2)}</div>
                      <div className="text-xs text-slate-500">tons</div>
                    </div>
                  </div>

                  {/* With Waste */}
                  <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-amber-800">Volume with {results.waste}% Waste</span>
                      <span className="text-xs px-2 py-1 bg-amber-200 text-amber-800 rounded-full">
                        +{results.waste}%
                      </span>
                    </div>
                    <div className="text-2xl font-bold text-amber-900">
                      {results.volumeWithWaste.toFixed(2)} cubic yards
                    </div>
                    <div className="text-sm text-amber-700 mt-1">
                      = {(results.volumeWithWaste * 27).toFixed(2)} cubic feet
                    </div>
                  </div>

                  {/* Bags Needed */}
                  <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                    <div className="text-sm text-green-700 font-medium mb-3">Bags of Concrete Needed</div>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="bg-white rounded-lg p-3 border border-green-200 text-center">
                        <div className="text-xs text-slate-500">40 lb bags</div>
                        <div className="text-2xl font-bold text-green-600">{results.bags40}</div>
                        <div className="text-xs text-slate-500">bags</div>
                      </div>
                      <div className="bg-white rounded-lg p-3 border border-green-200 text-center">
                        <div className="text-xs text-slate-500">60 lb bags</div>
                        <div className="text-2xl font-bold text-green-600">{results.bags60}</div>
                        <div className="text-xs text-slate-500">bags</div>
                      </div>
                      <div className="bg-white rounded-lg p-3 border border-green-200 text-center">
                        <div className="text-xs text-slate-500">80 lb bags</div>
                        <div className="text-2xl font-bold text-green-600">{results.bags80}</div>
                        <div className="text-xs text-slate-500">bags</div>
                      </div>
                    </div>
                  </div>

                  {/* Cost Estimation */}
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <div className="text-sm text-blue-700 font-medium mb-2">Cost Estimation</div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-3xl font-bold text-blue-900">${results.totalCost.toFixed(2)}</div>
                        <div className="text-sm text-blue-700">Ready-mix concrete</div>
                      </div>
                      <div className="text-right text-sm text-blue-600">
                        <div>{results.volumeWithWaste.toFixed(2)} yards</div>
                        <div>× ${pricePerYard}/yard</div>
                      </div>
                    </div>
                  </div>

                  {/* Visual Diagram */}
                  <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                    <div className="text-sm text-red-700 font-medium mb-2">Shape Visualization</div>
                    <svg viewBox="0 0 400 200" className="w-full h-40 bg-white rounded border border-slate-200">
                      {shape === 'slab' && (
                        <>
                          {/* 3D slab */}
                          <rect x="50" y="80" width="200" height="20" fill="#fca5a5" stroke="#dc2626" strokeWidth="2" />
                          <polygon points="50,80 70,60 270,60 250,80" fill="#fecaca" stroke="#dc2626" strokeWidth="2" />
                          <polygon points="250,80 270,60 270,80 250,100" fill="#f87171" stroke="#dc2626" strokeWidth="2" />
                          <text x="150" y="95" textAnchor="middle" fontSize="12" fill="#991b1b">Slab</text>
                        </>
                      )}
                      {shape === 'footing' && (
                        <>
                          {/* 3D footing */}
                          <rect x="80" y="100" width="160" height="40" fill="#fca5a5" stroke="#dc2626" strokeWidth="2" />
                          <polygon points="80,100 100,80 260,80 240,100" fill="#fecaca" stroke="#dc2626" strokeWidth="2" />
                          <polygon points="240,100 260,80 260,120 240,140" fill="#f87171" stroke="#dc2626" strokeWidth="2" />
                          <text x="160" y="125" textAnchor="middle" fontSize="12" fill="#991b1b">Footing</text>
                        </>
                      )}
                      {shape === 'column' && (
                        <>
                          {/* 3D column */}
                          <ellipse cx="160" cy="140" rx="40" ry="15" fill="#fca5a5" stroke="#dc2626" strokeWidth="2" />
                          <rect x="120" y="60" width="80" height="80" fill="#fecaca" stroke="#dc2626" strokeWidth="2" />
                          <ellipse cx="160" cy="60" rx="40" ry="15" fill="#f87171" stroke="#dc2626" strokeWidth="2" />
                          <text x="160" y="105" textAnchor="middle" fontSize="12" fill="#991b1b">Column</text>
                        </>
                      )}
                      {shape === 'stairs' && (
                        <>
                          {/* Stairs */}
                          <rect x="50" y="140" width="60" height="20" fill="#fca5a5" stroke="#dc2626" strokeWidth="2" />
                          <rect x="110" y="120" width="60" height="40" fill="#fecaca" stroke="#dc2626" strokeWidth="2" />
                          <rect x="170" y="100" width="60" height="60" fill="#f87171" stroke="#dc2626" strokeWidth="2" />
                          <text x="140" y="90" textAnchor="middle" fontSize="12" fill="#991b1b">Stairs</text>
                        </>
                      )}
                    </svg>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-50 rounded-lg p-8 text-center border border-slate-200">
                  <div className="text-4xl mb-3">🧱</div>
                  <p className="text-slate-500">Enter dimensions to see results</p>
                </div>
              )}
            </div>
          </div>

          {/* Tips */}
          <div className="mt-8 p-4 bg-amber-50 rounded-lg border border-amber-200">
            <h4 className="font-semibold text-amber-800 mb-2">💡 Concrete Tips</h4>
            <ul className="text-sm text-amber-700 space-y-1">
              <li>• Always add 10% extra for waste and spillage</li>
              <li>• Standard slab thickness: 4 inches (100mm) for residential</li>
              <li>• Footings: typically 12" wide × 12" deep (300mm × 300mm)</li>
              <li>• Ready-mix concrete is more economical for large pours ({'>'}2 yards)</li>
              <li>• Bagged concrete is better for small projects</li>
              <li>• Concrete weight: ~150 lbs per cubic foot (2400 kg/m³)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
