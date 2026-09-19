interface CalculatorGridProps {
  onSelectCalculator: (id: string) => void
}

const categories = [
  {
    title: 'Concrete & Masonry',
    icon: '🧱',
    color: 'from-red-500 to-red-600',
    calculators: [
      { id: 'concrete', name: 'Concrete Calculator', desc: 'Calculate volume of concrete needed for slabs, footings, and columns' },
      { id: 'brick', name: 'Brick Calculator', desc: 'Calculate number of bricks, blocks, and mortar needed' },
    ]
  },
  {
    title: 'Roofing & Framing',
    icon: '🏠',
    color: 'from-blue-500 to-blue-600',
    calculators: [
      { id: 'roof', name: 'Roof Calculator', desc: 'Calculate rafter lengths, angles, and roof area for gable roofs' },
    ]
  },
  {
    title: 'Stairs & Railings',
    icon: '🪜',
    color: 'from-green-500 to-green-600',
    calculators: [
      { id: 'stair', name: 'Stair Calculator', desc: 'Calculate riser height, tread depth, and stringer layout' },
    ]
  },
  {
    title: 'Deck & Outdoor',
    icon: '🏗️',
    color: 'from-amber-500 to-amber-600',
    calculators: [
      { id: 'deck', name: 'Deck Calculator', desc: 'Calculate decking boards, joists, and railing materials' },
      { id: 'fence', name: 'Fence Calculator', desc: 'Calculate fence posts, rails, and pickets needed' },
    ]
  },
]

const moreCalculators = [
  { name: 'Gable Roof', icon: '📐' },
  { name: 'Hip Roof', icon: '🔺' },
  { name: 'Gambrel Roof', icon: '🏚️' },
  { name: 'Spiral Stairs', icon: '🌀' },
  { name: 'Deck Railing', icon: '🪵' },
  { name: 'Baluster Spacing', icon: '📏' },
  { name: 'Wall Framing', icon: '🧮' },
  { name: 'Gazebo', icon: '⛺' },
  { name: 'Circle Divider', icon: '⭕' },
  { name: 'Pipe Notching', icon: '🔧' },
  { name: 'Kerf Spacing', icon: '🪚' },
  { name: 'Tapered Staves', icon: '🪣' },
  { name: 'Pitch to Angle', icon: '📊' },
  { name: 'Curved Molding', icon: '🎨' },
  { name: 'Picket Fence Arch', icon: '🌸' },
  { name: 'Rafter Calculator', icon: '📋' },
]

export default function CalculatorGrid({ onSelectCalculator }: CalculatorGridProps) {
  return (
    <section id="calculators" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
            Construction Calculators
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Select a calculator below to get started. All calculators provide instant results with detailed diagrams and measurements.
          </p>
        </div>

        {/* Calculator Categories */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {categories.map((category) => (
            <div key={category.title} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              <div className={`bg-gradient-to-r ${category.color} px-6 py-4 text-white`}>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{category.icon}</span>
                  <h3 className="text-lg font-bold">{category.title}</h3>
                </div>
              </div>
              <div className="p-6">
                {category.calculators.map((calc) => (
                  <button
                    key={calc.id}
                    onClick={() => onSelectCalculator(calc.id)}
                    className="w-full text-left p-4 rounded-lg hover:bg-slate-50 border border-slate-100 hover:border-blue-200 transition-all group mb-3 last:mb-0"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">
                          {calc.name}
                        </h4>
                        <p className="text-sm text-slate-500 mt-1">{calc.desc}</p>
                      </div>
                      <svg className="w-5 h-5 text-slate-400 group-hover:text-blue-500 transition-colors flex-shrink-0 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* More Calculators Grid */}
        <div className="bg-slate-50 rounded-xl p-8">
          <h3 className="text-xl font-bold text-slate-800 mb-6 text-center">
            More Calculators Available
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-3">
            {moreCalculators.map((calc) => (
              <div 
                key={calc.name}
                className="bg-white p-3 rounded-lg border border-slate-200 text-center hover:border-blue-300 hover:shadow-sm transition-all cursor-pointer"
              >
                <span className="text-xl">{calc.icon}</span>
                <p className="text-xs font-medium text-slate-700 mt-1">{calc.name}</p>
              </div>
            ))}
          </div>
          <p className="text-center text-sm text-slate-500 mt-6">
            And many more! New calculators added regularly.
          </p>
        </div>
      </div>
    </section>
  )
}
