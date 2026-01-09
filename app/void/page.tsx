'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function VoidPage() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // 페이지 로드 시 페이드인 효과
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden flex items-center justify-center">
      {/* 배경 별 효과 */}
      <div className="absolute inset-0">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-0.5 h-0.5 bg-white rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              opacity: Math.random() * 0.7 + 0.3,
            }}
          />
        ))}
      </div>

      {/* 메인 콘텐츠 */}
      <main 
        className={`relative z-10 flex flex-col items-center gap-8 transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        {/* 중앙 핑크 링 */}
        <div className="relative flex items-center justify-center">
          <div 
            className="w-24 h-24 border-[4px] border-[#FF358B] rounded-full shadow-[0_0_40px_rgba(255,53,139,0.6),0_0_80px_rgba(255,53,139,0.3)]"
          />
          <div className="absolute w-3 h-3 bg-[#FF358B] rounded-full shadow-[0_0_15px_rgba(255,53,139,0.8)]" />
        </div>

        {/* 제목 */}
        <div className="flex flex-col items-center gap-4">
          <h1 className="text-4xl font-light tracking-[0.5em] text-white">
            PLANET VOID
          </h1>
          
          <p className="text-sm font-light tracking-[0.3em] text-[#FF358B]">
            Landing Successful
          </p>

          <div className="mt-8 flex flex-col items-center gap-3">
            <p className="text-xs font-extralight text-gray-400 tracking-wider">
              ✓ Coordinates Locked
            </p>
            <p className="text-xs font-extralight text-gray-400 tracking-wider">
              ✓ Signal Stable
            </p>
          </div>
        </div>

        {/* 진입 버튼 */}
        <Link 
          href="/study"
          className="mt-8 px-8 py-3 border border-[#FF358B] text-xs tracking-[0.3em] font-light text-white hover:bg-[#FF358B] hover:text-white transition-all duration-300"
        >
          ENTER STATION
        </Link>
      </main>

      {/* 하단 좌표 */}
      <div className="absolute bottom-8 left-8 text-[10px] font-mono text-gray-600">
        <p>LAT: 48.3794° N</p>
        <p>LONG: 89.2477° W</p>
        <p className="mt-2">SYSTEM: LCA-001</p>
      </div>
    </div>
  );
}
