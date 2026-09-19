export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold">BuildCalc</h3>
                <p className="text-xs text-slate-400">Construction Calculators</p>
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Free online calculators and printable full scale template generators for construction, DIY, remodeling, metalwork, crafts, and automotive projects.
            </p>
          </div>

          {/* Calculators */}
          <div>
            <h4 className="font-semibold text-white mb-4">Popular Calculators</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><a href="#" className="hover:text-amber-400 transition-colors">Concrete Calculator</a></li>
              <li><a href="#" className="hover:text-amber-400 transition-colors">Stair Calculator</a></li>
              <li><a href="#" className="hover:text-amber-400 transition-colors">Roof Calculator</a></li>
              <li><a href="#" className="hover:text-amber-400 transition-colors">Deck Calculator</a></li>
              <li><a href="#" className="hover:text-amber-400 transition-colors">Brick Calculator</a></li>
              <li><a href="#" className="hover:text-amber-400 transition-colors">Fence Calculator</a></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-semibold text-white mb-4">Categories</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><a href="#" className="hover:text-amber-400 transition-colors">Construction</a></li>
              <li><a href="#" className="hover:text-amber-400 transition-colors">Renovation</a></li>
              <li><a href="#" className="hover:text-amber-400 transition-colors">Remodeling</a></li>
              <li><a href="#" className="hover:text-amber-400 transition-colors">Metalwork</a></li>
              <li><a href="#" className="hover:text-amber-400 transition-colors">Crafts</a></li>
              <li><a href="#" className="hover:text-amber-400 transition-colors">Automotive</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold text-white mb-4">Resources</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><a href="#" className="hover:text-amber-400 transition-colors">Calculator Directory</a></li>
              <li><a href="#" className="hover:text-amber-400 transition-colors">Reviews & Examples</a></li>
              <li><a href="#" className="hover:text-amber-400 transition-colors">Printing Tips</a></li>
              <li><a href="#" className="hover:text-amber-400 transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-amber-400 transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-amber-400 transition-colors">Privacy Policy</a></li>
            </ul>
          </div>
        </div>

        {/* Safety Notice */}
        <div className="mt-10 p-4 bg-slate-800 rounded-lg border border-slate-700">
          <div className="flex items-start gap-3">
            <span className="text-xl">⚠️</span>
            <div>
              <p className="text-sm text-slate-300">
                <strong className="text-white">Safety Notice:</strong> If you're cutting blocks, concrete, stone or ANYTHING and there's DUST — don't take the risk. 
                Don't cut it, or cut it wet so there's NO DUST. Silicosis is a serious health hazard.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8 pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500">
            © 2024 BuildCalc. All calculators are geometric only. Check local regulations for engineering requirements.
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="text-slate-500 hover:text-amber-400 transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.625 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
            </a>
            <a href="#" className="text-slate-500 hover:text-amber-400 transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
