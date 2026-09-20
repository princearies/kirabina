import { useState } from 'react'
import BackButton from '../BackButton'

export default function RoofCalculator() {
  const [buildingWidth, setBuildingWidth] = useState('')
  const [buildingLength, setBuildingLength] = useState('')
  const [roofPitch, setRoofPitch] = useState('6')
  const [overhang, setOverhang] = useState('1')

  const calculate = () => {
    const width = parseFloat(buildingWidth) || 0
    const length = parseFloat(buildingLength) || 0
    const pitch = parseFloat(roofPitch) || 6
    const oh = parseFloat(overhang) || 0

    if (width <= 0 || length <= 0) return null

    const halfWidth = width / 2
    const rise = (pitch / 12) * halfWidth
    const rafterLength = Math.sqrt(halfWidth * halfWidth + rise * rise)
    const rafterWithOverhang = rafterLength + oh
    const roofArea = 2 * rafterWithOverhang * (length + 2 * oh)
    const angle = Math.atan(pitch / 12) * (180 / Math.PI)
    const ridgeHeight = rise

    return {
      rafterLength: rafterWithOverhang,
      ridgeHeight,
      roofArea,
      angle,
      pitchRatio: `${pitch}:12`,
      numberOfRafters: Math.ceil(length / 2) + 1,
    }
  }

  const results = calculate()

  return (
    <div className="max-w-4xl mx-auto">
      <BackButton />
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-8 py-6 text-white">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🏠</span>
            <div>
              <h2 className="text-2xl font-bold">Roof Calculator</h2>
              <p className="text-blue-100 text-sm mt-1">Gable roof rafter lengths, angles, and area</p>
            </div>
          </div>
        </div>

        <div className="p-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Input Section */}
            <div>
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Enter Roof Dimensions</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Building Width (ft)
                  </label>
                  <input
                    type="number"
                    value={buildingWidth}
                    onChange={(e) => setBuildingWidth(e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="e.g., 24"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Building Length (ft)
                  </label>
                  <input
                    type="number"
                    value={buildingLength}
                    onChange={(e) => setBuildingLength(e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="e.g., 32"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Roof Pitch (rise per 12" run)
                  </label>
                  <select
                    value={roofPitch}
                    onChange={(e) => setRoofPitch(e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  >
                    {[2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(p => (
                      <option key={p} value={p}>{p}:12 pitch</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Overhang (ft)
                  </label>
                  <input
                    type="number"
                    value={overhang}
                    onChange={(e) => setOverhang(e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="e.g., 1"
                  />
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
                        <div className="text-sm text-slate-500">Rafter Length</div>
                        <div className="text-xl font-bold text-slate-800">{results.rafterLength.toFixed(2)} ft</div>
                      </div>
                      <div>
                        <div className="text-sm text-slate-500">Ridge Height</div>
                        <div className="text-xl font-bold text-slate-800">{results.ridgeHeight.toFixed(2)} ft</div>
                      </div>
                      <div>
                        <div className="text-sm text-slate-500">Roof Area</div>
                        <div className="text-xl font-bold text-blue-600">{results.roofArea.toFixed(1)} sq ft</div>
                      </div>
                      <div>
                        <div className="text-sm text-slate-500">Roof Angle</div>
                        <div className="text-xl font-bold text-blue-600">{results.angle.toFixed(1)}°</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <div className="text-sm text-blue-700 font-medium">Additional Info</div>
                    <div className="mt-2 space-y-1">
                      <div className="flex justify-between">
                        <span className="text-slate-700">Pitch:</span>
                        <span className="font-bold text-slate-800">{results.pitchRatio}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-700">Rafters needed (16" OC):</span>
                        <span className="font-bold text-slate-800">{results.numberOfRafters} per side</span>
                      </div>
                    </div>
                  </div>

                  {/* Roof Diagram */}
                  <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
                    <div className="text-sm text-indigo-700 font-medium mb-2">Roof Cross Section</div>
                    <svg viewBox="0 0 200 120" className="w-full h-32">
                      {/* Building walls */}
                      <rect x="30" y="70" width="140" height="40" fill="none" stroke="#6366f1" strokeWidth="1.5" />
                      {/* Roof */}
                      <line x1="20" y1="70" x2="100" y2={70 - (results.ridgeHeight / Math.max(results.ridgeHeight, parseFloat(buildingWidth)/2)) * 50} stroke="#6366f1" strokeWidth="2" />
                      <line x1="180" y1="70" x2="100" y2={70 - (results.ridgeHeight / Math.max(results.ridgeHeight, parseFloat(buildingWidth)/2)) * 50} stroke="#6366f1" strokeWidth="2" />
                      {/* Ridge */}
                      <line x1="95" y1={70 - (results.ridgeHeight / Math.max(results.ridgeHeight, parseFloat(buildingWidth)/2)) * 50} x2="105" y2={70 - (results.ridgeHeight / Math.max(results.ridgeHeight, parseFloat(buildingWidth)/2)) * 50} stroke="#6366f1" strokeWidth="3" />
                      {/* Labels */}
                      <text x="100" y="118" textAnchor="middle" className="text-xs" fill="#4f46e5">{buildingWidth}'</text>
                    </svg>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-50 rounded-lg p-8 text-center border border-slate-200">
                  <div className="text-4xl mb-3">📐</div>
                  <p className="text-slate-500">Enter roof dimensions to see results</p>
                </div>
              )}
            </div>
          </div>

          {/* Info section */}
          <div className="mt-8 p-4 bg-amber-50 rounded-lg border border-amber-200">
            <h4 className="font-semibold text-amber-800 mb-2">💡 Common Roof Pitches</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-amber-700">
              <div>4:12 — Low slope</div>
              <div>6:12 — Standard</div>
              <div>8:12 — Steep</div>
              <div>12:12 — Very steep</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
