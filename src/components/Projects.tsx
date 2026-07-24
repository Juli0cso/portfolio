import { useState } from 'react';
import AnimatedSection from './AnimatedSection';
import { projects } from '../data/portfolio';
import { ExternalLink, ArrowRight, ArrowLeft } from 'lucide-react';

export default function Projects() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextProject = () => {
    setCurrentIndex((prev) => (prev + 1) % projects.length);
  };

  const prevProject = () => {
    setCurrentIndex((prev) => (prev - 1 + projects.length) % projects.length);
  };

  const project = projects[currentIndex];

  return (
    <AnimatedSection id="projects" className="py-24 px-6 md:px-12 border-t-2 border-white/10 font-mono">
      <div className="max-w-[1400px] mx-auto">
        
        <div className="mb-12">
          <div className="text-[#ff3333] text-sm font-bold tracking-widest mb-4">
            // 02 — PORTFOLIO
          </div>
          <h2 className="text-4xl font-black uppercase text-white mb-2">FEATURED PROJECTS</h2>
          <p className="text-gray-400 text-sm">A selection of my best technical work.</p>
        </div>
        
        <div className="border-2 border-white/20 bg-black flex flex-col lg:flex-row relative">
          
          {/* Content Column */}
          <div className="p-8 lg:p-12 flex-1 flex flex-col">
            <h3 className="text-2xl lg:text-4xl font-bold text-white mb-6 uppercase">
              {project.title}
            </h3>
            
            <div className="flex flex-wrap gap-2 mb-8">
              {project.tags.map(tag => (
                <span key={tag} className="px-3 py-1 border border-white/20 text-xs text-gray-300 bg-white/5 uppercase">
                  {tag}
                </span>
              ))}
            </div>

            <div className="mb-8 flex-1">
              <div className="text-[#ff3333] font-bold mb-4 uppercase text-sm">System Highlights</div>
              <ul className="space-y-3">
                {project.highlights.map((item, i) => (
                  <li key={i} className="text-gray-400 text-sm flex items-start gap-3">
                    <span className="text-[#ff3333] font-bold mt-0.5">#</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-8 text-gray-500 text-sm leading-relaxed">
                {project.description}
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-4 border-t-2 border-white/10 pt-8 mt-auto">
              <a href="#" className="flex items-center gap-2 px-6 h-12 bg-white/5 border-2 border-white/20 hover:border-white text-white text-sm font-bold uppercase transition-colors">
                <i className="devicon-github-original text-lg" />
                GITHUB
              </a>
              <a href="#" className="flex items-center gap-2 px-6 h-12 bg-[#ff3333] text-white border-2 border-[#ff3333] shadow-retro hover:shadow-retro-hover text-sm font-bold uppercase transition-all">
                <ExternalLink size={16} />
                LIVE_DEMO
              </a>
            </div>
          </div>

          {/* Right Column / Image Area (or placeholder if images are not ready) */}
          <div className="hidden lg:flex w-2/5 border-l-2 border-white/20 bg-white/5 items-center justify-center relative overflow-hidden">
             {/* Replace this with project.image later */}
             <div className="font-bold text-gray-500 opacity-20 text-4xl rotate-90 whitespace-nowrap">
               PROJECT_IMG_{project.index}
             </div>
             
             {/* Slider Controls pinned inside the image area or bottom right */}
             <div className="absolute bottom-0 right-0 bg-black border-t-2 border-l-2 border-white/20 flex">
                <div className="px-6 py-4 border-r-2 border-white/20 font-bold text-white">
                  0{currentIndex + 1} / 0{projects.length}
                </div>
                <button onClick={prevProject} className="w-14 h-14 flex items-center justify-center border-r-2 border-white/20 hover:bg-[#ff3333] hover:text-white transition-colors">
                  <ArrowLeft size={20} />
                </button>
                <button onClick={nextProject} className="w-14 h-14 flex items-center justify-center hover:bg-[#ff3333] hover:text-white transition-colors">
                  <ArrowRight size={20} />
                </button>
             </div>
          </div>
          
          {/* Mobile Slider Controls */}
          <div className="flex lg:hidden border-t-2 border-white/20">
            <div className="px-6 py-4 border-r-2 border-white/20 font-bold text-white flex-1">
              0{currentIndex + 1} / 0{projects.length}
            </div>
            <button onClick={prevProject} className="w-14 h-14 flex items-center justify-center border-r-2 border-white/20 hover:bg-[#ff3333] hover:text-white transition-colors">
              <ArrowLeft size={20} />
            </button>
            <button onClick={nextProject} className="w-14 h-14 flex items-center justify-center hover:bg-[#ff3333] hover:text-white transition-colors">
              <ArrowRight size={20} />
            </button>
          </div>

        </div>
      </div>
    </AnimatedSection>
  );
}
