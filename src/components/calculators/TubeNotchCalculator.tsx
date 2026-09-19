import { useState, useMemo } from 'react'
import { printTemplate, downloadPDF, downloadPNG } from '../../utils/printUtils'
import { Unit, toInches, fromInches, formatMeasurement } from '../../utils/unitConversion'

export default function TubeNotchCalculator() {
  const [parentDiameter, setParentDiameter] = useState('6')
  const [cutDiameter, setCutDiameter] = useState('4')
  const [wallThickness, setWallThickness] = useState('0.125')
  const [cutAngle, setCutAngle] = useState('90')
  const [halfTemplate, setHalfTemplate] = useState(false)
  const [plotIncrements, setPlotIncrements] = useState('10')
  const [unit, setUnit] = useState<Unit>('in')

  const results = useMemo(() => {
    // Convert inputs to inches for calculations
    const D1_input = parseFloat(parentDiameter) || 0
    const D2_input = parseFloat(cutDiameter) || 0
    const wall_input = parseFloat(wallThickness) || 0
    
    const D1 = toInches(D1_input, unit)  // Parent tube diameter in inches
    const D2 = toInches(D2_input, unit)  // Cut tube diameter in inches
    const wall = toInches(wall_input, unit)  // Wall thickness in inches
    const angle = parseFloat(cutAngle) || 90

    if (D1 <= 0 || D2 <= 0 || D2 > D1) return null
    if (angle <= 0 || angle >= 180) return null

    const R1 = D1 / 2  // Parent tube radius
    const R2 = D2 / 2  // Cut tube radius
    
    // Effective cut diameter (accounting for wall thickness)
    const effectiveCutDiameter = D2 - 2 * wall
    const effectiveR2 = effectiveCutDiameter / 2

    // Circumference of cut tube
    const circumference = Math.PI * D2

    // Generate notch profile
    // For a tube notching into another tube at 90°:
    // At each point around the cut tube circumference (angle φ):
    // The notch depth = R1 - sqrt(R1² - (R2 * sin(φ))²)
    // This gives the saddle cut shape

    const numPoints = 72 // 5-degree increments
    const points: { angle: number; depth: number; x: number; y: number }[] = []

    for (let i = 0; i <= numPoints; i++) {
      const phi = (i / numPoints) * 360 // degrees around the cut tube
      const phiRad = (phi * Math.PI) / 180
      
      // Position along the cut tube circumference
      const x = (phi / 360) * circumference
      
      // Calculate notch depth at this point
      // For 90° intersection:
      const sinPhi = Math.sin(phiRad)
      const offset = R2 * sinPhi
      
      // Check if this point intersects the parent tube
      if (Math.abs(offset) <= R1) {
        const depth = R1 - Math.sqrt(R1 * R1 - offset * offset)
        points.push({ angle: phi, depth, x, y: depth })
      } else {
        points.push({ angle: phi, depth: 0, x, y: 0 })
      }
    }

    // Max notch depth (at 90° and 270°)
    const maxDepth = R1 - Math.sqrt(R1 * R1 - R2 * R2)
    
    // Calculate notch length along the cut tube
    let notchLength = 0
    for (let i = 1; i < points.length; i++) {
      const dx = points[i].x - points[i - 1].x
      const dy = points[i].y - points[i - 1].y
      notchLength += Math.sqrt(dx * dx + dy * dy)
    }

    // Plot points at specified increments
    const inc = parseFloat(plotIncrements) || 10
    const plotPoints: { angle: number; lateralDistance: number; depth: number }[] = []
    
    for (let a = 0; a <= 180; a += inc) {
      const phiRad = (a * Math.PI) / 180
      const sinPhi = Math.sin(phiRad)
      const offset = R2 * sinPhi
      
      let depth = 0
      if (Math.abs(offset) <= R1) {
        depth = R1 - Math.sqrt(R1 * R1 - offset * offset)
      }
      
      const lateralDistance = (a / 360) * circumference
      plotPoints.push({ angle: a, lateralDistance, depth })
    }

    return {
      maxDepth,
      notchLength,
      circumference,
      points,
      plotPoints,
      R1,
      R2,
      effectiveR2,
      D1,
      D2,
      effectiveCutDiameter,
    }
  }, [parentDiameter, cutDiameter, wallThickness, cutAngle, plotIncrements, unit])

  // SVG dimensions
  const svgWidth = 500
  const svgHeight = 200
  const padding = 30

  const getSvgPath = () => {
    if (!results) return ''
    
    const { points, circumference, maxDepth } = results
    
    // Scale to fit SVG
    const scaleX = (svgWidth - 2 * padding) / circumference
    const scaleY = maxDepth > 0 ? (svgHeight - 2 * padding) / (maxDepth * 1.3) : 1

    let path = ''
    points.forEach((point, i) => {
      const x = padding + point.x * scaleX
      const y = svgHeight - padding - point.y * scaleY
      if (i === 0) {
        path += `M ${x} ${y}`
      } else {
        path += ` L ${x} ${y}`
      }
    })

    // Close the bottom
    path += ` L ${svgWidth - padding} ${svgHeight - padding}`
    path += ` L ${padding} ${svgHeight - padding} Z`

    return path
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-orange-600 to-red-600 px-8 py-6 text-white">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🔧</span>
            <div>
              <h2 className="text-2xl font-bold">Tube Notching Calculator</h2>
              <p className="text-orange-100 text-sm mt-1">Generate saddle cut templates for tube intersections</p>
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
                          ? 'bg-orange-600 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      Imperial (inches)
                    </button>
                    <button
                      onClick={() => setUnit('mm')}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        unit === 'mm'
                          ? 'bg-orange-600 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      Metric (mm)
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Parent Tube Diameter ({unit === 'mm' ? 'mm' : 'inches'})
                  </label>
                  <input
                    type="number"
                    value={parentDiameter}
                    onChange={(e) => setParentDiameter(e.target.value)}
                    step="any"
                    min="0"
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                    placeholder={unit === 'mm' ? 'e.g., 150' : 'e.g., 6'}
                  />
                  <p className="text-xs text-slate-500 mt-1">Main tube that stays intact</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Cut Tube Diameter ({unit === 'mm' ? 'mm' : 'inches'})
                  </label>
                  <input
                    type="number"
                    value={cutDiameter}
                    onChange={(e) => setCutDiameter(e.target.value)}
                    step="any"
                    min="0"
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                    placeholder={unit === 'mm' ? 'e.g., 100' : 'e.g., 4'}
                  />
                  <p className="text-xs text-slate-500 mt-1">Tube to be notched (must be ≤ parent)</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Cut Tube Wall Thickness ({unit === 'mm' ? 'mm' : 'inches'})
                  </label>
                  <input
                    type="number"
                    value={wallThickness}
                    onChange={(e) => setWallThickness(e.target.value)}
                    step="any"
                    min="0"
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                    placeholder={unit === 'mm' ? 'e.g., 3' : 'e.g., 0.125'}
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    0 = cut to outside diameter (grind to fit)<br/>
                    {'>'}0 = cut to inside diameter (weld prep)
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Cut Angle (degrees)
                  </label>
                  <input
                    type="number"
                    value={cutAngle}
                    onChange={(e) => setCutAngle(e.target.value)}
                    min="10"
                    max="170"
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                    placeholder="90"
                  />
                  <p className="text-xs text-slate-500 mt-1">90° = perpendicular T-joint</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Plot Increments (degrees)
                  </label>
                  <select
                    value={plotIncrements}
                    onChange={(e) => setPlotIncrements(e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                  >
                    <option value="1">1°</option>
                    <option value="2">2°</option>
                    <option value="5">5°</option>
                    <option value="10">10°</option>
                    <option value="15">15°</option>
                    <option value="30">30°</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="halfTemplate"
                    checked={halfTemplate}
                    onChange={(e) => setHalfTemplate(e.target.checked)}
                    className="w-4 h-4 text-orange-600 rounded focus:ring-orange-500"
                  />
                  <label htmlFor="halfTemplate" className="text-sm text-slate-700">
                    Half Template Only (for large tubes)
                  </label>
                </div>

                {/* Visual diagram */}
                <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                  <div className="text-sm text-orange-700 font-medium mb-2">Intersection View</div>
                  <svg viewBox="0 0 120 100" className="w-full h-24">
                    {/* Parent tube (horizontal) */}
                    <ellipse cx="60" cy="50" rx="40" ry="20" fill="none" stroke="#ea580c" strokeWidth="2" />
                    <line x1="20" y1="50" x2="20" y2="50" stroke="#ea580c" strokeWidth="2" />
                    <line x1="100" y1="50" x2="100" y2="50" stroke="#ea580c" strokeWidth="2" />
                    
                    {/* Cut tube (vertical) */}
                    <ellipse cx="60" cy="20" rx="15" ry="8" fill="none" stroke="#dc2626" strokeWidth="2" />
                    <line x1="45" y1="20" x2="45" y2="50" stroke="#dc2626" strokeWidth="2" />
                    <line x1="75" y1="20" x2="75" y2="50" stroke="#dc2626" strokeWidth="2" />
                    
                    {/* Notch area */}
                    <path d="M 45 50 Q 60 60 75 50" fill="rgba(234, 88, 12, 0.2)" stroke="#ea580c" strokeWidth="1" strokeDasharray="2" />
                    
                    {/* Labels */}
                    <text x="60" y="80" textAnchor="middle" fontSize="8" fill="#ea580c">Parent: {parentDiameter}{unit === 'mm' ? 'mm' : '"'}</text>
                    <text x="60" y="10" textAnchor="middle" fontSize="8" fill="#dc2626">Cut: {cutDiameter}{unit === 'mm' ? 'mm' : '"'}</text>
                  </svg>
                </div>
              </div>
            </div>

            {/* Results & Template */}
            <div className="lg:col-span-2">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">
                {halfTemplate ? 'Half Template' : 'Full Template'} Preview
              </h3>
              
              {results ? (
                <div className="space-y-4">
                  {/* Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                      <div className="text-xs text-slate-500">Max Notch Depth</div>
                      <div className="text-lg font-bold text-orange-600">{formatMeasurement(fromInches(results.maxDepth, unit), unit)}</div>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                      <div className="text-xs text-slate-500">Cut Tube Circumference</div>
                      <div className="text-lg font-bold text-slate-800">{formatMeasurement(fromInches(results.circumference, unit), unit)}</div>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                      <div className="text-xs text-slate-500">Notch Length (approx)</div>
                      <div className="text-lg font-bold text-slate-800">{formatMeasurement(fromInches(results.notchLength, unit), unit)}</div>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                      <div className="text-xs text-slate-500">Effective Cut Dia.</div>
                      <div className="text-lg font-bold text-slate-800">{formatMeasurement(fromInches(results.effectiveCutDiameter, unit), unit)}</div>
                    </div>
                  </div>

                  {/* Template SVG */}
                  <div className="bg-white rounded-lg p-4 border-2 border-dashed border-orange-200">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-orange-700 font-medium">
                          Saddle Cut Template ({formatMeasurement(fromInches(results.circumference, unit), unit)} × {formatMeasurement(fromInches(results.maxDepth, unit), unit)})
                        </span>
                        <span className="text-[10px] px-2 py-0.5 bg-green-100 text-green-700 rounded-full font-semibold border border-green-200">
                          1:1 FULL SCALE
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => printTemplate('tube-notch-template', unit === 'mm' ? 'mm' : 'in')}
                          className="text-xs px-3 py-1.5 bg-orange-600 text-white rounded-full hover:bg-orange-700 transition-colors font-semibold shadow-sm"
                        >
                          🖨️ Full Scale Print
                        </button>
                        <button 
                          onClick={() => downloadPDF('tube-notch-template', 'tube-notch-template')}
                          className="text-xs px-3 py-1 bg-orange-100 text-orange-700 rounded-full hover:bg-orange-200 transition-colors"
                          title="Download as PDF (reference only - use Print for 1:1 scale)"
                        >
                          📄 PDF
                        </button>
                        <button 
                          onClick={() => downloadPNG('tube-notch-template', 'tube-notch-template')}
                          className="text-xs px-3 py-1 bg-orange-100 text-orange-700 rounded-full hover:bg-orange-200 transition-colors"
                          title="Download as PNG image"
                        >
                          🖼️ PNG
                        </button>
                      </div>
                    </div>
                    <div id="tube-notch-template">
                    <svg 
                      viewBox={`0 0 ${svgWidth} ${svgHeight}`} 
                      className="w-full h-48 bg-slate-50 rounded border border-slate-200"
                    >
                      {/* Grid lines */}
                      {Array.from({ length: 5 }).map((_, i) => (
                        <line 
                          key={`h${i}`}
                          x1={padding} 
                          y1={padding + i * ((svgHeight - 2 * padding) / 4)} 
                          x2={svgWidth - padding} 
                          y2={padding + i * ((svgHeight - 2 * padding) / 4)}
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
                      
                      {/* Notch profile */}
                      <path 
                        d={getSvgPath()} 
                        fill="rgba(234, 88, 12, 0.15)" 
                        stroke="#ea580c" 
                        strokeWidth="2" 
                      />
                      
                      {/* Labels */}
                      <text x={svgWidth / 2} y={svgHeight - 5} textAnchor="middle" fontSize="10" fill="#6b7280">
                        ← Circumference: {formatMeasurement(fromInches(results.circumference, unit), unit)} →
                      </text>
                      <text x={5} y={svgHeight / 2} textAnchor="middle" fontSize="9" fill="#6b7280" transform={`rotate(-90, 5, ${svgHeight/2})`}>
                        Depth: {formatMeasurement(fromInches(results.maxDepth, unit), unit)}
                      </text>
                      
                      {/* Degree markers */}
                      {[0, 90, 180, 270, 360].map(deg => {
                        const xPos = padding + (deg / 360) * (svgWidth - 2 * padding)
                        return (
                          <g key={deg}>
                            <line x1={xPos} y1={svgHeight - padding} x2={xPos} y2={svgHeight - padding + 5} stroke="#ea580c" strokeWidth="1" />
                            <text x={xPos} y={svgHeight - padding + 15} textAnchor="middle" fontSize="8" fill="#ea580c">{deg}°</text>
                          </g>
                        )
                      })}
                    </svg>
                    </div>
                    
                    {/* On-screen ruler for verification */}
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

                  {/* Plot Points Table */}
                  <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                    <div className="text-sm text-red-700 font-medium mb-2">
                      Notch Depth Measurements (mark around cut tube)
                    </div>
                    <div className="max-h-40 overflow-y-auto">
                      <table className="w-full text-xs">
                        <thead className="sticky top-0 bg-red-100">
                          <tr>
                            <th className="text-left p-1.5 text-red-800">Angle</th>
                            <th className="text-left p-1.5 text-red-800">Lateral Distance ({unit})</th>
                            <th className="text-left p-1.5 text-red-800">Notch Depth ({unit})</th>
                          </tr>
                        </thead>
                        <tbody>
                          {results.plotPoints.map((point, i) => (
                            <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-red-50'}>
                              <td className="p-1.5 text-slate-700">{point.angle}°</td>
                              <td className="p-1.5 text-slate-700">{formatMeasurement(fromInches(point.lateralDistance, unit), unit)}</td>
                              <td className="p-1.5 text-slate-700 font-medium">{formatMeasurement(fromInches(point.depth, unit), unit)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-50 rounded-lg p-8 text-center border border-slate-200">
                  <div className="text-4xl mb-3">🔧</div>
                  <p className="text-slate-500">Enter tube specifications to generate notch template</p>
                  {parseFloat(cutDiameter) > parseFloat(parentDiameter) && (
                    <p className="text-red-600 text-sm mt-2">
                      ⚠️ Cut tube diameter must be equal or smaller than parent tube
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
              <li>Cut out the template along the curved saddle line</li>
              <li>Wrap the template around the cut tube</li>
              <li>Align edges and mark the cut line with a marker</li>
              <li>Cut along the marked line using an angle grinder or bandsaw</li>
              <li>Grind the cut to fit snugly against the parent tube</li>
              <li>For large templates: print half only, mark 180°, flip template for other half</li>
            </ol>
          </div>

          {/* Tips */}
          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-blue-800 mb-2">💡 Pro Tips</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Set wall thickness to 0 for outside diameter fit (requires grinding)</li>
              <li>• Set wall thickness {'>'} 0 for inside diameter fit (better for welding)</li>
              <li>• Use a marker with fine tip for accurate marking</li>
              <li>• Test fit before tack welding</li>
              <li>• For multiple notches at different angles, use the multi-template option</li>
            </ul>
          </div>

          {/* Safety */}
          <div className="mt-4 p-4 bg-red-50 rounded-lg border border-red-200">
            <h4 className="font-semibold text-red-800 mb-2">⚠️ Safety Warning</h4>
            <p className="text-sm text-red-700">
              When cutting metal tubes, always wear appropriate PPE including safety glasses, gloves, and hearing protection. 
              If cutting produces dust or fumes, use proper ventilation and respiratory protection.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
