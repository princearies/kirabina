import { useState } from 'react'

export default function DeckCalculator() {
  const [deckWidth, setDeckWidth] = useState('')
  const [deckLength, setDeckLength] = useState('')
  const [boardWidth, setBoardWidth] = useState('5.5')
  const [boardGap, setBoardGap] = useState('0.25')
  const [joistSpacing, setJoistSpacing] = useState('16')

  const calculate = () => {
    const width = parseFloat(deckWidth) || 0
    const length = parseFloat(deckLength) || 0
    const bWidth = parseFloat(boardWidth) || 5.5
    const gap = parseFloat(boardGap) || 0.25
    const jSpacing = parseFloat(joistSpacing) || 16

    if (width <= 0 || length <= 0) return null

    const widthInches = width * 12
    const lengthInches = length * 12
    
    // Boards needed (running along length)
    const boardSpacing = bWidth + gap
    const numBoards = Math.ceil(widthInches / boardSpacing)
    
    // Total linear feet of boards
    const totalBoardLength = numBoards * length
    
    // Joists needed
    const numJoists = Math.ceil(widthInches / jSpacing) + 1

    return {
      numBoards,
      totalBoardLength: totalBoardLength.toFixed(1),
      numJoists,
      deckArea: (width * length).toFixed(1),
      boardSpacing: boardSpacing.toFixed(2),
    }
  }

  const results = calculate()

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-amber-500 to-amber-600 px-8 py-6 text-white">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🏗️</span>
            <div>
              <h2 className="text-2xl font-bold">Deck Calculator</h2>
              <p className="text-amber-100 text-sm mt-1">Calculate decking boards and joist spacing</p>
            </div>
          </div>
        </div>

        <div className="p-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Input Section */}
            <div>
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Enter Deck Dimensions</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Deck Width (ft)
                  </label>
                  <input
                    type="number"
                    value={deckWidth}
                    onChange={(e) => setDeckWidth(e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
                    placeholder="e.g., 12"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Deck Length (ft)
                  </label>
                  <input
                    type="number"
                    value={deckLength}
                    onChange={(e) => setDeckLength(e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
                    placeholder="e.g., 16"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Board Width (inches)
                  </label>
                  <input
                    type="number"
                    value={boardWidth}
                    onChange={(e) => setBoardWidth(e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
                    placeholder="5.5"
                  />
                  <p className="text-xs text-slate-500 mt-1">Actual width of a 2x6 is 5.5"</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Gap Between Boards (inches)
                  </label>
                  <input
                    type="number"
                    value={boardGap}
                    onChange={(e) => setBoardGap(e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
                    placeholder="0.25"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Joist Spacing (inches)
                  </label>
                  <select
                    value={joistSpacing}
                    onChange={(e) => setJoistSpacing(e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
                  >
                    <option value="12">12" on center</option>
                    <option value="16">16" on center</option>
                    <option value="24">24" on center</option>
                  </select>
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
                        <div className="text-sm text-slate-500">Deck Area</div>
                        <div className="text-xl font-bold text-slate-800">{results.deckArea} sq ft</div>
                      </div>
                      <div>
                        <div className="text-sm text-slate-500">Boards Needed</div>
                        <div className="text-xl font-bold text-amber-600">{results.numBoards}</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                    <div className="text-sm text-amber-700 font-medium">Materials</div>
                    <div className="mt-2 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-slate-700">Total board length:</span>
                        <span className="font-bold text-slate-800">{results.totalBoardLength} linear ft</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-700">Joists needed:</span>
                        <span className="font-bold text-slate-800">{results.numJoists}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-700">Board spacing:</span>
                        <span className="font-bold text-slate-800">{results.boardSpacing}"</span>
                      </div>
                    </div>
                  </div>

                  {/* Deck Diagram */}
                  <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                    <div className="text-sm text-orange-700 font-medium mb-2">Deck Layout (Top View)</div>
                    <svg viewBox="0 0 200 120" className="w-full h-28">
                      {/* Deck surface */}
                      <rect x="20" y="20" width="160" height="80" fill="#fbbf24" fillOpacity="0.3" stroke="#d97706" strokeWidth="1.5" rx="2" />
                      {/* Boards */}
                      {Array.from({ length: Math.min(results.numBoards, 15) }).map((_, i) => {
                        const y = 20 + (i * (80 / Math.min(results.numBoards, 15)))
                        return (
                          <line key={i} x1="20" y1={y} x2="180" y2={y} stroke="#92400e" strokeWidth="0.5" />
                        )
                      })}
                      {/* Joists */}
                      {Array.from({ length: Math.min(results.numJoists, 10) }).map((_, i) => {
                        const x = 20 + (i * (160 / Math.max(results.numJoists - 1, 1)))
                        return (
                          <line key={i} x1={x} y1="20" x2={x} y2="100" stroke="#78350f" strokeWidth="1" strokeDasharray="3" />
                        )
                      })}
                      <text x="100" y="115" textAnchor="middle" className="text-xs" fill="#92400e">{deckWidth}' × {deckLength}'</text>
                    </svg>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-50 rounded-lg p-8 text-center border border-slate-200">
                  <div className="text-4xl mb-3">📐</div>
                  <p className="text-slate-500">Enter deck dimensions to see results</p>
                </div>
              )}
            </div>
          </div>

          {/* Tips */}
          <div className="mt-8 p-4 bg-amber-50 rounded-lg border border-amber-200">
            <h4 className="font-semibold text-amber-800 mb-2">💡 Deck Building Tips</h4>
            <ul className="text-sm text-amber-700 space-y-1">
              <li>• Add 10% extra material for cuts and waste</li>
              <li>• Use pressure-treated lumber for structural members</li>
              <li>• Leave gaps between boards for drainage</li>
              <li>• Check local building codes for permit requirements</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
