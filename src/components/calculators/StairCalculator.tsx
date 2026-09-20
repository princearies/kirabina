import { useState } from 'react'
import BackButton from '../BackButton'

export default function StairCalculator() {
  const [totalRise, setTotalRise] = useState('')
  const [totalRun, setTotalRun] = useState('')
  const [desiredRise, setDesiredRise] = useState('7.5')

  const calculate = () => {
    const rise = parseFloat(totalRise) || 0
    const run = parseFloat(totalRun) || 0
    const desired = parseFloat(desiredRise) || 7.5

    if (rise <= 0 || run <= 0) return null

    const numSteps = Math.round(rise / desired)
    const actualRise = rise / numSteps
    const actualRun = run / (numSteps - 1)
    const stringerLength = Math.sqrt(rise * rise + run * run)
    const angle = Math.atan(rise / run) * (180 / Math.PI)

    return {
      numSteps,
      actualRise,
      actualRun,
      stringerLength,
      angle,
      numTreads: numSteps - 1,
      numRisers: numSteps,
    }
  }

  const results = calculate()

  return (
    <div className="max-w-4xl mx-auto">
      <BackButton />
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-green-500 to-green-600 px-8 py-6 text-white">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🪜</span>
            <div>
              <h2 className="text-2xl font-bold">Stair Calculator</h2>
              <p className="text-green-100 text-sm mt-1">Calculate stair dimensions and stringer layout</p>
            </div>
          </div>
        </div>

        <div className="p-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Input Section */}
            <div>
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Enter Stair Dimensions</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Total Rise (inches)
                  </label>
                  <input
                    type="number"
                    value={totalRise}
                    onChange={(e) => setTotalRise(e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
                    placeholder="e.g., 108"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Total Run (inches)
                  </label>
                  <input
                    type="number"
                    value={totalRun}
                    onChange={(e) => setTotalRun(e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
                    placeholder="e.g., 144"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Desired Riser Height (inches)
                  </label>
                  <input
                    type="number"
                    value={desiredRise}
                    onChange={(e) => setDesiredRise(e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
                    placeholder="7.5"
                  />
                  <p className="text-xs text-slate-500 mt-1">Standard: 7" to 7.75" per building code</p>
                </div>
              </div>
            </div>

            {/* Results Section */}
            <div>
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Results</h3>
              
              {results ? (
                <div className="space-y-3">
                  <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <div className="text-sm text-slate-500">Number of Risers</div>
                        <div className="text-xl font-bold text-slate-800">{results.numRisers}</div>
                      </div>
                      <div>
                        <div className="text-sm text-slate-500">Number of Treads</div>
                        <div className="text-xl font-bold text-slate-800">{results.numTreads}</div>
                      </div>
                      <div>
                        <div className="text-sm text-slate-500">Actual Riser Height</div>
                        <div className="text-xl font-bold text-green-600">{results.actualRise.toFixed(2)}"</div>
                      </div>
                      <div>
                        <div className="text-sm text-slate-500">Actual Tread Depth</div>
                        <div className="text-xl font-bold text-green-600">{results.actualRun.toFixed(2)}"</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                    <div className="text-sm text-green-700 font-medium">Stringer Details</div>
                    <div className="mt-2 space-y-1">
                      <div className="flex justify-between">
                        <span className="text-slate-700">Stringer Length:</span>
                        <span className="font-bold text-slate-800">{results.stringerLength.toFixed(2)}" ({(results.stringerLength / 12).toFixed(2)} ft)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-700">Stair Angle:</span>
                        <span className="font-bold text-slate-800">{results.angle.toFixed(1)}°</span>
                      </div>
                    </div>
                  </div>

                  {/* Stair Diagram */}
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <div className="text-sm text-blue-700 font-medium mb-2">Stair Profile</div>
                    <svg viewBox="0 0 200 120" className="w-full h-32">
                      {/* Draw stairs */}
                      {Array.from({ length: Math.min(results.numTreads, 8) }).map((_, i) => {
                        const stepWidth = 180 / Math.min(results.numTreads, 8)
                        const stepHeight = 100 / results.numSteps
                        const x = i * stepWidth
                        const y = 110 - (i + 1) * stepHeight
                        return (
                          <g key={i}>
                            <rect
                              x={x}
                              y={y}
                              width={stepWidth}
                              height={stepHeight}
                              fill="none"
                              stroke="#3b82f6"
                              strokeWidth="1.5"
                            />
                          </g>
                        )
                      })}
                      {/* Baseline */}
                      <line x1="0" y1="110" x2="200" y2="110" stroke="#94a3b8" strokeWidth="1" strokeDasharray="4" />
                    </svg>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-50 rounded-lg p-8 text-center border border-slate-200">
                  <div className="text-4xl mb-3">📐</div>
                  <p className="text-slate-500">Enter stair dimensions to see results</p>
                </div>
              )}
            </div>
          </div>

          {/* Code compliance */}
          <div className="mt-8 p-4 bg-amber-50 rounded-lg border border-amber-200">
            <h4 className="font-semibold text-amber-800 mb-2">⚠️ Building Code Reference (IRC)</h4>
            <ul className="text-sm text-amber-700 space-y-1">
              <li>• Maximum riser height: 7.75 inches</li>
              <li>• Minimum tread depth: 10 inches</li>
              <li>• Maximum variation between risers: 3/8 inch</li>
              <li>• Minimum stair width: 36 inches</li>
              <li>• Handrail required if total rise exceeds 30 inches</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
