'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { getChapterById } from '@/data/physicsData';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import Link from 'next/link';

export default function ChapterPage() {
  const params = useParams();
  const chapterId = params.chapterId as string;
  const chapter = getChapterById(chapterId);

  const [expandedProblems, setExpandedProblems] = useState<number[]>([]);

  if (!chapter) {
    return (
      <div className="p-8 lg:p-16">
        <div className="max-w-4xl mx-auto bg-black/40 backdrop-blur-md border border-white/10 p-12 rounded-lg text-center">
          <h1 className="text-2xl font-light text-white mb-4">Chapter Not Found</h1>
          <Link href="/study" className="text-[#FF358B] hover:underline text-sm">
            Return to Study Station
          </Link>
        </div>
      </div>
    );
  }

  const toggleProblem = (index: number) => {
    setExpandedProblems(prev =>
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  return (
    <div className="p-6 lg:p-16">
      
      {/* Glass Panel Container */}
      <div className="max-w-4xl mx-auto bg-black/40 backdrop-blur-md border border-white/10 rounded-lg overflow-hidden">
        
        {/* Header */}
        <div className="p-8 lg:p-12 border-b border-white/10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-2 h-2 bg-[#FF358B] rounded-full shadow-[0_0_10px_#FF358B]" />
            <span className="text-xs text-gray-400 tracking-widest">CHAPTER {chapter.id}</span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-light text-gray-100 mb-2">
            {chapter.title.replace(/^Ch \d+\.\s*/, '')}
          </h1>
        </div>

        {/* Content */}
        <div className="p-8 lg:p-12">
          
          {/* Summary */}
          <section className="mb-12">
            <div className="prose prose-invert prose-sm max-w-none">
              <ReactMarkdown
                remarkPlugins={[remarkMath]}
                rehypePlugins={[rehypeKatex]}
                components={{
                  h2: ({ node, ...props }) => <h2 className="text-xl font-light text-gray-100 mb-4 mt-8" {...props} />,
                  h3: ({ node, ...props }) => <h3 className="text-lg font-light text-gray-200 mb-3 mt-6" {...props} />,
                  p: ({ node, ...props }) => <p className="text-gray-200 font-light leading-relaxed mb-4" {...props} />,
                  strong: ({ node, ...props }) => <strong className="text-gray-100 font-medium" {...props} />,
                  ul: ({ node, ...props }) => <ul className="list-disc list-inside text-gray-200 mb-4 space-y-2" {...props} />,
                  li: ({ node, ...props }) => <li className="font-light" {...props} />,
                }}
              >
                {chapter.summary}
              </ReactMarkdown>
            </div>
          </section>

          {/* YouTube Video */}
          {chapter.youtubeId && (
            <section className="mb-12">
              <h2 className="text-sm font-light tracking-[0.3em] text-gray-400 mb-4">
                VIDEO LECTURE
              </h2>
              <div className="aspect-video bg-black/60 border border-white/10 rounded overflow-hidden">
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${chapter.youtubeId}`}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </section>
          )}

          {/* Formulas */}
          {chapter.formulas.length > 0 && (
            <section className="mb-12">
              <h2 className="text-sm font-light tracking-[0.3em] text-gray-400 mb-4">
                KEY FORMULAS
              </h2>
              <div className="grid gap-3">
                {chapter.formulas.map((formula, idx) => (
                  <div key={idx} className="p-4 bg-white/5 border border-white/10 rounded">
                    <div className="text-xs text-gray-300 mb-2 font-light tracking-wide">
                      {formula.name}
                    </div>
                    <div className="text-gray-100 overflow-x-auto">
                      <BlockMath math={formula.latex} />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Problems */}
          {chapter.problems.length > 0 && (
            <section className="mb-12">
              <h2 className="text-sm font-light tracking-[0.3em] text-gray-400 mb-4">
                PRACTICE PROBLEMS
              </h2>
              <div className="space-y-4">
                {chapter.problems.map((problem, idx) => (
                  <div key={idx} className="border border-white/10 rounded overflow-hidden bg-white/5">
                    <button
                      onClick={() => toggleProblem(idx)}
                      className="w-full p-4 text-left hover:bg-white/5 transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-[#FF358B] text-sm font-light mt-1">
                          {String(idx + 1).padStart(2, '0')}
                        </span>
                        <div className="flex-1">
                          <ReactMarkdown
                            remarkPlugins={[remarkMath]}
                            rehypePlugins={[rehypeKatex]}
                            className="text-gray-200 font-light text-sm"
                          >
                            {problem.q}
                          </ReactMarkdown>
                        </div>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className={`w-5 h-5 text-gray-500 transition-transform ${expandedProblems.includes(idx) ? 'rotate-180' : ''}`}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                        </svg>
                      </div>
                    </button>

                    {expandedProblems.includes(idx) && (
                      <div className="p-4 pt-0 border-t border-white/10 bg-black/20">
                        <div className="text-xs text-gray-400 mb-3 tracking-wider">SOLUTION</div>
                        <div className="prose prose-invert prose-sm max-w-none">
                          <ReactMarkdown
                            remarkPlugins={[remarkMath]}
                            rehypePlugins={[rehypeKatex]}
                            components={{
                              p: ({ node, ...props }) => <p className="text-gray-200 font-light mb-3" {...props} />,
                              strong: ({ node, ...props }) => <strong className="text-gray-100" {...props} />,
                            }}
                          >
                            {problem.a}
                          </ReactMarkdown>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Report Error Button */}
          <div className="text-center">
            <a
              href={`mailto:azurtoy@gmail.com?subject=Signal Error - Chapter ${chapter.id}`}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs text-gray-400 hover:text-[#FF358B] border border-white/10 hover:border-[#FF358B] rounded transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
              Report Signal Error
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
