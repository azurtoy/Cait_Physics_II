'use client';

import { useState, useRef, useEffect } from 'react';

interface SignalWidgetProps { variant?: 'light' | 'dark'; }

export default function SignalWidget({ variant = 'dark' }: SignalWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({ email: '', message: '' });
  const [isTransmitting, setIsTransmitting] = useState(false);
  const [buttonText, setButtonText] = useState<'SIGNAL' | 'SENDING...' | 'SIGNAL SENT'>('SIGNAL');
  const [errors, setErrors] = useState({ email: '', message: '' });
  const [submitError, setSubmitError] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const validateForm = () => {
    const newErrors = { email: '', message: '' };
    
    // 이메일 검증
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = 'Invalid email format';
      }
    }
    
    // 메시지 검증
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    }
    
    setErrors(newErrors);
    return !newErrors.email && !newErrors.message;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsTransmitting(true);
    setButtonText('SENDING...');
    setSubmitError('');
    
    try {
      const response = await fetch('/api/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          message: formData.message,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to send signal');
      }
      
      // 성공 시 "SIGNAL SENT" 표시
      setButtonText('SIGNAL SENT');
      
      // 2초 후 원래대로 복귀
      setTimeout(() => {
        setFormData({ email: '', message: '' });
        setErrors({ email: '', message: '' });
        setIsOpen(false);
        setIsTransmitting(false);
        setButtonText('SIGNAL');
      }, 2000);
      
    } catch (error: any) {
      console.error('❌ Signal transmission error:', error);
      setSubmitError(error?.message || 'Failed to send signal. Please try again.');
      setIsTransmitting(false);
      setButtonText('SIGNAL');
    }
  };

  const isLight = variant === 'light';

  // textarea 자동 높이 조절 (최대 높이 제한)
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      // 최대 높이: 화면 높이의 40% 또는 300px 중 작은 값
      const maxHeight = Math.min(window.innerHeight * 0.4, 300);
      
      textarea.style.height = 'auto';
      const newHeight = Math.min(textarea.scrollHeight, maxHeight);
      textarea.style.height = `${newHeight}px`;
      
      // 최대 높이에 도달하면 스크롤바 표시
      if (textarea.scrollHeight > maxHeight) {
        textarea.style.overflowY = 'auto';
      } else {
        textarea.style.overflowY = 'hidden';
      }
    }
  }, [formData.message]);

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-40 flex items-center gap-2 px-4 py-3 shadow-lg transition-all group ${
          isLight ? 'bg-white border border-gray-200 text-gray-800 hover:bg-gray-50' : 'bg-black border border-zinc-800 text-white hover:bg-zinc-900'
        }`}
        suppressHydrationWarning
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-4 h-4 ${isLight ? 'text-gray-800' : 'text-white'}`}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.288 15.038a5.25 5.25 0 0 1 7.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 0 1 1.06 0Z" />
        </svg>
        <span className={`text-xs font-light tracking-wider uppercase ${isLight ? 'text-gray-800' : 'text-white'}`}>Signal</span>
      </button>

      <div className={`fixed bottom-24 right-6 z-40 w-96 max-w-[calc(100vw-3rem)] shadow-2xl transition-all duration-300 ${
        isLight ? 'bg-white border border-gray-300' : 'bg-black border border-zinc-800'
      } ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0 pointer-events-none'}`}>
        <div className="relative p-4 text-center">
          <button onClick={() => setIsOpen(false)} className={`absolute top-3 right-3 ${isLight ? 'text-gray-400 hover:text-gray-800' : 'text-zinc-600 hover:text-zinc-400'}`} suppressHydrationWarning>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
          </button>
          <h2 className={`mb-4 text-sm font-light tracking-[0.3em] uppercase ${isLight ? 'text-gray-800' : 'text-white'}`}>Transmit Signal</h2>
          <form onSubmit={handleSubmit} className="space-y-2.5 text-left" noValidate>
            <div>
              <label className={`block text-[10px] font-extralight tracking-[0.2em] mb-1.5 uppercase ${isLight ? 'text-gray-600' : 'text-gray-400'}`}>
                EMAIL
              </label>
              <input
                type="email"
                placeholder="username@lakeheadu.ca"
                value={formData.email}
                onChange={(e) => {
                  setFormData({...formData, email: e.target.value});
                  if (errors.email) setErrors({...errors, email: ''});
                }}
                className={`w-full px-3 py-1.5 border text-sm outline-none ${errors.email ? 'border-[#ec4899]' : isLight ? 'border-gray-300 focus:border-gray-600' : 'border-zinc-700 focus:border-zinc-500'} ${isLight ? 'bg-white text-gray-800' : 'bg-black text-white'}`}
                suppressHydrationWarning
              />
              {errors.email && <p className="text-xs text-[#ec4899] font-light mt-1">⚠ {errors.email}</p>}
            </div>
            <div>
              <label className={`block text-[10px] font-extralight tracking-[0.2em] mb-1.5 uppercase ${isLight ? 'text-gray-600' : 'text-gray-400'}`}>
                MESSAGE
              </label>
              <textarea
                ref={textareaRef}
                placeholder="Feedback / Error Report / Suggestion"
                value={formData.message}
                onChange={(e) => {
                  setFormData({...formData, message: e.target.value});
                  if (errors.message) setErrors({...errors, message: ''});
                }}
                className={`w-full px-3 py-1.5 border text-sm outline-none resize-none ${errors.message ? 'border-[#ec4899]' : isLight ? 'border-gray-300 focus:border-gray-600' : 'border-zinc-700 focus:border-zinc-500'} ${isLight ? 'bg-white text-gray-800' : 'bg-black text-white'}`}
                rows={3}
                suppressHydrationWarning
              />
              {errors.message && <p className="text-xs text-[#ec4899] font-light mt-1">⚠ {errors.message}</p>}
            </div>
            
            {submitError && (
              <p className="text-xs text-[#ec4899] font-light mt-1.5">⚠ {submitError}</p>
            )}
            
            <button type="submit" disabled={isTransmitting} className="w-full py-3 mt-3 flex items-center justify-center gap-2 group disabled:opacity-50" suppressHydrationWarning>
              {buttonText === 'SENDING...' ? (
                <span className={`text-xs animate-pulse ${variant === 'light' ? 'text-gray-500' : 'text-gray-500'}`}>SENDING...</span>
              ) : buttonText === 'SIGNAL SENT' ? (
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-black" />
                  <span className={`text-xs text-gray-500`}>SIGNAL SENT</span>
                </div>
              ) : (
                <div className="flex gap-2 items-center justify-center">
                  {[1,2,3,4].map(i => <div key={i} className="w-3 h-3 bg-zinc-600 transition-all group-hover:bg-zinc-500" />)}
                </div>
              )}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}