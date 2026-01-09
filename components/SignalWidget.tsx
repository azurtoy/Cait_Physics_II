'use client';

import { useState } from 'react';

export default function SignalWidget() {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ email: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Signal transmitted:', formData);
    alert('Signal transmitted successfully!');
    setFormData({ email: '', message: '' });
    setShowModal(false);
  };

  return (
    <>
      {/* Floating Signal Button - Bottom Right */}
      <button
        onClick={() => setShowModal(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-4 py-3 bg-white border border-gray-300 shadow-lg hover:shadow-xl transition-all group"
        title="Transmit Signal"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24" 
          strokeWidth={1.5} 
          stroke="currentColor" 
          className="w-4 h-4 text-gray-600 group-hover:text-gray-800"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.288 15.038a5.25 5.25 0 0 1 7.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 0 1 1.06 0Z" />
        </svg>
        <span className="text-xs font-light tracking-wider text-gray-600 group-hover:text-gray-800">
          SIGNAL
        </span>
      </button>

      {/* Modal Overlay */}
      {showModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm"
          onClick={() => setShowModal(false)}
        >
          <div 
            className="relative w-full max-w-md mx-4 bg-white border border-gray-300 shadow-2xl p-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Title */}
            <h2 className="mb-6 text-lg font-light tracking-[0.4em] text-center text-gray-800">
              TRANSMIT SIGNAL
            </h2>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-light text-gray-600 tracking-wide mb-2">
                  EMAIL
                </label>
                <input
                  type="email"
                  placeholder="your.email@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 text-sm text-gray-800 focus:outline-none focus:border-gray-600 transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-light text-gray-600 tracking-wide mb-2">
                  MESSAGE
                </label>
                <textarea
                  placeholder="Feedback / Error Report / Suggestion"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 text-sm text-gray-800 focus:outline-none focus:border-gray-600 transition-colors resize-none"
                  rows={4}
                  required
                />
              </div>

              {/* Submit Button - Four Blocks */}
              <button
                type="submit"
                className="w-full py-6 mt-2 flex items-center justify-center gap-2 group"
              >
                <div className="w-3 h-3 bg-gray-800 transition-all duration-300 group-hover:shadow-[0_0_10px_rgba(0,0,0,0.5)]" />
                <div className="w-3 h-3 bg-gray-800 transition-all duration-300 group-hover:shadow-[0_0_10px_rgba(0,0,0,0.5)]" />
                <div className="w-3 h-3 bg-gray-800 transition-all duration-300 group-hover:shadow-[0_0_10px_rgba(0,0,0,0.5)]" />
                <div className="w-3 h-3 bg-gray-800 transition-all duration-300 group-hover:shadow-[0_0_10px_rgba(0,0,0,0.5)]" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
