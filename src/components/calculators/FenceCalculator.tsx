import { useState } from 'react'
import BackButton from '../BackButton'

export default function FenceCalculator() {
  const [fenceLength, setFenceLength] = useState('')
  const [fenceHeight, setFenceHeight] = useState('6')
  const [postSpacing, setPostSpacing] = useState('8')
  const [picketWidth, setPicketWidth] = useState('3.5')
  const [picketGap, setPicketGap] = useState('2.5')

  const calculate = () => {
    const length = parseFloat(fenceLength) || 0
    const height = parseFloat(fenceHeight) || 6
    const spacing = parseFloat(postSpacing) || 8
    const pWidth = parseFloat(picketWidth) || 3.5
    const pGap = parseFloat(picketGap) || 2.5

    if (length <= 0) return null

    const numPosts = Math.ceil(length / spacing) + 1
    const numSections = numPosts - 1
    
    // Rails (2 or 3 per section)
    const railsPerSection = height > 5 ? 3 : 2
    const totalRails = numSections * railsPerSection
    const railLength = spacing
    
    // Pickets per section
    const sectionWidthInches = spacing * 12
    const picketSpacing = pWidth + pGap
    const picketsPerSection = Math.floor(sectionWidthInches / picketSpacing)
    const totalPickets = picketsPerSection * numSections

    return {
      numPosts,
      numSections,
      totalRails,
      railsPerSection,
      railLength: railLength.toFixed(1),
      totalPickets,
      picketsPerSection,
      totalLength: length,
    }
  }

  const results = calculate()

  return (
    <div className="max-w-4xl mx-auto">
      <BackButton />
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 px-8 py-6 text-white">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🏡</span>
            <div>
              <h2 className="text-2xl font-bold">Fence Calculator</h2>
              <p className="text-emerald-100 text-sm mt-1">Calculate posts, rails, and pickets for your fence</p>
            </div>
          </div>
        </div>

        <div className="p-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Input Section */}
            <div>
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Enter Fence Specifications</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Fence Length (ft)
                  </label>
                  <input
                    type="number"
                    value={fenceLength}
                    onChange={(e) => setFenceLength(e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                    placeholder="e.g., 100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Fence Height (ft)
                  </label>
                  <select
                    value={fenceHeight}
                    onChange={(e) => setFenceHeight(e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                  >
                    <option value="4">4 feet</option>
                    <option value="5">5 feet</option>
                    <option value="6">6 feet</option>
                    <option value="8">8 feet</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Post Spacing (ft)
                  </label>
                  <select
                    value={postSpacing}
                    onChange={(e) => setPostSpacing(e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                  >
                    <option value="6">6 feet</option>
                    <option value="8">8 feet</option>
                    <option value="10">10 feet</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Picket Width (inches)
                  </label>
                  <input
                    type="number"
                    value={picketWidth}
                    onChange={(e) => setPicketWidth(e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                    placeholder="3.5"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Gap Between Pickets (inches)
                  </label>
                  <input
                    type="number"
                    value={picketGap}
                    onChange={(e) => setPicketGap(e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                    placeholder="2.5"
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
                        <div className="text-sm text-slate-500">Posts Needed</div>
                        <div className="text-xl font-bold text-slate-800">{results.numPosts}</div>
                      </div>
                      <div>
                        <div className="text-sm text-slate-500">Total Pickets</div>
                        <div className="text-xl font-bold text-emerald-600">{results.totalPickets}</div>
                      </div>
                      <div>
                        <div className="text-sm text-slate-500">Rail Sections</div>
                        <div className="text-lg font-bold text-slate-700">{results.numSections}</div>
                      </div>
                      <div>
                        <div className="text-sm text-slate-500">Total Rails</div>
                        <div className="text-lg font-bold text-slate-700">{results.totalRails}</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
                    <div className="text-sm text-emerald-700 font-medium">Materials Summary</div>
                    <div className="mt-2 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-slate-700">4x4 Posts ({fenceHeight}+2ft for setting):</span>
                        <span className="font-bold text-slate-800">{results.numPosts}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-700">2x4 Rails ({results.railLength}' each):</span>
                        <span className="font-bold text-slate-800">{results.totalRails}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-700">Pickets per section:</span>
                        <span className="font-bold text-slate-800">{results.picketsPerSection}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-700">Concrete for posts:</span>
                        <span className="font-bold text-slate-800">{results.numPosts} bags</span>
                      </div>
                    </div>
                  </div>

                  {/* Fence Diagram */}
                  <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                    <div className="text-sm text-green-700 font-medium mb-2">Fence Section View</div>
                    <svg viewBox="0 0 200 100" className="w-full h-24">
                      {/* Posts */}
                      <rect x="10" y="20" width="8" height="70" fill="#78350f" rx="1" />
                      <rect x="182" y="20" width="8" height="70" fill="#78350f" rx="1" />
                      {/* Rails */}
                      <rect x="10" y="30" width="180" height="4" fill="#92400e" rx="1" />
                      <rect x="10" y="55" width="180" height="4" fill="#92400e" rx="1" />
                      <rect x="10" y="78" width="180" height="4" fill="#92400e" rx="1" />
                      {/* Pickets */}
                      {Array.from({ length: 12 }).map((_, i) => (
                        <rect key={i} x={25 + i * 13} y="22" width="6" height="68" fill="#d97706" rx="1" />
                      ))}
                      {/* Post caps */}
                      <rect x="8" y="16" width="12" height="6" fill="#451a03" rx="1" />
                      <rect x="180" y="16" width="12" height="6" fill="#451a03" rx="1" />
                    </svg>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-50 rounded-lg p-8 text-center border border-slate-200">
                  <div className="text-4xl mb-3">🏡</div>
                  <p className="text-slate-500">Enter fence specifications to see results</p>
                </div>
              )}
            </div>
          </div>

          {/* Tips */}
          <div className="mt-8 p-4 bg-amber-50 rounded-lg border border-amber-200">
            <h4 className="font-semibold text-amber-800 mb-2">💡 Fence Building Tips</h4>
            <ul className="text-sm text-amber-700 space-y-1">
              <li>• Set posts 2 feet deep (or below frost line)</li>
              <li>• Use gravel at the bottom of post holes for drainage</li>
              <li>• Allow 10% extra for cuts and damaged pieces</li>
              <li>• Check property lines before building</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
