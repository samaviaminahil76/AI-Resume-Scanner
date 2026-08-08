import './globals.css';

export const metadata = {
  title: 'AI Resume Scanner & Job Matcher',
  description: 'AI-powered resume optimization and job description matcher.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-mesh antialiased text-slate-100 min-h-screen flex flex-col">
        {/* Top Header Navigation */}
        <header className="w-full border-b border-slate-800/80 bg-slate-950/60 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center space-x-3 cursor-pointer">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-teal-500/20">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-teal-300 via-indigo-200 to-white bg-clip-text text-transparent">
                ResuMatch <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/20">AI</span>
              </span>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-xs text-slate-400 hidden sm:inline-flex items-center gap-1.5 bg-slate-900/80 px-3 py-1.5 rounded-full border border-slate-800">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                LLM Analysis Engine v2.4
              </span>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>

        {/* Footer */}
        <footer className="border-t border-slate-900 bg-slate-950/80 text-slate-500 text-xs py-6 text-center">
          <p>© {new Date().getFullYear()} ResuMatch AI. Automated ATS Optimization & Match Analysis.</p>
        </footer>
      </body>
    </html>
  );
}