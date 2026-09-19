import { useState } from 'react'

export default function ConcreteCalculator() {
  const [length, setLength] = useState('')
  const [width, setWidth] = useState('')
  const [depth, setDepth] = useState('')
  const [unit, setUnit] = useState<'feet' | 'meters'>('feet')

  const calculate = () => {
    const l = parseFloat(length) || 0
    const w = parseFloat(width) || 0
    const d = parseFloat(depth) || 0

    if (l <= 0 || w <= 0 || d <= 0) return null

    let volumeCubicFeet: number
    let volumeCubicYards: number
    let bags40: number
    let bags60: number
    let bags80: number

    if (unit === 'feet') {
      volumeCubicFeet = l * w * d
      volumeCubicYards = volumeCubicFeet / 27
      bags40 = Math.ceil(volumeCubicFeet / 0.30)
      bags60 = Math.ceil(volumeCubicFeet / 0.45)
      bags80 = Math.ceil(volumeCubicFeet / 0.60)
    } else {
      const volumeCubicMeters = l * w * d
      volumeCubicFeet = volumeCubicMeters * 35.3147
      volumeCubicYards = volumeCubicFeet / 27
      bags40 = Math.ceil(volumeCubicFeet / 0.30)
      bags60 = Math.ceil(volumeCubicFeet / 0.45)
      bags80 = Math.ceil(volumeCubicFeet / 0.60)
    }

    return { volumeCubicFeet, volumeCubicYards, bags40, bags60, bags80 }
  }

  const results = calculate()

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-red-500 to-red-600 px-8 py-6 text-white">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🧱</span>
            <div>
              <h2 className="text-2xl font-bold">Concrete Calculator</h2>
              <p className="text-red-100 text-sm mt-1">Calculate concrete volume and bags needed</p>
            </div>
          </div>
        </div>

        <div className="p-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Input Section */}
            <div>
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Enter Dimensions</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Length ({unit === 'feet' ? 'ft' : 'm'})
                  </label>
                  <input
                    type="number"
                    value={length}
                    onChange={(e) => setLength(e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
                    placeholder="e.g., 10"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Width ({unit === 'feet' ? 'ft' : 'm'})
                  </label>
                  <input
                    type="number"
                    value={width}
                    onChange={(e) => setWidth(e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
                    placeholder="e.g., 10"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Depth ({unit === 'feet' ? 'ft' : 'm'})
                  </label>
                  <input
                    type="number"
                    value={depth}
                    onChange={(e) => setDepth(e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
                    placeholder="e.g., 0.33 (4 inches)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Unit</label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setUnit('feet')}
                      className={`flex-1 py-2 rounded-lg font-medium transition-all ${
                        unit === 'feet' 
                          ? 'bg-red-500 text-white' 
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      Imperial (ft)
                    </button>
                    <button
                      onClick={() => setUnit('meters')}
                      className={`flex-1 py-2 rounded-lg font-medium transition-all ${
                        unit === 'meters' 
                          ? 'bg-red-500 text-white' 
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      Metric (m)
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Results Section */}
            <div>
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Results</h3>
              
              {results ? (
                <div className="space-y-3">
                  <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                    <div className="text-sm text-slate-500">Volume</div>
                    <div className="text-xl font-bold text-slate-800">
                      {results.volumeCubicFeet.toFixed(2)} cu ft
                    </div>
                    <div className="text-sm text-slate-600 mt-1">
                      = {results.volumeCubicYards.toFixed(2)} cubic yards
                    </div>
                  </div>

                  <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                    <div className="text-sm text-green-700 font-medium">Bags of Concrete Needed</div>
                    <div className="mt-3 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-slate-700">40 lb bags:</span>
                        <span className="font-bold text-slate-800">{results.bags40}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-700">60 lb bags:</span>
                        <span className="font-bold text-slate-800">{results.bags60}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-700">80 lb bags:</span>
                        <span className="font-bold text-slate-800">{results.bags80}</span>
                      </div>
                    </div>
                  </div>

                  {/* Visual representation */}
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <div className="text-sm text-blue-700 font-medium mb-2">Slab Visualization</div>
                    <div className="relative bg-blue-200 rounded h-24 flex items-center justify-center overflow-hidden">
                      <div 
                        className="bg-blue-400 rounded opacity-75"
                        style={{
                          width: `${Math.min(90, (parseFloat(length) / Math.max(parseFloat(length), parseFloat(width))) * 90)}%`,
                          height: `${Math.min(90, (parseFloat(width) / Math.max(parseFloat(length), parseFloat(width))) * 90)}%`,
                        }}
                      ></div>
                      <div className="absolute bottom-1 left-1 text-xs text-blue-800 font-medium">
                        {length}' × {width}'
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-50 rounded-lg p-8 text-center border border-slate-200">
                  <div className="text-4xl mb-3">📐</div>
                  <p className="text-slate-500">Enter dimensions to see results</p>
                </div>
              )}
            </div>
          </div>

          {/* Info section */}
          <div className="mt-8 p-4 bg-amber-50 rounded-lg border border-amber-200">
            <h4 className="font-semibold text-amber-800 mb-2">💡 Tips</h4>
            <ul className="text-sm text-amber-700 space-y-1">
              <li>• Always add 10% extra for waste and spillage</li>
              <li>• Standard slab depth is 4 inches (0.33 ft)</li>
              <li>• Footings are typically 12" wide × 12" deep</li>
              <li>• Ready-mix concrete is usually more economical for large pours</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
