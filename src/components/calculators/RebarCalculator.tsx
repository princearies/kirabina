import { useState, useMemo } from 'react';
import { Unit, toInches, fromInches, formatMeasurement } from '../../utils/unitConversion';

// Rebar sizes and their weights (lb/ft)
const REBAR_SIZES = {
  3: { diameter: 0.375, weight: 0.376 },
  4: { diameter: 0.5, weight: 0.668 },
  5: { diameter: 0.625, weight: 1.043 },
  6: { diameter: 0.75, weight: 1.502 },
  7: { diameter: 0.875, weight: 2.044 },
  8: { diameter: 1.0, weight: 2.67 },
  9: { diameter: 1.128, weight: 3.4 },
  10: { diameter: 1.27, weight: 4.303 },
  11: { diameter: 1.41, weight: 5.313 },
  14: { diameter: 1.693, weight: 7.65 },
  18: { diameter: 2.257, weight: 13.6 },
};

export default function RebarCalculator() {
  const [slabLength, setSlabLength] = useState('20');
  const [slabWidth, setSlabWidth] = useState('12');
  const [spacingLength, setSpacingLength] = useState('16');
  const [spacingWidth, setSpacingWidth] = useState('16');
  const [edgeClearance, setEdgeClearance] = useState('3');
  const [barSize, setBarSize] = useState<keyof typeof REBAR_SIZES>(5);
  const [wastePercent, setWastePercent] = useState('10');
  const [barLength, setBarLength] = useState('20');
  const [costPerFoot, setCostPerFoot] = useState('');
  const [unit, setUnit] = useState<Unit>('in');
  const [differentSpacing, setDifferentSpacing] = useState(false);

  const results = useMemo(() => {
    // Convert all inputs to inches
    const lengthInches = toInches(parseFloat(slabLength) || 0, unit);
    const widthInches = toInches(parseFloat(slabWidth) || 0, unit);
    const spacingL = toInches(parseFloat(spacingLength) || 0, unit);
    const spacingW = toInches(parseFloat(spacingWidth) || 0, unit);
    const clearance = toInches(parseFloat(edgeClearance) || 0, unit);
    const barLen = toInches(parseFloat(barLength) || 0, unit === 'in' ? 'ft' : unit);

    if (lengthInches <= 0 || widthInches <= 0 || spacingL <= 0 || spacingW <= 0) {
      return null;
    }

    // Calculate number of bars in each direction
    const effectiveLength = lengthInches - 2 * clearance;
    const effectiveWidth = widthInches - 2 * clearance;

    const numBarsLength = Math.ceil(effectiveLength / spacingL) + 1;
    const numBarsWidth = Math.ceil(effectiveWidth / spacingW) + 1;

    // Calculate total length of rebar
    const totalLengthBars = numBarsLength * widthInches;
    const totalWidthBars = numBarsWidth * lengthInches;
    const totalRebarLength = totalLengthBars + totalWidthBars;

    // Add waste
    const waste = parseFloat(wastePercent) || 0;
    const totalWithWaste = totalRebarLength * (1 + waste / 100);

    // Calculate weight
    const rebarInfo = REBAR_SIZES[barSize];
    const weightPerFoot = rebarInfo.weight;
    const totalWeight = (totalWithWaste / 12) * weightPerFoot;

    // Calculate number of bar lengths needed
    const numBars = Math.ceil(totalWithWaste / barLen);

    // Calculate cost
    const cost = costPerFoot ? (totalWithWaste / 12) * parseFloat(costPerFoot) : 0;

    // Calculate concrete volume (assuming 4" thickness)
    const slabArea = (lengthInches * widthInches) / 144; // sq ft
    const volume = slabArea * (4 / 12); // cubic feet (4" thickness)

    return {
      numBarsLength,
      numBarsWidth,
      totalBars: numBarsLength + numBarsWidth,
      totalLengthBars: totalLengthBars / 12,
      totalWidthBars: totalWidthBars / 12,
      totalRebarLength: totalWithWaste / 12,
      totalWeight,
      numBars,
      cost,
      slabArea,
      volume,
      rebarInfo,
    };
  }, [slabLength, slabWidth, spacingLength, spacingWidth, edgeClearance, barSize, wastePercent, barLength, costPerFoot, unit]);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-gray-700 to-gray-900 text-white p-6">
          <h1 className="text-3xl font-bold mb-2">Rebar Calculator</h1>
          <p className="text-gray-200">Calculate rebar spacing, layout, and weight for concrete slabs</p>
        </div>

        <div className="p-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Input Section */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Slab Dimensions</h2>
              
              {/* Unit Selector */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Unit System</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setUnit('in')}
                    className={`flex-1 px-4 py-2 rounded-md font-medium transition-colors ${
                      unit === 'in'
                        ? 'bg-gray-700 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Imperial (inches)
                  </button>
                  <button
                    onClick={() => setUnit('mm')}
                    className={`flex-1 px-4 py-2 rounded-md font-medium transition-colors ${
                      unit === 'mm'
                        ? 'bg-gray-700 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Metric (mm)
                  </button>
                </div>
              </div>

              {/* Slab Length */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Slab Length ({unit === 'mm' ? 'mm' : 'ft'})
                </label>
                <input
                  type="number"
                  value={slabLength}
                  onChange={(e) => setSlabLength(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                  placeholder="Enter slab length"
                />
              </div>

              {/* Slab Width */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Slab Width ({unit === 'mm' ? 'mm' : 'ft'})
                </label>
                <input
                  type="number"
                  value={slabWidth}
                  onChange={(e) => setSlabWidth(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                  placeholder="Enter slab width"
                />
              </div>

              {/* Spacing */}
              <div className="border-t pt-4">
                <h2 className="text-xl font-semibold text-gray-800 mb-3">Rebar Spacing</h2>
                
                <div className="flex items-center mb-3">
                  <input
                    type="checkbox"
                    id="differentSpacing"
                    checked={differentSpacing}
                    onChange={(e) => setDifferentSpacing(e.target.checked)}
                    className="w-4 h-4 text-gray-600 rounded focus:ring-gray-500"
                  />
                  <label htmlFor="differentSpacing" className="ml-2 text-sm text-gray-700">
                    Different spacing for length and width
                  </label>
                </div>

                <div className={differentSpacing ? 'grid grid-cols-2 gap-3' : ''}>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Spacing {differentSpacing ? '(Length Direction)' : ''} ({unit})
                    </label>
                    <input
                      type="number"
                      value={spacingLength}
                      onChange={(e) => setSpacingLength(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                      placeholder="Enter spacing"
                    />
                  </div>

                  {differentSpacing && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Spacing (Width Direction) ({unit})
                      </label>
                      <input
                        type="number"
                        value={spacingWidth}
                        onChange={(e) => setSpacingWidth(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                        placeholder="Enter spacing"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Edge Clearance */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Edge Clearance ({unit})
                </label>
                <input
                  type="number"
                  value={edgeClearance}
                  onChange={(e) => setEdgeClearance(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                  placeholder="Enter edge clearance"
                />
                <p className="text-xs text-gray-500 mt-1">Gap between slab edge and first rebar</p>
              </div>

              {/* Rebar Specifications */}
              <div className="border-t pt-4">
                <h2 className="text-xl font-semibold text-gray-800 mb-3">Rebar Specifications</h2>

                {/* Bar Size */}
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bar Size</label>
                  <select
                    value={barSize}
                    onChange={(e) => setBarSize(Number(e.target.value) as keyof typeof REBAR_SIZES)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                  >
                    {Object.entries(REBAR_SIZES).map(([size, info]) => (
                      <option key={size} value={size}>
                        #{size} - {info.diameter}" diameter - {info.weight} lb/ft
                      </option>
                    ))}
                  </select>
                </div>

                {/* Bar Length */}
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Each Bar Length (ft)
                  </label>
                  <input
                    type="number"
                    value={barLength}
                    onChange={(e) => setBarLength(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                    placeholder="Enter bar length"
                  />
                </div>

                {/* Waste Percentage */}
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Waste / Overlap (%)
                  </label>
                  <input
                    type="number"
                    value={wastePercent}
                    onChange={(e) => setWastePercent(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                    placeholder="Enter waste percentage"
                  />
                </div>

                {/* Cost per Foot */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cost per Foot ($)
                  </label>
                  <input
                    type="number"
                    value={costPerFoot}
                    onChange={(e) => setCostPerFoot(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                    placeholder="Enter cost per foot"
                    step="0.01"
                  />
                </div>
              </div>
            </div>

            {/* Results Section */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Results</h2>

              {results ? (
                <>
                  {/* Summary Cards */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="text-sm text-blue-700 font-medium">Total Bars</div>
                      <div className="text-2xl font-bold text-blue-900">{results.totalBars}</div>
                      <div className="text-xs text-blue-600 mt-1">
                        {results.numBarsLength} length + {results.numBarsWidth} width
                      </div>
                    </div>

                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="text-sm text-green-700 font-medium">Total Length</div>
                      <div className="text-2xl font-bold text-green-900">{results.totalRebarLength.toFixed(1)}</div>
                      <div className="text-xs text-green-600 mt-1">feet (with {wastePercent}% waste)</div>
                    </div>

                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                      <div className="text-sm text-purple-700 font-medium">Total Weight</div>
                      <div className="text-2xl font-bold text-purple-900">{results.totalWeight.toFixed(1)}</div>
                      <div className="text-xs text-purple-600 mt-1">pounds</div>
                    </div>

                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                      <div className="text-sm text-orange-700 font-medium">Bar Lengths Needed</div>
                      <div className="text-2xl font-bold text-orange-900">{results.numBars}</div>
                      <div className="text-xs text-orange-600 mt-1">× {barLength} ft bars</div>
                    </div>
                  </div>

                  {/* Cost */}
                  {costPerFoot && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <div className="text-sm text-yellow-700 font-medium">Estimated Cost</div>
                      <div className="text-3xl font-bold text-yellow-900">${results.cost.toFixed(2)}</div>
                      <div className="text-xs text-yellow-600 mt-1">@ ${costPerFoot}/ft</div>
                    </div>
                  )}

                  {/* Slab Info */}
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <div className="text-sm text-gray-700 font-medium mb-2">Slab Information</div>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Slab Area:</span>
                        <span className="font-semibold">{results.slabArea.toFixed(1)} sq ft</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Concrete Volume (4" thick):</span>
                        <span className="font-semibold">{results.volume.toFixed(2)} cu ft</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Rebar Size:</span>
                        <span className="font-semibold">#{barSize} ({results.rebarInfo.diameter}" dia)</span>
                      </div>
                    </div>
                  </div>

                  {/* Visual Diagram */}
                  <div className="bg-white border-2 border-gray-300 rounded-lg p-4">
                    <div className="text-sm text-gray-700 font-medium mb-3">Rebar Layout (Top View)</div>
                    <svg
                      viewBox="0 0 400 240"
                      className="w-full h-48 bg-gray-50 rounded"
                      preserveAspectRatio="xMidYMid meet"
                    >
                      {/* Slab outline */}
                      <rect
                        x="20"
                        y="20"
                        width="360"
                        height="200"
                        fill="#e5e7eb"
                        stroke="#6b7280"
                        strokeWidth="2"
                      />

                      {/* Length bars (horizontal) */}
                      {Array.from({ length: Math.min(results.numBarsLength, 20) }).map((_, i) => {
                        const y = 20 + (i + 0.5) * (200 / results.numBarsLength);
                        return (
                          <line
                            key={`l-${i}`}
                            x1="20"
                            y1={y}
                            x2="380"
                            y2={y}
                            stroke="#dc2626"
                            strokeWidth="2"
                          />
                        );
                      })}

                      {/* Width bars (vertical) */}
                      {Array.from({ length: Math.min(results.numBarsWidth, 20) }).map((_, i) => {
                        const x = 20 + (i + 0.5) * (360 / results.numBarsWidth);
                        return (
                          <line
                            key={`w-${i}`}
                            x1={x}
                            y1="20"
                            x2={x}
                            y2="220"
                            stroke="#2563eb"
                            strokeWidth="2"
                          />
                        );
                      })}

                      {/* Labels */}
                      <text x="200" y="15" textAnchor="middle" className="text-xs" fill="#374151">
                        {formatMeasurement(fromInches(parseFloat(slabLength) || 0, unit), unit)}
                      </text>
                      <text x="10" y="120" textAnchor="middle" className="text-xs" fill="#374151" transform="rotate(-90, 10, 120)">
                        {formatMeasurement(fromInches(parseFloat(slabWidth) || 0, unit), unit)}
                      </text>
                    </svg>
                    <div className="flex justify-center gap-4 mt-2 text-xs">
                      <div className="flex items-center gap-1">
                        <div className="w-4 h-0.5 bg-red-600"></div>
                        <span>Length bars ({results.numBarsLength})</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-4 h-0.5 bg-blue-600"></div>
                        <span>Width bars ({results.numBarsWidth})</span>
                      </div>
                    </div>
                  </div>

                  {/* Detailed Breakdown */}
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <div className="text-sm text-gray-700 font-medium mb-2">Detailed Breakdown</div>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Length direction bars:</span>
                        <span className="font-semibold">{results.numBarsLength} bars × {(parseFloat(slabWidth) || 0).toFixed(1)} {unit}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Width direction bars:</span>
                        <span className="font-semibold">{results.numBarsWidth} bars × {(parseFloat(slabLength) || 0).toFixed(1)} {unit}</span>
                      </div>
                      <div className="flex justify-between pt-2 border-t">
                        <span className="text-gray-600 font-medium">Total rebar length:</span>
                        <span className="font-bold">{results.totalRebarLength.toFixed(1)} ft</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Weight per foot:</span>
                        <span className="font-semibold">{results.rebarInfo.weight} lb/ft</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total weight:</span>
                        <span className="font-bold">{results.totalWeight.toFixed(1)} lb</span>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
                  <div className="text-gray-400 text-6xl mb-3">📊</div>
                  <p className="text-gray-500">Enter slab dimensions and spacing to see results</p>
                </div>
              )}
            </div>
          </div>

          {/* Tips Section */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">💡 Rebar Tips</h3>
            <ul className="space-y-1 text-sm text-blue-800">
              <li>• Standard spacing for residential slabs: 12" to 18" on center</li>
              <li>• Edge clearance typically 2" to 3" from slab edge</li>
              <li>• Always add 10% waste for cutting and overlapping</li>
              <li>• Use rebar chairs or dobies to maintain proper coverage</li>
              <li>• Rebar should be placed in the lower third of slab thickness</li>
              <li>• Tie rebar intersections with wire to prevent movement during pour</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
