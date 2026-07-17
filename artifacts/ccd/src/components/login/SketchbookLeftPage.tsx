import type { ReactNode } from 'react';

/** Left page of the responsive sketchbook login — creative arts content. */
export function SketchbookLeftPage() {
  return (
    <div className="login-book-page login-book-page--left relative flex h-full flex-col overflow-hidden px-4 py-6 sm:px-7 sm:py-8 lg:px-8 lg:py-9">
      <div className="pointer-events-none absolute inset-0 login-book-paper" aria-hidden />
      <InkScribbles />

      <header className="relative z-10 mb-6 sm:mb-8">
        <div className="mb-2 flex items-center gap-2" aria-hidden>
          <span className="text-base text-[#0a2a44]/45">✦</span>
          <span className="h-px flex-1 max-w-[3rem] bg-[#0a2a44]/20" />
        </div>
        <h1
          className="whitespace-nowrap text-[clamp(1.35rem,6.2vw,2.75rem)] font-semibold leading-none tracking-tight text-[#0a2a44]"
          style={{ fontFamily: '"Caveat", cursive' }}
        >
          Creative Curriculum Designer
        </h1>
        <svg
          aria-hidden
          className="mt-2 h-3 w-28 text-[#0a2a44]/35 sm:w-36"
          viewBox="0 0 140 12"
          fill="none"
        >
          <path
            d="M2 8c20-6 40 2 60-1s40-4 76 2"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
        </svg>
      </header>

      {/* Artistic subject scenes — sketches lead, handwriting labels follow */}
      <div className="relative z-10 flex flex-1 flex-col gap-6 sm:gap-7">
        <SubjectScene
          n="1"
          title="Drama"
          sketch={<DramaSketch />}
          lines={['Activity Library', 'Hot seating / Still image']}
          tilt="-1.2deg"
        />
        <SubjectScene
          n="2"
          title="Music"
          sketch={<MusicSketch />}
          lines={['Composition', 'Kodály & rhythm', 'Lesson Builder']}
          tilt="0.8deg"
        />
        <SubjectScene
          n="3"
          title="Dance"
          sketch={<DanceSketch />}
          lines={['Motif & canon', 'Choreography', 'Units of work']}
          tilt="-0.6deg"
        />
      </div>

      <div className="relative z-10 mt-7 flex flex-wrap items-end justify-between gap-4">
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
          className="flex h-[4.75rem] w-[4.75rem] items-center justify-center rounded-full border-[1.5px] border-dashed border-[#0a2a44]/45 text-center"
          style={{ fontFamily: '"Caveat", cursive', transform: 'rotate(3deg)' }}
          aria-hidden
        >
          <span className="text-[0.85rem] leading-tight text-[#0a2a44]/85">
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

function SubjectScene({
  n,
  title,
  sketch,
  lines,
  tilt,
}: {
  n: string;
  title: string;
  sketch: ReactNode;
  lines: string[];
  tilt: string;
}) {
  return (
    <div
      className="login-sketch-card relative"
      style={{ transform: `rotate(${tilt})` }}
    >
      <div className="flex items-start gap-3 sm:gap-4">
        <div className="relative w-[6.25rem] shrink-0 text-[#0a2a44] sm:w-[8rem]">
          <div className="rounded-sm border border-[#0a2a44]/10 bg-[#fffdf8]/50 p-1.5 shadow-[1px_2px_0_rgba(10,42,68,0.04)]">
            {sketch}
          </div>
        </div>
        <div className="min-w-0 flex-1 pt-1">
          <h2
            className="flex items-baseline gap-2 text-[1.35rem] leading-none text-[#0a2a44] sm:text-[1.55rem]"
            style={{ fontFamily: '"Caveat", cursive', fontWeight: 700 }}
          >
            <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#0a2a44]/50 text-base">
              {n}
            </span>
            {title}
          </h2>
          <ul
            className="mt-2 space-y-1 text-[0.95rem] leading-snug text-[#2f4a42]"
            style={{ fontFamily: '"Caveat", cursive' }}
          >
            {lines.map((line) => (
              <li key={line} className="flex gap-1.5">
                <span aria-hidden className="mt-0.5 text-[#0a2a44]/40">
                  ~
                </span>
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <svg
        aria-hidden
        className="mt-3 h-2 w-full text-[#0a2a44]/15"
        viewBox="0 0 200 8"
        preserveAspectRatio="none"
      >
        <path d="M0 5c30-4 60 3 100 0s60-3 100 1" stroke="currentColor" strokeWidth="1" fill="none" />
      </svg>
    </div>
  );
}

function InkScribbles() {
  return (
    <svg
      aria-hidden
      className="pointer-events-none absolute right-3 top-4 h-16 w-16 text-[#0a2a44]/18 sm:right-6 sm:top-6 sm:h-20 sm:w-20"
      viewBox="0 0 80 80"
      fill="none"
    >
      <path
        d="M10 58c8-16 18-8 28-28 8-16 18-18 34-22"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <path d="M58 14l6-6M64 18l5-3" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
      <circle cx="18" cy="22" r="1.8" fill="currentColor" />
      <circle cx="48" cy="30" r="1.4" fill="currentColor" />
    </svg>
  );
}

function DramaSketch() {
  return (
    <svg viewBox="0 0 120 78" className="h-auto w-full" aria-hidden fill="none">
      <path
        d="M8 58c4-3 10-2 16-1 10 2 16-8 26-10 8-2 14 3 22 1 10-2 16-9 26-10"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.3"
        strokeLinecap="round"
      />
      <path d="M16 64h88" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M24 64V26h72v38" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M24 26c14-12 30-16 36-16s22 4 36 16" stroke="currentColor" strokeWidth="1.5" />
      <path d="M30 26c8 6 18 8 30 8s22-2 30-8" stroke="currentColor" strokeWidth="1" opacity="0.4" />
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
      <circle cx="98" cy="26" r="2" fill="currentColor" opacity="0.45" />
      <path d="M18 64c12-5 24 3 36-2s22 1 34 3 20-4 30-1" stroke="currentColor" strokeWidth="1" opacity="0.35" strokeLinecap="round" />
    </svg>
  );
}

function DanceSketch() {
  return (
    <svg viewBox="0 0 120 78" className="h-auto w-full" aria-hidden fill="none">
      <circle cx="26" cy="14" r="5.5" stroke="currentColor" strokeWidth="1.4" />
      <path
        d="M26 20c-2 8 4 14 1 22M18 30h14M22 42l-8 18M30 42l10 16"
        stroke="currentColor"
        strokeWidth="1.45"
        strokeLinecap="round"
      />
      <path d="M16 26c-6-5-8-10-5-13" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="58" cy="12" r="5.5" stroke="currentColor" strokeWidth="1.4" />
      <path
        d="M58 18c3 7-2 14 1 22M48 28h18M54 40l-10 20M62 40l12 18"
        stroke="currentColor"
        strokeWidth="1.45"
        strokeLinecap="round"
      />
      <path d="M70 22c7-3 12-1 14 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="92" cy="16" r="5.5" stroke="currentColor" strokeWidth="1.4" />
      <path
        d="M92 22c-3 7 2 13-1 20M82 32h16M88 42l-6 18M94 42l10 16"
        stroke="currentColor"
        strokeWidth="1.45"
        strokeLinecap="round"
      />
      <path
        d="M10 68c22-7 44 5 66-2s32-3 44 3"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.3"
        strokeLinecap="round"
      />
    </svg>
  );
}
