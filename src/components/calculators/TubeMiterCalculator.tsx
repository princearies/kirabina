import { useState, useMemo } from 'react'
import { printTemplate, downloadPDF, downloadPNG } from '../../utils/printUtils'
import { Unit, toInches, fromInches, formatMeasurement } from '../../utils/unitConversion'
import BackButton from '../BackButton'

export default function TubeMiterCalculator() {
  const [diameter, setDiameter] = useState('4')
  const [angle, setAngle] = useState('90')
  const [halfTemplate, setHalfTemplate] = useState(false)
  const [plotIncrements, setPlotIncrements] = useState('10')
  const [unit, setUnit] = useState<Unit>('in')

  const results = useMemo(() => {
    // Convert input to inches for calculations
    const D_input = parseFloat(diameter) || 0
    const D = toInches(D_input, unit)
    const joinedAngle = parseFloat(angle) || 0

    if (D <= 0 || joinedAngle <= 0 || joinedAngle >= 180) return null

    // Each tube is cut at half the joined angle
    const miterAngle = joinedAngle / 2
    const miterAngleRad = (miterAngle * Math.PI) / 180
    const R = D / 2

    // Generate the miter profile points
    // For a miter cut on a round tube:
    // At each point around the circumference (angle φ from 0 to 360°):
    // The cut height from the end of the tube = R * tan(miterAngle) * (1 - cos(φ))
    // where φ = 0 is the short side and φ = 180° is the long side

    const numPoints = 72 // 5-degree increments
    const points: { angle: number; height: number; x: number; y: number }[] = []
    const circumference = Math.PI * D

    for (let i = 0; i <= numPoints; i++) {
      const phi = (i / numPoints) * 360 // degrees around the tube
      const phiRad = (phi * Math.PI) / 180
      const height = R * Math.tan(miterAngleRad) * (1 - Math.cos(phiRad))
      
      // For the template layout:
      // x = position along the circumference (unrolled)
      const x = (phi / 360) * circumference
      // y = height of cut at that position
      const y = height

      points.push({ angle: phi, height, x, y })
    }

    // Max height of the cut (at 180°)
    const maxHeight = R * Math.tan(miterAngleRad) * 2
    // Min height (at 0°) = 0
    const minHeight = 0

    // Approximate weld length (arc length around the join)
    let weldLength = 0
    for (let i = 1; i < points.length; i++) {
      const dx = points[i].x - points[i - 1].x
      const dy = points[i].y - points[i - 1].y
      weldLength += Math.sqrt(dx * dx + dy * dy)
    }

    // Template dimensions
    const templateWidth = circumference
    const templateHeight = maxHeight

    // Plot points at specified increments
    const inc = parseFloat(plotIncrements) || 10
    const plotPoints: { angle: number; lateralDistance: number; height: number }[] = []
    for (let a = 0; a <= 360; a += inc) {
      const phiRad = (a * Math.PI) / 180
      const height = R * Math.tan(miterAngleRad) * (1 - Math.cos(phiRad))
      const lateralDistance = (a / 360) * circumference
      plotPoints.push({ angle: a, lateralDistance, height })
    }

    return {
      miterAngle,
      maxHeight,
      minHeight,
      weldLength,
      circumference,
      templateWidth,
      templateHeight,
      points,
      plotPoints,
      D,
      R,
    }
  }, [diameter, angle, plotIncrements, unit])

  // SVG dimensions
  const svgWidth = 500
  const svgHeight = 250
  const padding = 30

  const getSvgPath = () => {
    if (!results) return ''
    
    const { points, circumference, maxHeight } = results
    
    // Scale to fit SVG
    const scaleX = (svgWidth - 2 * padding) / circumference
    const scaleY = maxHeight > 0 ? (svgHeight - 2 * padding) / (maxHeight * 1.3) : 1

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
      <BackButton />
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-8 py-6 text-white">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🔧</span>
            <div>
              <h2 className="text-2xl font-bold">Round Tube Miter Calculator</h2>
              <p className="text-purple-100 text-sm mt-1">Generate printable miter cutting templates for round tubes</p>
            </div>
          </div>
        </div>

        <div className="p-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Input Section */}
            <div>
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Tube & Cut Settings</h3>
              
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
                          ? 'bg-purple-600 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      Imperial (inches)
                    </button>
                    <button
                      onClick={() => setUnit('mm')}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        unit === 'mm'
                          ? 'bg-purple-600 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      Metric (mm)
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Tube Outside Diameter ({unit === 'mm' ? 'mm' : 'inches'})
                  </label>
                  <input
                    type="number"
                    value={diameter}
                    onChange={(e) => setDiameter(e.target.value)}
                    step="any"
                    min="0"
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
                    placeholder={unit === 'mm' ? 'e.g., 100' : 'e.g., 4'}
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    {unit === 'mm' ? 'Common: 25mm, 50mm, 75mm, 100mm, 150mm' : 'Common: 1", 2", 3", 4", 6"'}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Joined Angle (degrees)
                  </label>
                  <input
                    type="number"
                    value={angle}
                    onChange={(e) => setAngle(e.target.value)}
                    min="10"
                    max="170"
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
                    placeholder="90"
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    Angle between the two tubes when joined (e.g., 90° for a T or L join)
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Plot Increments (degrees)
                  </label>
                  <select
                    value={plotIncrements}
                    onChange={(e) => setPlotIncrements(e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
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
                    className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                  />
                  <label htmlFor="halfTemplate" className="text-sm text-slate-700">
                    Half Template Only (for large tubes)
                  </label>
                </div>

                {/* Visual angle indicator */}
                <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                  <div className="text-sm text-purple-700 font-medium mb-2">Join Angle Visualization</div>
                  <svg viewBox="0 0 120 80" className="w-full h-20">
                    {/* Tube 1 (horizontal) */}
                    <rect x="10" y="35" width="50" height="10" fill="#a78bfa" rx="5" />
                    {/* Tube 2 (at angle) */}
                    <g transform={`rotate(${-(parseFloat(angle) || 90)}, 60, 40)`}>
                      <rect x="60" y="35" width="50" height="10" fill="#7c3aed" rx="5" />
                    </g>
                    {/* Angle arc */}
                    <path 
                      d={`M 75 40 A 15 15 0 0 ${parseFloat(angle) > 90 ? 0 : 1} ${60 + 15 * Math.cos(-((parseFloat(angle) || 90) * Math.PI / 180))} ${40 + 15 * Math.sin(-((parseFloat(angle) || 90) * Math.PI / 180))}`}
                      fill="none" 
                      stroke="#f59e0b" 
                      strokeWidth="2" 
                    />
                    <text x="78" y="30" fontSize="10" fill="#7c3aed" fontWeight="bold">{angle}°</text>
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
                      <div className="text-xs text-slate-500">Cut Angle (each tube)</div>
                      <div className="text-lg font-bold text-purple-600">{results.miterAngle.toFixed(1)}°</div>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                      <div className="text-xs text-slate-500">Max Cut Height</div>
                      <div className="text-lg font-bold text-slate-800">{formatMeasurement(fromInches(results.maxHeight, unit), unit)}</div>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                      <div className="text-xs text-slate-500">Circumference</div>
                      <div className="text-lg font-bold text-slate-800">{formatMeasurement(fromInches(results.circumference, unit), unit)}</div>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                      <div className="text-xs text-slate-500">Weld Length (approx)</div>
                      <div className="text-lg font-bold text-slate-800">{formatMeasurement(fromInches(results.weldLength, unit), unit)}</div>
                    </div>
                  </div>

                  {/* Template SVG */}
                  <div className="bg-white rounded-lg p-4 border-2 border-dashed border-purple-200">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-purple-700 font-medium">
                          Miter Cut Template ({formatMeasurement(fromInches(results.templateWidth, unit), unit)} × {formatMeasurement(fromInches(results.templateHeight, unit), unit)})
                        </span>
                        <span className="text-[10px] px-2 py-0.5 bg-green-100 text-green-700 rounded-full font-semibold border border-green-200">
                          1:1 FULL SCALE
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => printTemplate('tube-miter-template', unit === 'mm' ? 'mm' : 'in')}
                          className="text-xs px-3 py-1.5 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors font-semibold shadow-sm"
                        >
                          🖨️ Full Scale Print
                        </button>
                        <button 
                          onClick={() => downloadPDF('tube-miter-template', 'tube-miter-template')}
                          className="text-xs px-3 py-1 bg-purple-100 text-purple-700 rounded-full hover:bg-purple-200 transition-colors"
                          title="Download as PDF (reference only - use Print for 1:1 scale)"
                        >
                          📄 PDF
                        </button>
                        <button 
                          onClick={() => downloadPNG('tube-miter-template', 'tube-miter-template')}
                          className="text-xs px-3 py-1 bg-purple-100 text-purple-700 rounded-full hover:bg-purple-200 transition-colors"
                          title="Download as PNG image"
                        >
                          🖼️ PNG
                        </button>
                      </div>
                    </div>
                    <div id="tube-miter-template">
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
                      
                      {/* Miter profile */}
                      <path 
                        d={getSvgPath()} 
                        fill="rgba(139, 92, 246, 0.15)" 
                        stroke="#7c3aed" 
                        strokeWidth="2" 
                      />
                      
                      {/* Labels */}
                      <text x={svgWidth / 2} y={svgHeight - 5} textAnchor="middle" fontSize="10" fill="#6b7280">
                        ← Circumference: {formatMeasurement(fromInches(results.circumference, unit), unit)} →
                      </text>
                      <text x={5} y={svgHeight / 2} textAnchor="middle" fontSize="9" fill="#6b7280" transform={`rotate(-90, 5, ${svgHeight/2})`}>
                        Height: {formatMeasurement(fromInches(results.maxHeight, unit), unit)}
                      </text>
                      
                      {/* Degree markers */}
                      {[0, 90, 180, 270, 360].map(deg => {
                        const xPos = padding + (deg / 360) * (svgWidth - 2 * padding)
                        return (
                          <g key={deg}>
                            <line x1={xPos} y1={svgHeight - padding} x2={xPos} y2={svgHeight - padding + 5} stroke="#7c3aed" strokeWidth="1" />
                            <text x={xPos} y={svgHeight - padding + 15} textAnchor="middle" fontSize="8" fill="#7c3aed">{deg}°</text>
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
                  <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
                    <div className="text-sm text-indigo-700 font-medium mb-2">
                      Cut Line Measurements (mark around tube)
                    </div>
                    <div className="max-h-40 overflow-y-auto">
                      <table className="w-full text-xs">
                        <thead className="sticky top-0 bg-indigo-100">
                          <tr>
                            <th className="text-left p-1.5 text-indigo-800">Angle</th>
                            <th className="text-left p-1.5 text-indigo-800">Lateral Distance ({unit})</th>
                            <th className="text-left p-1.5 text-indigo-800">Cut Height ({unit})</th>
                          </tr>
                        </thead>
                        <tbody>
                          {results.plotPoints.map((point, i) => (
                            <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-indigo-50'}>
                              <td className="p-1.5 text-slate-700">{point.angle}°</td>
                              <td className="p-1.5 text-slate-700">{formatMeasurement(fromInches(point.lateralDistance, unit), unit)}</td>
                              <td className="p-1.5 text-slate-700 font-medium">{formatMeasurement(fromInches(point.height, unit), unit)}</td>
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
                  <p className="text-slate-500">Enter tube diameter and angle to generate template</p>
                </div>
              )}
            </div>
          </div>

          {/* Instructions */}
          <div className="mt-8 p-4 bg-amber-50 rounded-lg border border-amber-200">
            <h4 className="font-semibold text-amber-800 mb-2">📋 How to Use This Template</h4>
            <ol className="text-sm text-amber-700 space-y-1 list-decimal list-inside">
              <li>Print the template at 100% scale (no scaling)</li>
              <li>Cut out the template along the curved line</li>
              <li>Wrap the template around the tube to be cut</li>
              <li>Align edges and mark the cut line with a marker</li>
              <li>Cut along the marked line using an angle grinder or bandsaw</li>
              <li>For large templates: print half only, mark 180°, flip template for other half</li>
            </ol>
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
