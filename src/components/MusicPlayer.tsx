import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipForward, SkipBack, Music, X } from 'lucide-react';

export default function MusicPlayer() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <>
      {/* Small floating button (if we didn't put it in navbar) */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 left-6 z-40 w-12 h-12 bg-black border-2 border-white/20 flex items-center justify-center text-white hover:border-[#ff3333] hover:text-[#ff3333] transition-colors shadow-retro"
      >
        <Music size={20} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-24 left-6 z-50 w-72 bg-black border-2 border-white/20 font-mono shadow-[6px_6px_0px_0px_rgba(255,51,51,0.5)]"
          >
            <div className="p-2 border-b-2 border-white/20 flex justify-between items-center bg-[#ff3333] text-white font-bold text-xs uppercase">
              <span>JC_AMP v1.0</span>
              <button onClick={() => setIsOpen(false)}><X size={14} /></button>
            </div>
            
            <div className="p-4 space-y-4">
              <div className="text-center text-xs text-[#ff3333] animate-pulse">
                {isPlaying ? '▶ PLAYING' : '■ STOPPED'}
              </div>
              
              <div className="border-2 border-white/10 bg-white/5 p-2 text-center text-sm font-bold text-white truncate">
                Lofi_Coding_Vibes.mp3
              </div>

              {/* Progress Bar */}
              <div className="h-2 bg-white/10 border border-white/20">
                <div className="h-full bg-[#ff3333] w-1/3" />
              </div>

              {/* Controls */}
              <div className="flex justify-center gap-4">
                <button className="p-2 border-2 border-white/20 hover:text-[#ff3333] hover:border-[#ff3333]">
                  <SkipBack size={16} />
                </button>
                <button 
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="p-2 border-2 border-white/20 hover:text-[#ff3333] hover:border-[#ff3333]"
                >
                  {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                </button>
                <button className="p-2 border-2 border-white/20 hover:text-[#ff3333] hover:border-[#ff3333]">
                  <SkipForward size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
