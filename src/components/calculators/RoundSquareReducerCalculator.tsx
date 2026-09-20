import { useState, useMemo } from 'react'
import { printTemplate, downloadPDF, downloadPNG } from '../../utils/printUtils'
import { Unit, toInches, fromInches, formatMeasurement } from '../../utils/unitConversion'

export default function RoundSquareReducerCalculator() {
  const [squareWidth, setSquareWidth] = useState('4')
  const [squareThick, setSquareThick] = useState('4')
  const [roundDiameter, setRoundDiameter] = useState('3')
  const [transitionLength, setTransitionLength] = useState('6')
  const [flangeLength, setFlangeLength] = useState('0.5')
  const [unit, setUnit] = useState<Unit>('in')
  const [isRectangular, setIsRectangular] = useState(false)

  const results = useMemo(() => {
    // Convert inputs to inches
    const SW = toInches(parseFloat(squareWidth) || 0, unit) // Square width
    const ST = toInches(parseFloat(squareThick) || 0, unit) // Square thickness (for rectangular)
    const RD = toInches(parseFloat(roundDiameter) || 0, unit) // Round diameter
    const TL = toInches(parseFloat(transitionLength) || 0, unit) // Transition length
    const FL = toInches(parseFloat(flangeLength) || 0, unit) // Flange length

    if (SW <= 0 || ST <= 0 || RD <= 0 || TL <= 0) return null
    if (RD >= SW || RD >= ST) return null // Round must be smaller than square

    const R = RD / 2 // Round radius
    const halfSW = SW / 2
    const halfST = ST / 2

    // Generate the flat pattern for the transition
    // This is a 4-sided transition piece that goes from round to square
    
    // For each side of the square, we need to calculate the transition curve
    // The pattern is developed by unrolling the transition surface
    
    const numPoints = 36 // Points around the round end
    const sides: { x: number; y: number }[][] = [[], [], [], []] // 4 sides
    
    // Side 1: Front (square width side)
    // Side 2: Right (square thickness side)
    // Side 3: Back (square width side)
    // Side 4: Left (square thickness side)
    
    // Calculate transition points for each side
    for (let i = 0; i <= numPoints; i++) {
      const angle = (i / numPoints) * (Math.PI / 2) // 0 to 90 degrees (one corner)
      
      // Position on round end
      const rx = R * Math.cos(angle)
      const ry = R * Math.sin(angle)
      
      // Position on square end (corner)
      const sx = halfSW
      const sy = halfST
      
      // Interpolate between round and square
      // This creates the transition curve
      const t = i / numPoints
      
      // Side 1 (front): from round to square width
      const s1x = rx + (sx - rx) * t
      const s1y = TL * t
      
      // Side 2 (right): from round to square thickness
      const s2x = ry + (sy - ry) * t
      const s2y = TL * t
      
      sides[0].push({ x: s1x, y: s1y })
      sides[1].push({ x: s2x, y: s2y })
    }
    
    // Calculate flat pattern dimensions
    // The flat pattern consists of 4 trapezoidal sections
    const patternWidth = 2 * (SW + ST) + 4 * FL // Total width with flanges
    const patternHeight = TL + Math.sqrt(Math.pow(halfSW - R, 2) + Math.pow(TL, 2)) + FL * 2
    
    // Generate flat pattern path
    const flatPattern: { x: number; y: number }[] = []
    
    // Bottom edge (square end with flanges)
    flatPattern.push({ x: -FL, y: 0 })
    flatPattern.push({ x: SW + FL, y: 0 })
    
    // Right side transition
    const rightTransitionHeight = Math.sqrt(Math.pow(halfST - R, 2) + Math.pow(TL, 2))
    flatPattern.push({ x: SW + FL, y: TL })
    
    // Top edge (round end)
    // Add semicircle for round end
    const roundPoints = 18
    for (let i = 0; i <= roundPoints; i++) {
      const angle = Math.PI + (i / roundPoints) * Math.PI
      const x = SW / 2 + R * Math.cos(angle)
      const y = TL + R * Math.sin(angle) + R
      flatPattern.push({ x, y })
    }
    
    // Left side transition
    flatPattern.push({ x: -FL, y: TL })
    flatPattern.push({ x: -FL, y: 0 })
    
    // Calculate diagonal lengths for reference
    const diagonal1 = Math.sqrt(Math.pow(halfSW - R, 2) + Math.pow(TL, 2))
    const diagonal2 = Math.sqrt(Math.pow(halfST - R, 2) + Math.pow(TL, 2))
    
    // Calculate surface area (approximate)
    const perimeter = 2 * (SW + ST)
    const avgPerimeter = (perimeter + Math.PI * RD) / 2
    const surfaceArea = avgPerimeter * TL
    
    return {
      SW, ST, RD, TL, FL, R,
      halfSW, halfST,
      sides,
      flatPattern,
      patternWidth,
      patternHeight,
      diagonal1,
      diagonal2,
      surfaceArea,
      numPoints,
    }
  }, [squareWidth, squareThick, roundDiameter, transitionLength, flangeLength, unit])

  // SVG dimensions
  const svgWidth = 600
  const svgHeight = 400
  const padding = 40

  const getFlatPatternPath = () => {
    if (!results) return ''
    
    const { SW, ST, TL, FL, R } = results
    
    // Scale to fit SVG
    const totalWidth = SW + 2 * FL
    const totalHeight = TL + 2 * R + 2 * FL
    const scale = Math.min(
      (svgWidth - 2 * padding) / totalWidth,
      (svgHeight - 2 * padding) / totalHeight
    )
    
    const offsetX = (svgWidth - totalWidth * scale) / 2
    const offsetY = (svgHeight - totalHeight * scale) / 2
    
    let path = ''
    
    // Draw flat pattern (one side of the transition)
    // Bottom edge (square end)
    const x1 = offsetX + FL * scale
    const y1 = offsetY + FL * scale
    const x2 = offsetX + (SW + FL) * scale
    const y2 = y1
    
    // Right transition
    const x3 = x2
    const y3 = offsetY + (TL + FL) * scale
    
    // Top curve (round end) - semicircle
    const centerX = offsetX + (SW / 2 + FL) * scale
    const centerY = offsetY + (TL + R + FL) * scale
    const radius = R * scale
    
    // Draw the pattern
    path += `M ${x1} ${y1}`
    path += ` L ${x2} ${y2}`
    path += ` L ${x3} ${y3}`
    
    // Semicircle for round end
    path += ` A ${radius} ${radius} 0 0 0 ${x1} ${y3}`
    path += ` Z`
    
    return path
  }

  const get3DViewPath = () => {
    if (!results) return ''
    
    const { SW, ST, TL, R } = results
    
    // Simple isometric view
    const scale = Math.min(
      (svgWidth - 2 * padding) / (SW + ST),
      (svgHeight - 2 * padding) / (TL + SW)
    )
    
    const offsetX = svgWidth / 2
    const offsetY = svgHeight / 2 + TL * scale / 2
    
    // Square end (bottom)
    const sq1x = offsetX - (SW / 2) * scale
    const sq1y = offsetY
    const sq2x = offsetX + (SW / 2) * scale
    const sq2y = offsetY
    const sq3x = offsetX + (SW / 2 + ST / 3) * scale
    const sq3y = offsetY - (ST / 3) * scale
    const sq4x = offsetX - (SW / 2 - ST / 3) * scale
    const sq4y = offsetY - (ST / 3) * scale
    
    // Round end (top)
    const roundY = offsetY - TL * scale
    const roundCenterX = offsetX
    const roundRadius = R * scale
    
    let path = ''
    
    // Square end
    path += `M ${sq1x} ${sq1y}`
    path += ` L ${sq2x} ${sq2y}`
    path += ` L ${sq3x} ${sq3y}`
    path += ` L ${sq4x} ${sq4y}`
    path += ` Z`
    
    // Transition lines
    path += ` M ${sq1x} ${sq1y} L ${roundCenterX - roundRadius} ${roundY}`
    path += ` M ${sq2x} ${sq2y} L ${roundCenterX + roundRadius} ${roundY}`
    
    // Round end (ellipse)
    path += ` M ${roundCenterX + roundRadius} ${roundY}`
    path += ` A ${roundRadius} ${roundRadius * 0.5} 0 1 0 ${roundCenterX - roundRadius} ${roundY}`
    path += ` A ${roundRadius} ${roundRadius * 0.5} 0 1 0 ${roundCenterX + roundRadius} ${roundY}`
    
    return path
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-teal-600 to-cyan-600 px-8 py-6 text-white">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🔧</span>
            <div>
              <h2 className="text-2xl font-bold">Round to Square Tube Reducer</h2>
              <p className="text-teal-100 text-sm mt-1">Generate flat pattern templates for tube transitions</p>
            </div>
          </div>
        </div>

        <div className="p-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Input Section */}
            <div>
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Tube Specifications</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Unit System
                  </label>
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <button
                      onClick={() => setUnit('in')}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        unit === 'in'
                          ? 'bg-teal-600 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      Imperial (inches)
                    </button>
                    <button
                      onClick={() => setUnit('mm')}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        unit === 'mm'
                          ? 'bg-teal-600 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      Metric (mm)
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Round Tube Diameter ({unit === 'mm' ? 'mm' : 'inches'})
                  </label>
                  <input
                    type="number"
                    value={roundDiameter}
                    onChange={(e) => setRoundDiameter(e.target.value)}
                    step="any"
                    min="0"
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all"
                    placeholder={unit === 'mm' ? 'e.g., 75' : 'e.g., 3'}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Square Tube Width ({unit === 'mm' ? 'mm' : 'inches'})
                  </label>
                  <input
                    type="number"
                    value={squareWidth}
                    onChange={(e) => setSquareWidth(e.target.value)}
                    step="any"
                    min="0"
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all"
                    placeholder={unit === 'mm' ? 'e.g., 100' : 'e.g., 4'}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isRectangular"
                    checked={isRectangular}
                    onChange={(e) => setIsRectangular(e.target.checked)}
                    className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500"
                  />
                  <label htmlFor="isRectangular" className="text-sm text-slate-700">
                    Rectangular tube (different width & thickness)
                  </label>
                </div>

                {isRectangular && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Square Tube Thickness ({unit === 'mm' ? 'mm' : 'inches'})
                    </label>
                    <input
                      type="number"
                      value={squareThick}
                      onChange={(e) => setSquareThick(e.target.value)}
                      step="any"
                      min="0"
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all"
                      placeholder={unit === 'mm' ? 'e.g., 60' : 'e.g., 2.5'}
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Transition Length ({unit === 'mm' ? 'mm' : 'inches'})
                  </label>
                  <input
                    type="number"
                    value={transitionLength}
                    onChange={(e) => setTransitionLength(e.target.value)}
                    step="any"
                    min="0"
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all"
                    placeholder={unit === 'mm' ? 'e.g., 150' : 'e.g., 6'}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Flange Length ({unit === 'mm' ? 'mm' : 'inches'})
                  </label>
                  <input
                    type="number"
                    value={flangeLength}
                    onChange={(e) => setFlangeLength(e.target.value)}
                    step="any"
                    min="0"
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all"
                    placeholder={unit === 'mm' ? 'e.g., 12' : 'e.g., 0.5'}
                  />
                  <p className="text-xs text-slate-500 mt-1">Flange for welding/tabs</p>
                </div>
              </div>
            </div>

            {/* Results & Template */}
            <div className="lg:col-span-2">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">
                Flat Pattern Template
              </h3>
              
              {results ? (
                <div className="space-y-4">
                  {/* Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                      <div className="text-xs text-slate-500">Round Dia.</div>
                      <div className="text-lg font-bold text-teal-600">{formatMeasurement(fromInches(results.RD, unit), unit)}</div>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                      <div className="text-xs text-slate-500">Square Size</div>
                      <div className="text-lg font-bold text-slate-800">
                        {isRectangular 
                          ? `${formatMeasurement(fromInches(results.SW, unit), unit)} × ${formatMeasurement(fromInches(results.ST, unit), unit)}`
                          : formatMeasurement(fromInches(results.SW, unit), unit)
                        }
                      </div>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                      <div className="text-xs text-slate-500">Transition Length</div>
                      <div className="text-lg font-bold text-slate-800">{formatMeasurement(fromInches(results.TL, unit), unit)}</div>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                      <div className="text-xs text-slate-500">Surface Area</div>
                      <div className="text-lg font-bold text-slate-800">{(results.surfaceArea / 144).toFixed(2)} sq ft</div>
                    </div>
                  </div>

                  {/* Template SVG */}
                  <div className="bg-white rounded-lg p-4 border-2 border-dashed border-teal-200">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-teal-700 font-medium">
                          Flat Pattern (One Side)
                        </span>
                        <span className="text-[10px] px-2 py-0.5 bg-green-100 text-green-700 rounded-full font-semibold border border-green-200">
                          1:1 FULL SCALE
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => printTemplate('round-square-reducer-template', unit === 'mm' ? 'mm' : 'in')}
                          className="text-xs px-3 py-1.5 bg-teal-600 text-white rounded-full hover:bg-teal-700 transition-colors font-semibold shadow-sm"
                        >
                          🖨️ Full Scale Print
                        </button>
                        <button 
                          onClick={() => downloadPDF('round-square-reducer-template', 'round-square-reducer')}
                          className="text-xs px-3 py-1 bg-teal-100 text-teal-700 rounded-full hover:bg-teal-200 transition-colors"
                          title="Download as PDF (reference only - use Print for 1:1 scale)"
                        >
                          📄 PDF
                        </button>
                        <button 
                          onClick={() => downloadPNG('round-square-reducer-template', 'round-square-reducer')}
                          className="text-xs px-3 py-1 bg-teal-100 text-teal-700 rounded-full hover:bg-teal-200 transition-colors"
                          title="Download as PNG image"
                        >
                          🖼️ PNG
                        </button>
                      </div>
                    </div>
                    <div id="round-square-reducer-template">
                    <svg 
                      viewBox={`0 0 ${svgWidth} ${svgHeight}`} 
                      className="w-full h-64 bg-slate-50 rounded border border-slate-200"
                    >
                      {/* Grid */}
                      {Array.from({ length: 7 }).map((_, i) => (
                        <line 
                          key={`h${i}`}
                          x1={padding} 
                          y1={padding + i * ((svgHeight - 2 * padding) / 6)} 
                          x2={svgWidth - padding} 
                          y2={padding + i * ((svgHeight - 2 * padding) / 6)}
                          stroke="#e2e8f0" 
                          strokeWidth="0.5" 
                        />
                      ))}
                      {Array.from({ length: 9 }).map((_, i) => (
                        <line 
                          key={`v${i}`}
                          x1={padding + i * ((svgWidth - 2 * padding) / 8)} 
                          y1={padding} 
                          x2={padding + i * ((svgWidth - 2 * padding) / 8)} 
                          y2={svgHeight - padding}
                          stroke="#e2e8f0" 
                          strokeWidth="0.5" 
                        />
                      ))}
                      
                      {/* Flat pattern */}
                      <path 
                        d={getFlatPatternPath()} 
                        fill="rgba(20, 184, 166, 0.15)" 
                        stroke="#0d9488" 
                        strokeWidth="2" 
                      />
                      
                      {/* Labels */}
                      <text x={svgWidth / 2} y={svgHeight - 10} textAnchor="middle" fontSize="11" fill="#6b7280">
                        Flat Pattern for Round → Square Transition
                      </text>
                    </svg>
                    </div>
                    
                    {/* On-screen ruler */}
                    <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-blue-800">📏 Scale Verification Ruler</span>
                        <span className="text-xs text-blue-600">Hold physical ruler against screen to verify</span>
                      </div>
                      <div className="flex h-8 bg-white border-2 border-slate-700 rounded overflow-hidden">
                        {Array.from({ length: 6 }).map((_, i) => (
                          <div key={i} className="flex-1 border-l border-slate-400 flex items-end justify-center pb-0.5 text-[9px] text-slate-700 font-mono first:border-l-0">
                            {i}"
                          </div>
                        ))}
                      </div>
                      <p className="text-[10px] text-blue-700 mt-1.5">
                        ⚠️ If ruler doesn't match your physical ruler, adjust browser zoom to 100% (Ctrl+0 / Cmd+0)
                      </p>
                    </div>
                  </div>

                  {/* 3D Preview */}
                  <div className="bg-cyan-50 rounded-lg p-4 border border-cyan-200">
                    <div className="text-sm text-cyan-700 font-medium mb-2">3D Preview (Isometric View)</div>
                    <svg 
                      viewBox={`0 0 ${svgWidth} ${svgHeight}`} 
                      className="w-full h-48 bg-white rounded border border-slate-200"
                    >
                      <path 
                        d={get3DViewPath()} 
                        fill="rgba(6, 182, 212, 0.1)" 
                        stroke="#0891b2" 
                        strokeWidth="2" 
                      />
                      <text x={svgWidth / 2} y={svgHeight - 10} textAnchor="middle" fontSize="10" fill="#6b7280">
                        Round → Square Transition Piece
                      </text>
                    </svg>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-50 rounded-lg p-8 text-center border border-slate-200">
                  <div className="text-4xl mb-3">🔧</div>
                  <p className="text-slate-500">Enter tube specifications to generate template</p>
                  {parseFloat(roundDiameter) >= parseFloat(squareWidth) && (
                    <p className="text-red-600 text-sm mt-2">
                      ⚠️ Round tube diameter must be smaller than square tube width
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Instructions */}
          <div className="mt-8 p-4 bg-amber-50 rounded-lg border border-amber-200">
            <h4 className="font-semibold text-amber-800 mb-2">📋 How to Use This Template</h4>
            <ol className="text-sm text-amber-700 space-y-1 list-decimal list-inside">
              <li>Print the template at 100% scale (no scaling)</li>
              <li>Cut out the flat pattern from sheet metal</li>
              <li>Bend along the transition lines to form the 3D shape</li>
              <li>Weld the seams to create the transition piece</li>
              <li>Attach round tube to one end, square tube to the other</li>
              <li>For multiple sides: cut 4 identical pieces (or 2 pairs for rectangular)</li>
            </ol>
          </div>

          {/* Tips */}
          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-blue-800 mb-2">💡 Fabrication Tips</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Use a brake or bend brake for accurate bends</li>
              <li>• Add flanges for easier welding and alignment</li>
              <li>• Test fit before final welding</li>
              <li>• Grind edges smooth after cutting</li>
              <li>• For rectangular tubes, you'll need 2 different patterns</li>
            </ul>
          </div>

          {/* Safety */}
          <div className="mt-4 p-4 bg-red-50 rounded-lg border border-red-200">
            <h4 className="font-semibold text-red-800 mb-2">⚠️ Safety Warning</h4>
            <p className="text-sm text-red-700">
              When cutting and welding metal, always wear appropriate PPE including safety glasses, gloves, 
              welding helmet, and hearing protection. Use proper ventilation and follow all safety procedures.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
