import type { ReactNode } from 'react';

/** Left page of the responsive sketchbook login — creative arts content. */
export function SketchbookLeftPage() {
  return (
    <div className="login-book-page login-book-page--left relative flex h-full flex-col overflow-hidden px-5 py-6 sm:px-7 sm:py-8 lg:px-8 lg:py-9">
      <div className="pointer-events-none absolute inset-0 login-book-paper" aria-hidden />

      <header className="relative z-10 mb-5 sm:mb-7">
        <p className="mb-1 flex items-center gap-2 text-[#0a2a44]/50" aria-hidden>
          <span className="text-sm">✦</span>
        </p>
        <h1
          className="text-[clamp(1.75rem,3.5vw,2.65rem)] font-semibold leading-[1.05] tracking-tight text-[#0a2a44]"
          style={{ fontFamily: '"Caveat", cursive' }}
        >
          Creative
          <br />
          Curriculum
          <br />
          Designer
        </h1>
      </header>

      <div className="relative z-10 flex flex-1 flex-col gap-5 sm:gap-6">
        <SubjectBlock
          n="1"
          title="Drama"
          sketch={<DramaSketch />}
          lines={['Activity Library', 'Hot seating / Still image']}
        />
        <SubjectBlock
          n="2"
          title="Music"
          sketch={<MusicSketch />}
          lines={['Composition', 'Kodály & rhythm', 'Lesson Builder']}
        />
        <SubjectBlock
          n="3"
          title="Dance"
          sketch={<DanceSketch />}
          lines={['Motif & canon', 'Choreography', 'Units of work']}
        />
      </div>

      <div className="relative z-10 mt-6 flex flex-wrap items-end gap-4">
        <div
          className="login-sketch-sticky max-w-[13rem] rounded-[2px] border border-[#d4b896] px-3 py-2.5 shadow-[2px_3px_0_rgba(10,42,68,0.08)]"
          style={{
            backgroundColor: '#fff4c8',
            transform: 'rotate(-2deg)',
            fontFamily: '"Caveat", cursive',
          }}
        >
          <p className="text-[1.15rem] leading-snug text-[#0a2a44]">
            Capture ideas →
            <br />
            Build lessons →
            <br />
            Plan the half-term
          </p>
        </div>
        <div
          className="flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-full border-[1.5px] border-dashed border-[#0a2a44]/45 text-center"
          style={{ fontFamily: '"Caveat", cursive' }}
          aria-hidden
        >
          <span className="text-[0.8rem] leading-tight text-[#0a2a44]/85">
            Drama
            <br />
            Music
            <br />
            Dance
          </span>
        </div>
      </div>
    </div>
  );
}

function SubjectBlock({
  n,
  title,
  sketch,
  lines,
}: {
  n: string;
  title: string;
  sketch: ReactNode;
  lines: string[];
}) {
  return (
    <div className="flex items-start gap-3 border-b border-dashed border-[#0a2a44]/20 pb-4 last:border-b-0 last:pb-0 sm:gap-4">
      <div className="w-[5.5rem] shrink-0 text-[#0a2a44] sm:w-[6.75rem]">{sketch}</div>
      <div className="min-w-0 pt-0.5">
        <h2
          className="text-[1.2rem] leading-none text-[#0a2a44] sm:text-[1.35rem]"
          style={{ fontFamily: '"Caveat", cursive', fontWeight: 700 }}
        >
          <span className="mr-1 inline-flex h-6 w-6 items-center justify-center rounded-full border border-[#0a2a44]/40 text-sm">
            {n}
          </span>
          {title}
        </h2>
        <ul className="mt-1.5 space-y-0.5 text-[0.82rem] leading-snug text-[#2f4a42]">
          {lines.map((line) => (
            <li key={line} className="flex gap-1.5">
              <span aria-hidden className="text-[#0a2a44]/35">
                ·
              </span>
              <span>{line}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function DramaSketch() {
  return (
    <svg viewBox="0 0 120 78" className="h-auto w-full" aria-hidden fill="none">
      <path d="M18 62h84" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M26 62V28h68v34" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M26 28c12-10 28-14 34-14s22 4 34 14" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="48" cy="44" r="5" stroke="currentColor" strokeWidth="1.3" />
      <path d="M48 49v10M44 54h8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="72" cy="42" r="5" stroke="currentColor" strokeWidth="1.3" />
      <path d="M72 47v12M68 53h8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M38 62c2-5 6-8 10-8s7 2 10 7" stroke="currentColor" strokeWidth="1" opacity="0.45" />
    </svg>
  );
}

function MusicSketch() {
  return (
    <svg viewBox="0 0 120 78" className="h-auto w-full" aria-hidden fill="none">
      <path d="M16 24h88M16 34h88M16 44h88M16 54h88" stroke="currentColor" strokeWidth="1" opacity="0.35" />
      <path d="M48 52V22l28-6v30" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="48" cy="52" r="5" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="76" cy="46" r="5" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="1.4" />
      <path d="M76 46V18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function DanceSketch() {
  return (
    <svg viewBox="0 0 120 78" className="h-auto w-full" aria-hidden fill="none">
      <circle cx="28" cy="16" r="5" stroke="currentColor" strokeWidth="1.4" />
      <path d="M28 21c-1 8 4 14 2 22M22 30h12M24 43l-6 16M32 43l8 15" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="60" cy="14" r="5" stroke="currentColor" strokeWidth="1.4" />
      <path d="M60 19c2 7-2 14 0 22M52 28h16M56 41l-8 18M64 41l10 16" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="94" cy="18" r="5" stroke="currentColor" strokeWidth="1.4" />
      <path d="M94 23c-3 7 1 13-1 20M86 32h14M90 43l-4 17M96 43l8 16" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}
