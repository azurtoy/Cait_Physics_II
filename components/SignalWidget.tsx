'use client';

import { useState } from 'react';

export default function SignalWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({ email: '', message: '' });
  const [isTransmitting, setIsTransmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsTransmitting(true);
    
    try {
      // API 호출 준비 코드 (azurtoy@gmail.com으로 전송)
      // TODO: 실제 API 엔드포인트 구현 필요
      // await fetch('/api/send-signal', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     to: 'azurtoy@gmail.com',
      //     email: formData.email,
      //     message: formData.message,
      //   }),
      // });
      
      // 임시로 콘솔 로그만 출력
      console.log('Signal transmitted:', formData);
      
      // 전송 완료 후 상태 초기화
      setFormData({ email: '', message: '' });
      setIsOpen(false);
    } catch (error) {
      console.error('Signal transmission error:', error);
    } finally {
      setIsTransmitting(false);
    }
  };

  return (
    <>
      {/* Floating Signal Button - Bottom Right - Ghost/Glassmorphism Style */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-4 py-3 bg-black/50 backdrop-blur-md border border-white/30 shadow-lg hover:bg-white hover:text-black transition-all group"
        title="Transmit Signal"
        suppressHydrationWarning
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24" 
          strokeWidth={1.5} 
          stroke="currentColor" 
          className="w-4 h-4 text-white group-hover:text-black transition-colors"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.288 15.038a5.25 5.25 0 0 1 7.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 0 1 1.06 0Z" />
        </svg>
        <span className="text-xs font-light tracking-wider text-white group-hover:text-black transition-colors">
          SIGNAL
        </span>
      </button>

      {/* Messenger-Style Slide Panel - Dark Mode */}
      <div 
        className={`fixed bottom-24 right-6 z-40 w-96 max-w-[calc(100vw-3rem)] bg-zinc-900/90 backdrop-blur-md border border-[#ec4899]/50 shadow-2xl transition-all duration-300 ${
          isOpen ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0 pointer-events-none'
        }`}
      >
        <div className="relative p-6">
          {/* Close Button */}
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 text-gray-400 hover:text-[#ec4899] transition-colors"
            suppressHydrationWarning
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Title */}
          <h2 className="mb-4 text-base font-light tracking-[0.3em] text-center text-white">
            TRANSMIT SIGNAL
          </h2>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-light text-gray-400 tracking-wide mb-1">
                EMAIL
              </label>
              <input
                type="email"
                placeholder="your.email@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 bg-black/40 border border-zinc-700 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#ec4899] transition-colors"
                required
                disabled={isTransmitting}
                suppressHydrationWarning
              />
            </div>

            <div>
              <label className="block text-xs font-light text-gray-400 tracking-wide mb-1">
                MESSAGE
              </label>
              <textarea
                placeholder="Feedback / Error Report / Suggestion"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-3 py-2 bg-black/40 border border-zinc-700 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#ec4899] transition-colors resize-none"
                rows={3}
                required
                disabled={isTransmitting}
                suppressHydrationWarning
              />
            </div>

            {/* Submit Button - Four Blocks */}
            <button
              type="submit"
              disabled={isTransmitting}
              className="w-full py-4 mt-2 flex items-center justify-center gap-2 group disabled:opacity-50"
              suppressHydrationWarning
            >
              {isTransmitting ? (
                <span className="text-xs font-light tracking-wider text-[#ec4899]">Transmitting...</span>
              ) : (
                <>
                  <div className="w-3 h-3 bg-[#ec4899] transition-all duration-300 group-hover:shadow-[0_0_10px_rgba(236,72,153,0.5)]" />
                  <div className="w-3 h-3 bg-[#ec4899] transition-all duration-300 group-hover:shadow-[0_0_10px_rgba(236,72,153,0.5)]" />
                  <div className="w-3 h-3 bg-[#ec4899] transition-all duration-300 group-hover:shadow-[0_0_10px_rgba(236,72,153,0.5)]" />
                  <div className="w-3 h-3 bg-[#ec4899] transition-all duration-300 group-hover:shadow-[0_0_10px_rgba(236,72,153,0.5)]" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
