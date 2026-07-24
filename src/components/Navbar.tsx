import { motion } from 'framer-motion';
import { Search, Music, Moon } from 'lucide-react';

export default function Navbar() {
  return (
    <motion.nav 
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-6 py-4 bg-[#0a0a0a]/90 backdrop-blur-md border-b-2 border-white/10 font-mono"
    >
      <div className="flex items-center gap-4">
        {/* Logo */}
        <div className="bg-[#ff3333] text-white font-bold px-3 py-2 text-xl border-2 border-[#ff3333]">
          JC
        </div>
        <div className="hidden md:block text-xs font-bold tracking-widest uppercase text-white/80">
          DEVELOPER PORTFOLIO
        </div>
      </div>
      
      <div className="flex items-center gap-4 text-sm">
        {/* Music Player Toggle */}
        <button className="w-10 h-10 flex items-center justify-center border-2 border-white/20 hover:border-[#ff3333] hover:text-[#ff3333] transition-colors">
          <Music size={16} />
        </button>

        {/* Command Palette */}
        <button className="hidden md:flex items-center gap-2 px-4 h-10 border-2 border-white/20 hover:border-white/40 transition-colors">
          <Search size={14} className="text-gray-400" />
          <span className="text-gray-400">TERMINAL...</span>
          <span className="border border-white/20 px-1 text-[10px] ml-4 bg-white/5">⌘K</span>
        </button>

        {/* Resume */}
        <a 
          href="/curriculo-julio-cesar.pdf" 
          target="_blank" 
          className="px-6 h-10 flex items-center justify-center bg-[#ff3333] text-white font-bold uppercase transition-all shadow-retro hover:shadow-[6px_6px_0px_0px_#cc2929] hover:-translate-y-0.5 hover:-translate-x-0.5"
        >
          RESUME
        </a>

        {/* Theme Toggle */}
        <button className="w-10 h-10 flex items-center justify-center border-2 border-white/20 hover:border-[#ff3333] hover:text-[#ff3333] transition-colors">
          <Moon size={16} />
        </button>
      </div>
    </motion.nav>
  );
}
