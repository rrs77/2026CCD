import type { ReactNode } from 'react';

/**
 * Left page of the open-notebook login — matches the approved sketchbook design.
 */
export function SketchbookLeftPage() {
  return (
    <div className="login-book-page login-book-page--left relative flex h-full flex-col overflow-hidden px-5 py-6 sm:px-7 sm:py-8 lg:px-9 lg:py-10">
      <div className="pointer-events-none absolute inset-0 login-book-paper" aria-hidden />
      <PencilCorner />

      <header className="relative z-10 mb-6 hidden sm:mb-8 lg:block">
        <span className="mb-1 inline-block text-sm text-[#0a2a44]/40" aria-hidden>
          ✦
        </span>
        {/* Desktop book page: three-line hand-lettered title */}
        <h1
          className="text-[clamp(1.85rem,4.2vw,2.85rem)] font-semibold leading-[1.02] tracking-tight text-[#0a2a44]"
          style={{ fontFamily: '"Caveat", cursive' }}
        >
          Creative
          <br />
          Curriculum
          <br />
          Designer
        </h1>
      </header>

      <div className="relative z-10 flex flex-1 flex-col justify-center gap-5 sm:gap-6 lg:gap-7">
        <SubjectRow
          n="1"
          title="Drama"
          sketch={<DramaSketch />}
          lines={['Activity Library', 'Hot seating / Still image']}
        />
        <DashedRule />
        <SubjectRow
          n="2"
          title="Music"
          sketch={<MusicSketch />}
          lines={['Composition', 'Kodály & rhythm', 'Lesson Builder']}
        />
        <DashedRule />
        <SubjectRow
          n="3"
          title="Dance"
          sketch={<DanceSketch />}
          lines={['Motif & canon', 'Choreography', 'Units of work']}
        />
      </div>

      <div className="relative z-10 mt-8 flex flex-wrap items-end gap-5">
        <div
          className="login-sketch-sticky max-w-[12.5rem] rounded-[2px] border border-[#d4b896] px-3 py-2.5 shadow-[2px_3px_0_rgba(10,42,68,0.08)]"
          style={{
            backgroundColor: '#fff4c8',
            transform: 'rotate(-2.5deg)',
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
          className="flex h-[4.75rem] w-[4.75rem] items-center justify-center rounded-full border-[1.5px] border-dashed border-[#0a2a44]/50 text-center"
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
        <span className="ml-auto text-lg text-[#0a2a44]/35" aria-hidden>
          ✦
        </span>
      </div>
    </div>
  );
}

function SubjectRow({
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
    <div className="flex items-start gap-3 sm:gap-4">
      <div className="w-[6.5rem] shrink-0 text-[#0a2a44] sm:w-[8.25rem]">{sketch}</div>
      <div className="min-w-0 pt-1">
        <h2
          className="text-[1.4rem] leading-none text-[#0a2a44] sm:text-[1.6rem]"
          style={{ fontFamily: '"Caveat", cursive', fontWeight: 700 }}
        >
          <span className="mr-1.5 inline-flex h-7 w-7 items-center justify-center rounded-full border border-[#0a2a44]/45 text-sm">
            {n}
          </span>
          {title}
        </h2>
        <ul
          className="mt-2 space-y-0.5 text-[1.05rem] leading-snug text-[#2f4a42]"
          style={{ fontFamily: '"Caveat", cursive' }}
        >
          {lines.map((line) => (
            <li key={line}>· {line}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function DashedRule() {
  return (
    <div
      aria-hidden
      className="border-t border-dashed border-[#0a2a44]/25"
    />
  );
}

function PencilCorner() {
  return (
    <svg
      aria-hidden
      className="pointer-events-none absolute right-4 top-5 h-14 w-10 text-[#0a2a44]/30 sm:right-6 sm:top-7 sm:h-16 sm:w-12"
      viewBox="0 0 40 64"
      fill="none"
    >
      <path d="M18 4l6 2-8 48-6-2L18 4z" stroke="currentColor" strokeWidth="1.3" />
      <path d="M12 52l6 2 2-10-6-2-2 10z" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1" />
      <path d="M20 6l3 1" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

function DramaSketch() {
  return (
    <svg viewBox="0 0 120 78" className="h-auto w-full" aria-hidden fill="none">
      <path d="M16 64h88" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M24 64V26h72v38" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M24 26c14-12 30-16 36-16s22 4 36 16" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="46" cy="42" r="5.5" stroke="currentColor" strokeWidth="1.4" />
      <path d="M46 48v12M41 55h10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <circle cx="74" cy="40" r="5.5" stroke="currentColor" strokeWidth="1.4" />
      <path d="M74 46v14M69 54h10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <path d="M36 64c3-6 8-9 12-9s8 3 12 8" stroke="currentColor" strokeWidth="1" opacity="0.45" />
      <path d="M62 64c2-7 8-10 14-9 5 1 8 5 10 9" stroke="currentColor" strokeWidth="1" opacity="0.45" />
    </svg>
  );
}

function MusicSketch() {
  return (
    <svg viewBox="0 0 120 78" className="h-auto w-full" aria-hidden fill="none">
      <path d="M14 22h92M14 32h92M14 42h92M14 52h92" stroke="currentColor" strokeWidth="1" opacity="0.3" />
      <path d="M44 50V18l30-7v32" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <ellipse cx="44" cy="52" rx="7" ry="5.5" fill="currentColor" fillOpacity="0.12" stroke="currentColor" strokeWidth="1.4" />
      <ellipse cx="74" cy="43" rx="7" ry="5.5" fill="currentColor" fillOpacity="0.12" stroke="currentColor" strokeWidth="1.4" />
      <path d="M74 43V12" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M44 18c8 3 18 4 30 0" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}

function DanceSketch() {
  return (
    <svg viewBox="0 0 120 78" className="h-auto w-full" aria-hidden fill="none">
      <circle cx="26" cy="14" r="5.5" stroke="currentColor" strokeWidth="1.4" />
      <path d="M26 20c-2 8 4 14 1 22M18 30h14M22 42l-8 18M30 42l10 16" stroke="currentColor" strokeWidth="1.45" strokeLinecap="round" />
      <circle cx="58" cy="12" r="5.5" stroke="currentColor" strokeWidth="1.4" />
      <path d="M58 18c3 7-2 14 1 22M48 28h18M54 40l-10 20M62 40l12 18" stroke="currentColor" strokeWidth="1.45" strokeLinecap="round" />
      <circle cx="92" cy="16" r="5.5" stroke="currentColor" strokeWidth="1.4" />
      <path d="M92 22c-3 7 2 13-1 20M82 32h16M88 42l-6 18M94 42l10 16" stroke="currentColor" strokeWidth="1.45" strokeLinecap="round" />
    </svg>
  );
}
