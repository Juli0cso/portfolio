import { useState } from 'react';
import AnimatedSection from './AnimatedSection';
import { skills } from '../data/portfolio';

export default function Skills() {
  const [activeTab, setActiveTab] = useState('ALL');
  
  const tabs = ['ALL', 'BACKEND', 'FRONTEND', 'TOOLS', 'OTHER'];
  
  const filteredSkills = activeTab === 'ALL' 
    ? skills 
    : skills.filter(s => s.category.toUpperCase() === activeTab);

  return (
    <AnimatedSection id="skills" className="py-24 px-6 md:px-12 border-t-2 border-white/10 font-mono">
      <div className="max-w-[1400px] mx-auto">
        
        <div className="mb-12">
          <div className="text-[#ff3333] text-sm font-bold tracking-widest mb-4">
            // 01 — CAPABILITIES
          </div>
          <h2 className="text-4xl font-black uppercase text-white">SKILLS</h2>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-4 mb-12">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 border-2 text-sm font-bold transition-all ${
                activeTab === tab 
                  ? 'border-[#ff3333] bg-[#ff3333] text-white shadow-retro' 
                  : 'border-white/20 text-gray-400 hover:border-white/50 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        
        {/* Skills Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {filteredSkills.map((skill) => (
            <div 
              key={skill.name}
              className="aspect-square flex flex-col items-center justify-center p-4 border-2 border-white/10 bg-black hover:border-[#ff3333] hover:shadow-[4px_4px_0px_0px_#ff3333] hover:-translate-y-1 hover:-translate-x-1 transition-all group"
            >
              {skill.icon.startsWith('devicon') ? (
                <i className={`${skill.icon} text-4xl mb-4 grayscale group-hover:grayscale-0 transition-all`} style={{ color: skill.tone }}></i>
              ) : (
                <div 
                  className="w-10 h-10 mb-4 rounded-full flex items-center justify-center font-bold text-xs bg-white/5 border border-white/20 grayscale group-hover:grayscale-0 transition-all"
                  style={{ color: skill.tone, borderColor: skill.tone }}
                >
                  {skill.icon}
                </div>
              )}
              <div className="font-bold text-xs text-center text-gray-400 group-hover:text-white uppercase tracking-wider">
                {skill.name}
              </div>
            </div>
          ))}
        </div>

      </div>
    </AnimatedSection>
  );
}
