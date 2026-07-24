import AnimatedSection from './AnimatedSection';
import { experiences } from '../data/portfolio';

export default function Experience() {
  return (
    <AnimatedSection id="experience" className="py-24 px-6 md:px-12 border-t-2 border-white/10 font-mono">
      <div className="max-w-[1400px] mx-auto">
        
        <div className="mb-12">
          <div className="text-[#ff3333] text-sm font-bold tracking-widest mb-4">
            // 04 — EXPERIENCE
          </div>
          <h2 className="text-4xl font-black uppercase text-white mb-2">MY JOURNEY</h2>
          <p className="text-gray-400 text-sm">Professional experience and education timeline.</p>
        </div>
        
        <div className="space-y-8">
          {experiences.map((exp, idx) => (
            <div 
              key={idx} 
              className="border-2 border-white/20 bg-black p-6 md:p-8 hover:border-[#ff3333] transition-colors relative flex flex-col md:flex-row gap-6 md:gap-12 md:items-start"
            >
              {/* Date Box */}
              <div className="md:w-64 shrink-0">
                <div className="inline-block px-4 py-2 border-2 border-white/20 bg-white/5 text-sm font-bold text-white uppercase">
                  {exp.date}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-white mb-2 uppercase">{exp.role}</h3>
                <div className="text-[#ff3333] font-bold text-sm mb-6 uppercase tracking-wider">{exp.company}</div>
                
                <ul className="space-y-3">
                  {exp.items.map((item, i) => (
                    <li key={i} className="text-sm text-gray-400 flex items-start gap-3">
                      <span className="text-white/30 mt-1">›</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

      </div>
    </AnimatedSection>
  );
}
