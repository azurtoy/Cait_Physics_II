'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SidebarProps {
  onNavigate?: () => void;
}

interface Chapter {
  number: number;
  title: string;
  path: string;
}

const chapters: Chapter[] = [
  // Oscillations & Waves
  { number: 15, title: "Oscillations", path: "/study/chapter/15" },
  { number: 16, title: "Waves - I", path: "/study/chapter/16" },
  { number: 17, title: "Waves - II", path: "/study/chapter/17" },
  
  // Thermodynamics
  { number: 18, title: "Temperature, Heat, and First Law", path: "/study/chapter/18" },
  { number: 19, title: "Kinetic Theory of Gases", path: "/study/chapter/19" },
  { number: 20, title: "Entropy and Second Law", path: "/study/chapter/20" },
  
  // Electromagnetism
  { number: 21, title: "Coulomb's Law", path: "/study/chapter/21" },
  { number: 22, title: "Electric Fields", path: "/study/chapter/22" },
  { number: 23, title: "Gauss' Law", path: "/study/chapter/23" },
  { number: 24, title: "Electric Potential", path: "/study/chapter/24" },
  { number: 25, title: "Capacitance", path: "/study/chapter/25" },
  { number: 26, title: "Current and Resistance", path: "/study/chapter/26" },
  { number: 27, title: "Circuits", path: "/study/chapter/27" },
  { number: 28, title: "Magnetic Fields", path: "/study/chapter/28" },
  { number: 29, title: "Magnetic Fields Due to Currents", path: "/study/chapter/29" },
  { number: 30, title: "Induction and Inductance", path: "/study/chapter/30" },
  { number: 31, title: "Electromagnetic Oscillations", path: "/study/chapter/31" },
  
  // Optics
  { number: 34, title: "Images", path: "/study/chapter/34" },
  { number: 35, title: "Interference", path: "/study/chapter/35" },
  { number: 36, title: "Diffraction", path: "/study/chapter/36" },
];

const sectionHeaders = [
  { title: "Oscillations & Waves", chapters: [15, 16, 17] },
  { title: "Thermodynamics", chapters: [18, 19, 20] },
  { title: "Electromagnetism", chapters: [21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31] },
  { title: "Optics", chapters: [34, 35, 36] },
];

export default function Sidebar({ onNavigate }: SidebarProps) {
  const pathname = usePathname();

  const handleClick = () => {
    if (onNavigate) onNavigate();
  };

  return (
    <aside className="h-full w-full bg-white border-r border-gray-200 overflow-y-auto flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <Link href="/study" onClick={handleClick}>
            <h1 className="text-xl font-bold text-gray-800 mb-1 hover:text-lca-pink transition-colors">
              Physics II
            </h1>
            <p className="text-sm text-gray-500">Halliday 12th Ed.</p>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto">
          {/* Formula Sheet Link */}
          <Link
            href="/study/formulas"
            onClick={handleClick}
            className={`block px-4 py-2.5 mb-4 rounded-lg font-medium transition-colors ${
              pathname === '/study/formulas'
                ? 'bg-pink-50 text-lca-pink'
                : 'text-gray-700 hover:bg-gray-50 hover:text-lca-pink'
            }`}
          >
            📋 Formula Sheet
          </Link>

          {/* Chapters by Section */}
          {sectionHeaders.map((section) => (
            <div key={section.title} className="mb-6">
              <h3 className="px-4 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                {section.title}
              </h3>
              <ul className="space-y-1">
                {chapters
                  .filter(ch => section.chapters.includes(ch.number))
                  .map((chapter) => (
                    <li key={chapter.number}>
                      <Link
                        href={chapter.path}
                        onClick={handleClick}
                        className={`block px-4 py-2 rounded-lg text-sm transition-colors ${
                          pathname === chapter.path
                            ? 'bg-pink-50 text-lca-pink font-medium'
                            : 'text-gray-700 hover:bg-gray-50 hover:text-lca-pink'
                        }`}
                      >
                        <span className="font-medium">Ch. {chapter.number}</span>
                        <span className="ml-2">{chapter.title}</span>
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </nav>

        {/* Home (VOID) Button - Bottom */}
        <div className="p-4 border-t border-gray-200 mt-auto">
          <Link
            href="/"
            onClick={handleClick}
            className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-[11px] font-extralight tracking-[0.2em] text-gray-700 hover:bg-pink-50 hover:text-lca-pink transition-colors uppercase"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" strokeWidth={1} />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 2v20M2 12h20" opacity="0.3" />
            </svg>
            <span>Return to Void</span>
          </Link>
        </div>
      </aside>
  );
}
