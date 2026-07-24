import { motion } from 'framer-motion';
import { Code2 } from 'lucide-react';
import AnimatedSection from './AnimatedSection';

export default function Hero() {
  return (
    <AnimatedSection id="about" className="min-h-screen pt-28 px-6 md:px-12 flex flex-col justify-center relative overflow-hidden font-mono">
      <div className="max-w-[1400px] mx-auto w-full grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-12 items-center">
        
        {/* Left Column */}
        <div className="space-y-8 z-10">
          <div className="text-[#ff3333] text-sm font-bold tracking-widest">
            // SYSTEM.INIT
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter text-white">
            JÚLIO CÉSAR
          </h1>
          
          <div className="text-xl md:text-2xl font-bold text-white/80 border-l-4 border-[#ff3333] pl-4">
            BACKEND DEVELOPER & DEVOPS
          </div>
          
          <p className="text-sm md:text-base text-gray-400 max-w-2xl leading-relaxed">
            I am a Backend Developer with a strong focus on building scalable architectures, automation, and enterprise solutions. 
            Proficient in <span className="text-white">Java, Spring Boot, Python, SQL/NoSQL</span> and <span className="text-white">DevOps</span> tools.
            Currently exploring Cloud and Microservices integrations.
          </p>

          {/* Social Links Box */}
          <div className="flex flex-wrap gap-4 pt-2">
            {[
              { label: 'GITHUB', icon: <i className="devicon-github-original text-lg" />, href: 'https://github.com/Juli0cso' },
              { label: 'LINKEDIN', icon: <i className="devicon-linkedin-plain text-lg" />, href: 'https://linkedin.com/in/juliocesar' },
              { label: 'PROJECTS', icon: <Code2 size={16} />, href: '#projects' },
            ].map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="flex items-center gap-3 px-4 py-3 border-2 border-white/20 text-sm font-bold hover:border-[#ff3333] hover:text-[#ff3333] transition-colors bg-black/50"
              >
                {link.icon}
                <span>{link.label}</span>
                <span className="text-white/30 ml-2">›</span>
              </a>
            ))}
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-wrap gap-6 pt-4">
            <a 
              href="#projects" 
              className="px-8 py-4 bg-[#ff3333] text-white font-bold uppercase transition-all shadow-retro hover:shadow-[6px_6px_0px_0px_#cc2929] hover:-translate-y-0.5 hover:-translate-x-0.5 border-2 border-[#ff3333]"
            >
              EXPLORE_PROJECTS
            </a>
            <a 
              href="/curriculo-julio-cesar.pdf" 
              target="_blank"
              className="px-8 py-4 bg-transparent text-white font-bold uppercase transition-all border-2 border-white/20 hover:border-[#ff3333] hover:text-[#ff3333]"
            >
              VIEW_RESUME
            </a>
          </div>

          {/* Location Info */}
          <div className="pt-8 flex flex-col gap-1 text-xs text-gray-500 font-bold tracking-widest uppercase">
            <div>SYS.LOC: BRASÍLIA, BR</div>
            <div>LAT: 15.7975° S</div>
            <div>LNG: 47.8919° W</div>
          </div>
        </div>

        {/* Right Column / Avatar Area */}
        <div className="relative h-[500px] hidden lg:flex items-center justify-center z-10 border-2 border-white/5 bg-white/[0.02]">
           {/* Placeholder for 3D model */}
           <motion.div
            animate={{
              y: [-10, 10, -10],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="flex flex-col items-center justify-center text-center opacity-50"
          >
            <div className="w-48 h-48 border-2 border-dashed border-[#ff3333]/50 rounded-full flex items-center justify-center mb-4">
              <span className="text-[#ff3333] font-bold">[ 3D_AVATAR_ZONE ]</span>
            </div>
            <p className="text-xs">Awaiting model integration...</p>
          </motion.div>
        </div>
        
      </div>
    </AnimatedSection>
  );
}
