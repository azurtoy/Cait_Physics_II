'use client';

import { useState, useMemo } from 'react';
import { getAllFormulas } from '@/data/physicsData';
import { BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import Link from 'next/link';

export default function FormulasPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const allFormulas = getAllFormulas();

  const filteredFormulas = useMemo(() => {
    if (!searchQuery.trim()) return allFormulas;
    
    const query = searchQuery.toLowerCase();
    return allFormulas.filter(f => 
      f.name.toLowerCase().includes(query) || 
      f.latex.toLowerCase().includes(query) ||
      f.chapterTitle.toLowerCase().includes(query)
    );
  }, [searchQuery, allFormulas]);

  return (
    <div className="p-6 lg:p-16">
      
      {/* Glass Panel Container */}
      <div className="max-w-5xl mx-auto bg-black/40 backdrop-blur-md border border-white/10 rounded-lg">
        
        {/* Header */}
        <div className="p-8 lg:p-12 border-b border-white/10">
          <div className="flex items-center gap-3 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-[#FF358B]">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            <span className="text-xs text-gray-400 tracking-widest">FORMULA DATABASE</span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-light text-gray-100 mb-6">
            Cheat Sheet
          </h1>

          {/* Search Bar */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search formulas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded text-sm text-gray-100 placeholder-gray-400 focus:outline-none focus:border-[#FF358B] transition-colors"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </div>

          {/* Results Count */}
          <p className="mt-4 text-xs text-gray-500">
            {filteredFormulas.length} formula{filteredFormulas.length !== 1 ? 's' : ''} found
          </p>
        </div>

        {/* Content */}
        <div className="p-8 lg:p-12">
          {filteredFormulas.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 font-light">No formulas match your search.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredFormulas.map((formula, idx) => (
                <div key={idx} className="p-5 bg-white/5 border border-white/10 rounded hover:border-[#FF358B] transition-colors">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <h3 className="text-sm font-light text-gray-100 mb-1">
                        {formula.name}
                      </h3>
                      <Link
                        href={`/study/${formula.chapterId}`}
                        className="text-xs text-gray-400 hover:text-[#FF358B] transition-colors"
                      >
                        {formula.chapterTitle}
                      </Link>
                    </div>
                  </div>
                  <div className="overflow-x-auto text-gray-100">
                    <BlockMath math={formula.latex} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
