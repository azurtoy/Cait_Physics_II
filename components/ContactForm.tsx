'use client';

import { useState } from 'react';

export default function ContactForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you can add email functionality or API call
    console.log('Contact form submitted:', formData);
    alert('Signal received. (Configure email service to enable transmission)');
    setFormData({ name: '', email: '', message: '' });
    setIsOpen(false);
  };

  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-xs sm:text-sm font-extralight tracking-[0.25em] text-gray-400 hover:text-lca-pink transition-all duration-500 uppercase border border-transparent hover:border-lca-pink rounded"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
        </svg>
        signal
      </button>

      {isOpen && (
        <div className="fixed bottom-20 sm:bottom-24 right-4 sm:right-8 w-80 sm:w-96 bg-white border border-gray-300 p-6 sm:p-8 animate-fade-in shadow-2xl">
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-3 right-3 text-lg text-gray-400 hover:text-lca-pink transition-colors"
          >
            ×
          </button>
          
          <div className="mb-6">
            <h3 className="text-sm font-extralight tracking-[0.2em] text-gray-800 uppercase">
              Transmit Signal
            </h3>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <input
                type="text"
                placeholder="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-transparent border-0 border-b border-gray-300 text-sm font-light tracking-wide placeholder-gray-400 focus:outline-none focus:border-lca-pink pb-2 transition-colors duration-500"
                required
              />
            </div>

            <div>
              <input
                type="email"
                placeholder="return frequency (your email)"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-transparent border-0 border-b border-gray-300 text-sm font-light tracking-wide placeholder-gray-400 focus:outline-none focus:border-lca-pink pb-2 transition-colors duration-500"
                required
              />
            </div>

            <div>
              <textarea
                placeholder="message"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                rows={4}
                className="w-full bg-transparent border-0 border-b border-gray-300 text-sm font-light tracking-wide placeholder-gray-400 focus:outline-none focus:border-lca-pink pb-2 resize-none transition-colors duration-500"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full border border-gray-400 py-3 text-sm font-extralight tracking-[0.3em] hover:bg-lca-pink hover:text-white hover:border-lca-pink hover:shadow-[0_0_20px_rgba(255,53,139,0.4)] transition-all duration-700 uppercase ease-in-out"
            >
              Transmit
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
