import { useState } from 'react'

export default function BrickCalculator() {
  const [wallWidth, setWallWidth] = useState('')
  const [wallHeight, setWallHeight] = useState('')
  const [brickType, setBrickType] = useState('standard')
  const [mortarJoint, setMortarJoint] = useState('0.375')

  const brickTypes: Record<string, { width: number; height: number; name: string }> = {
    standard: { width: 8, height: 2.25, name: 'Standard (8" × 2.25")' },
    modular: { width: 7.625, height: 2.25, name: 'Modular (7.625" × 2.25")' },
    queen: { width: 9.625, height: 2.75, name: 'Queen (9.625" × 2.75")' },
    king: { width: 9.625, height: 2.75, name: 'King (9.625" × 2.75")' },
    utility: { width: 11.625, height: 3.625, name: 'Utility (11.625" × 3.625")' },
  }

  const calculate = () => {
    const w = parseFloat(wallWidth) || 0
    const h = parseFloat(wallHeight) || 0
    const joint = parseFloat(mortarJoint) || 0.375
    const brick = brickTypes[brickType]

    if (w <= 0 || h <= 0) return null

    const wallWidthInches = w * 12
    const wallHeightInches = h * 12

    const brickWithMortarW = brick.width + joint
    const brickWithMortarH = brick.height + joint

    const bricksPerRow = Math.ceil(wallWidthInches / brickWithMortarW)
    const numRows = Math.ceil(wallHeightInches / brickWithMortarH)
    const totalBricks = bricksPerRow * numRows

    // Mortar calculation (approximate)
    const mortarCubicFeet = (totalBricks * 0.008).toFixed(2)
    const mortarBags = Math.ceil(totalBricks * 0.008 / 0.6)

    return {
      bricksPerRow,
      numRows,
      totalBricks,
      totalWithWaste: Math.ceil(totalBricks * 1.1),
      mortarCubicFeet,
      mortarBags,
      wallArea: (w * h).toFixed(1),
    }
  }

  const results = calculate()

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-8 py-6 text-white">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🧱</span>
            <div>
              <h2 className="text-2xl font-bold">Brick Calculator</h2>
              <p className="text-orange-100 text-sm mt-1">Calculate bricks and mortar for wall construction</p>
            </div>
          </div>
        </div>

        <div className="p-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Input Section */}
            <div>
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Enter Wall Dimensions</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Wall Width (ft)
                  </label>
                  <input
                    type="number"
                    value={wallWidth}
                    onChange={(e) => setWallWidth(e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                    placeholder="e.g., 20"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Wall Height (ft)
                  </label>
                  <input
                    type="number"
                    value={wallHeight}
                    onChange={(e) => setWallHeight(e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                    placeholder="e.g., 8"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Brick Type
                  </label>
                  <select
                    value={brickType}
                    onChange={(e) => setBrickType(e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                  >
                    {Object.entries(brickTypes).map(([key, val]) => (
                      <option key={key} value={key}>{val.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Mortar Joint (inches)
                  </label>
                  <select
                    value={mortarJoint}
                    onChange={(e) => setMortarJoint(e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                  >
                    <option value="0.25">3/8" (0.375)</option>
                    <option value="0.375">3/8" standard</option>
                    <option value="0.5">1/2"</option>
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
                        <div className="text-sm text-slate-500">Wall Area</div>
                        <div className="text-xl font-bold text-slate-800">{results.wallArea} sq ft</div>
                      </div>
                      <div>
                        <div className="text-sm text-slate-500">Total Bricks</div>
                        <div className="text-xl font-bold text-orange-600">{results.totalBricks}</div>
                      </div>
                      <div>
                        <div className="text-sm text-slate-500">Bricks per Row</div>
                        <div className="text-lg font-bold text-slate-700">{results.bricksPerRow}</div>
                      </div>
                      <div>
                        <div className="text-sm text-slate-500">Number of Rows</div>
                        <div className="text-lg font-bold text-slate-700">{results.numRows}</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                    <div className="text-sm text-orange-700 font-medium">Ordering Guide</div>
                    <div className="mt-2 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-slate-700">Bricks (with 10% waste):</span>
                        <span className="font-bold text-slate-800">{results.totalWithWaste}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-700">Mortar needed:</span>
                        <span className="font-bold text-slate-800">{results.mortarCubicFeet} cu ft</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-700">Mortar bags (60lb):</span>
                        <span className="font-bold text-slate-800">{results.mortarBags}</span>
                      </div>
                    </div>
                  </div>

                  {/* Brick Pattern */}
                  <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                    <div className="text-sm text-red-700 font-medium mb-2">Brick Pattern</div>
                    <div className="grid gap-0.5" style={{ gridTemplateColumns: `repeat(${Math.min(results.bricksPerRow, 10)}, 1fr)` }}>
                      {Array.from({ length: Math.min(results.numRows * Math.min(results.bricksPerRow, 10), 60) }).map((_, i) => {
                        const row = Math.floor(i / Math.min(results.bricksPerRow, 10))
                        const isOffset = row % 2 === 1
                        return (
                          <div 
                            key={i}
                            className="h-3 bg-orange-400 rounded-sm border border-orange-500"
                            style={{ marginLeft: isOffset && i % Math.min(results.bricksPerRow, 10) === 0 ? '50%' : '0' }}
                          ></div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-50 rounded-lg p-8 text-center border border-slate-200">
                  <div className="text-4xl mb-3">🧱</div>
                  <p className="text-slate-500">Enter wall dimensions to see results</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
