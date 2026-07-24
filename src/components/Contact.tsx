import AnimatedSection from './AnimatedSection';

export default function Contact() {
  return (
    <AnimatedSection id="contact" className="py-24 px-6 md:px-12 border-t-2 border-white/10 font-mono">
      <div className="max-w-[1400px] mx-auto">
        
        <div className="mb-12">
          <div className="text-[#ff3333] text-sm font-bold tracking-widest mb-4">
            // 06 — GET IN TOUCH
          </div>
          <h2 className="text-4xl font-black uppercase text-white mb-2">CONTACT ME</h2>
          <p className="text-gray-400 text-sm max-w-2xl">
            Let's start a conversation. Have a project in mind? Want to discuss collaboration opportunities? 
            I'm always open to discussing new projects, creative ideas or opportunities to be part of your vision.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-12">
          
          {/* Info Column */}
          <div className="space-y-8">
            <div className="border-2 border-white/20 p-6 bg-black">
              <div className="text-xs text-gray-500 uppercase tracking-widest mb-1">Email</div>
              <div className="text-white font-bold text-lg">royyashwanth52@gmail.com</div>
            </div>
            
            <div className="border-2 border-white/20 p-6 bg-black">
              <div className="text-xs text-gray-500 uppercase tracking-widest mb-1">Phone</div>
              <div className="text-white font-bold text-lg">+91 7670971930</div>
            </div>
            
            <div className="border-2 border-white/20 p-6 bg-black flex gap-4">
              <div className="text-xs text-gray-500 uppercase tracking-widest w-full mb-1">Connect</div>
              <a href="https://github.com/Juli0cso" className="text-white hover:text-[#ff3333] transition-colors"><i className="devicon-github-original text-2xl" /></a>
              <a href="#" className="text-white hover:text-[#ff3333] transition-colors"><i className="devicon-linkedin-plain text-2xl" /></a>
            </div>
          </div>
          
          {/* Form Column */}
          <div className="border-2 border-white/20 bg-black p-8 relative">
            <div className="absolute -top-3 left-6 bg-black px-2 text-sm font-bold uppercase tracking-widest">
              SEND MESSAGE
            </div>
            
            <form className="space-y-6 mt-4 flex flex-col h-full">
              
              <div className="relative">
                <label className="absolute -top-2.5 left-4 bg-black px-2 text-xs text-[#ff3333] font-bold tracking-widest">
                  [ NAME ]
                </label>
                <input 
                  type="text" 
                  className="w-full bg-transparent border-2 border-white/20 p-4 text-white focus:outline-none focus:border-[#ff3333] transition-colors"
                  placeholder="Test User"
                />
              </div>

              <div className="relative">
                <label className="absolute -top-2.5 left-4 bg-black px-2 text-xs text-[#ff3333] font-bold tracking-widest">
                  [ EMAIL_ADDRESS ]
                </label>
                <input 
                  type="email" 
                  className="w-full bg-transparent border-2 border-white/20 p-4 text-white focus:outline-none focus:border-[#ff3333] transition-colors"
                  placeholder="test@example.com"
                />
              </div>

              <div className="relative flex-1">
                <label className="absolute -top-2.5 left-4 bg-black px-2 text-xs text-[#ff3333] font-bold tracking-widest">
                  [ DATA_PAYLOAD ]
                </label>
                <textarea 
                  className="w-full h-40 bg-transparent border-2 border-white/20 p-4 text-white focus:outline-none focus:border-[#ff3333] transition-colors resize-none"
                  placeholder="Hello, this is a test message..."
                />
              </div>
              
              <button 
                type="button" 
                className="w-full py-4 border-2 border-white/20 bg-white/5 hover:bg-[#ff3333] hover:border-[#ff3333] hover:shadow-retro font-bold text-white uppercase tracking-widest transition-all mt-auto"
              >
                [ SEND MESSAGE ]
              </button>
            </form>
          </div>

        </div>

      </div>
    </AnimatedSection>
  );
}
