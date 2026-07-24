import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, User } from 'lucide-react';

export default function AssistantSidebar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed right-0 top-1/2 -translate-y-1/2 bg-[#ff3333] text-white font-mono font-bold text-sm px-2 py-8 flex flex-col items-center border-l-2 border-t-2 border-b-2 border-white/20 hover:border-[#ff3333] transition-all z-50 rounded-l-md"
          style={{ writingMode: 'vertical-rl', transform: 'translateY(-50%) rotate(180deg)' }}
        >
          ASK JULIO_AI
        </button>
      )}

      {/* Sidebar Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed top-0 right-0 h-full w-[400px] max-w-[100vw] bg-black border-l-2 border-white/20 z-50 flex flex-col font-mono shadow-[-10px_0_30px_rgba(255,51,51,0.1)]"
          >
            {/* Header */}
            <div className="p-4 border-b-2 border-white/20 flex justify-between items-center bg-white/5">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-[#ff3333] rounded-full animate-pulse" />
                <span className="font-bold text-white text-sm tracking-widest">JULIO_SYS</span>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="px-2 py-1 bg-[#ff3333] text-white text-xs font-bold uppercase hover:bg-white hover:text-black transition-colors"
              >
                CLOSE X
              </button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              
              <div className="space-y-1">
                <div className="text-[#ff3333] text-xs font-bold">JULIO_SYS{'>'}</div>
                <div className="p-3 border-2 border-white/10 bg-white/5 text-gray-300 text-sm">
                  INITIATING SYSTEM... Hello! I am Julio's AI Assistant. How can I help you today?
                </div>
              </div>

              <div className="space-y-1 flex flex-col items-end">
                <div className="text-gray-500 text-xs font-bold">USR_CMD{'>'}</div>
                <div className="p-3 border-2 border-white/20 bg-white text-black text-sm">
                  Who are you?
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-[#ff3333] text-xs font-bold">JULIO_SYS{'>'}</div>
                <div className="p-3 border-2 border-white/10 bg-white/5 text-gray-300 text-sm">
                  I am the AI assistant for Júlio César's portfolio. My mission here is to help you navigate his impressive skills and projects as a Backend Developer.
                </div>
              </div>

            </div>

            {/* Input Area */}
            <div className="p-4 border-t-2 border-white/20 bg-black flex gap-2">
              <input 
                type="text"
                placeholder="EXECUTE COMMAND..."
                className="flex-1 bg-transparent border-2 border-white/20 px-3 py-2 text-white text-sm focus:outline-none focus:border-[#ff3333]"
              />
              <button className="px-4 bg-[#ff3333] text-white font-bold text-sm border-2 border-[#ff3333] hover:bg-transparent hover:text-[#ff3333] transition-colors">
                SEND
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
