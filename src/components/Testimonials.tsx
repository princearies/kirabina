const testimonials = [
  {
    name: 'Patty',
    location: 'Wisconsin, USA',
    text: 'Used your staircase calculator. It worked out great! I designed and built a 2-story barn on my property. Your website also helped me design my staircase. Thanks for providing a great tool for guys who like to build projects without using a contractor!',
    project: 'Barn with Gambrel Roof',
    calculator: 'Stair Calculator',
  },
  {
    name: 'Rich',
    location: 'New Ulm, Minnesota',
    text: "I use your various calculators on a regular basis for stair building as well as other framing and finish layout. It's also a great tool for teaching the new guys. Great for visualizing the process. Much appreciated!",
    project: 'Custom Spiral Staircase',
    calculator: 'Spiral Stair Calculator',
  },
  {
    name: 'Dave',
    location: 'Perth, Western Australia',
    text: 'Thanks for a great website resource. Hadn\'t built anything substantial prior to building this outside office and used the website for all sorts of things during the build. The rafter calculator, the bullnose calculator, the decking calculator, the stairs calculator to name a few. Learnt heaps!',
    project: 'Outdoor Office',
    calculator: 'Multiple Calculators',
  },
  {
    name: 'Tim',
    location: 'California, USA',
    text: 'Thank you for the use of the baluster calculator. It saved me so much frustration and time.',
    project: 'Deck with Railing',
    calculator: 'Baluster Spacing Calculator',
  },
  {
    name: 'Shawn Kelly',
    location: 'Midwest Framing',
    text: "I've used your calculator for years building houses. I like it because I can get a visual on my rafter and change things based on seat cut or plumb cut measurements and you also tell me the elevations. I can figure these things out other ways but this is quick and simple.",
    project: 'Residential Roofing',
    calculator: 'Rafter Calculator',
  },
  {
    name: 'Liz',
    location: 'UK',
    text: "I had played with a number of placements for the fence slats and none looked quite right. I was so happy to find your website calculator! The arches look so great! We are so grateful to you! I'm so excited that it turned out exactly how I wanted!",
    project: 'Arched Picket Trellis',
    calculator: 'Picket Arch Calculator',
  },
]

export default function Testimonials() {
  return (
    <section id="reviews" className="py-16 bg-slate-800">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Reviews & Project Examples
          </h2>
          <p className="text-slate-300 max-w-2xl mx-auto">
            See what builders, contractors, and DIY enthusiasts are saying about our calculators.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="bg-slate-700 rounded-xl p-6 shadow-sm border border-slate-600 hover:shadow-md transition-shadow"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              {/* Quote */}
              <p className="text-slate-300 text-sm leading-relaxed mb-4 line-clamp-4">
                "{testimonial.text}"
              </p>

              {/* Project info */}
              <div className="border-t border-slate-600 pt-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-white text-sm">{testimonial.name}</p>
                    <p className="text-xs text-slate-400">{testimonial.location}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-medium text-blue-400">{testimonial.calculator}</p>
                    <p className="text-xs text-slate-500">{testimonial.project}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <div className="bg-slate-700 rounded-xl p-8 shadow-sm border border-slate-600 max-w-2xl mx-auto">
            <h3 className="text-xl font-bold text-white mb-2">Built Something Using Our Calculators?</h3>
            <p className="text-slate-300 mb-4">
              We'd love to see your projects! Send us photos and a description for our examples list.
            </p>
            <button className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">
              Submit Your Project
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
