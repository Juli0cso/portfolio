import AnimatedSection from './AnimatedSection';

export default function GithubActivity() {
  // Generate random activity grid (simulating GitHub contribution graph)
  const weeks = 52;
  const daysPerWeek = 7;
  
  const getIntensityClass = (val: number) => {
    if (val === 0) return 'bg-[#1a1a1a] border-white/5';
    if (val === 1) return 'bg-[#0e4429] border-[#0e4429]/50';
    if (val === 2) return 'bg-[#006d32] border-[#006d32]/50';
    if (val === 3) return 'bg-[#26a641] border-[#26a641]/50';
    return 'bg-[#39d353] border-[#39d353]/50';
  };

  const grid = Array.from({ length: weeks }).map(() => 
    Array.from({ length: daysPerWeek }).map(() => Math.floor(Math.random() * 5))
  );

  return (
    <AnimatedSection id="github" className="py-24 px-6 md:px-12 border-t-2 border-white/10 font-mono">
      <div className="max-w-[1400px] mx-auto">
        
        <div className="mb-12">
          <div className="text-[#ff3333] text-sm font-bold tracking-widest mb-4">
            // 03 — OPEN SOURCE
          </div>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h2 className="text-4xl font-black uppercase text-white mb-2">GITHUB ACTIVITY</h2>
            <div className="flex gap-4">
              <span className="px-3 py-1 border-2 border-white/20 text-xs font-bold bg-white/5 text-white">STATED.FREQ_ANALYSIS</span>
              <span className="px-3 py-1 border-2 border-[#ff3333] text-xs font-bold text-[#ff3333] shadow-retro">LIVE_SYNC</span>
            </div>
          </div>
        </div>
        
        <div className="border-2 border-white/20 bg-black p-8 overflow-x-auto">
          <div className="min-w-[800px]">
            <div className="flex gap-1 mb-2 text-xs text-gray-500">
              <div className="flex-1">Jan</div>
              <div className="flex-1">Feb</div>
              <div className="flex-1">Mar</div>
              <div className="flex-1">Apr</div>
              <div className="flex-1">May</div>
              <div className="flex-1">Jun</div>
              <div className="flex-1">Jul</div>
              <div className="flex-1">Aug</div>
              <div className="flex-1">Sep</div>
              <div className="flex-1">Oct</div>
              <div className="flex-1">Nov</div>
              <div className="flex-1">Dec</div>
            </div>
            
            <div className="flex gap-1">
              {grid.map((week, wIdx) => (
                <div key={wIdx} className="flex flex-col gap-1">
                  {week.map((day, dIdx) => (
                    <div 
                      key={`${wIdx}-${dIdx}`} 
                      className={`w-3 h-3 border ${getIntensityClass(day)} rounded-sm`}
                      title={`Simulated contribution for Juli0cso`}
                    />
                  ))}
                </div>
              ))}
            </div>
            
            <div className="flex justify-between items-center mt-6 pt-4 border-t-2 border-white/10 text-xs text-gray-400 font-bold uppercase">
              <div>TOTAL: 247 COMMITS</div>
              <div className="flex items-center gap-2">
                <span>LESS</span>
                <div className="w-3 h-3 bg-[#1a1a1a] border border-white/5 rounded-sm" />
                <div className="w-3 h-3 bg-[#0e4429] border border-[#0e4429]/50 rounded-sm" />
                <div className="w-3 h-3 bg-[#006d32] border border-[#006d32]/50 rounded-sm" />
                <div className="w-3 h-3 bg-[#26a641] border border-[#26a641]/50 rounded-sm" />
                <div className="w-3 h-3 bg-[#39d353] border border-[#39d353]/50 rounded-sm" />
                <span>MORE</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </AnimatedSection>
  );
}
