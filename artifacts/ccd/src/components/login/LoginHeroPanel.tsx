interface LoginHeroPanelProps {
  logoLetters?: string;
  compact?: boolean;
}

const SUBJECTS = [
  {
    title: 'Drama',
    lines: ['Warm-up · Main · Plenary', 'Activity Library', 'Hot seating / Still image'],
  },
  {
    title: 'Music',
    lines: ['Composition', 'Kodály & rhythm', 'Lesson Builder'],
  },
  {
    title: 'Dance',
    lines: ['Motif & canon', 'Choreography', 'Units of work'],
  },
] as const;

export function LoginHeroPanel({ logoLetters = 'CCD', compact = false }: LoginHeroPanelProps) {
  return (
    <div
      className={`relative flex w-full flex-col overflow-hidden text-[#1a2e28] ${
        compact ? 'px-5 py-6 sm:px-7 sm:py-8' : 'min-h-full px-7 py-8 lg:min-h-[560px] lg:px-10 lg:py-10 xl:px-12'
      }`}
      style={{
        backgroundColor: '#f7f1e6',
        backgroundImage: `
          radial-gradient(ellipse at 12% 8%, rgba(0,45,36,0.04), transparent 42%),
          repeating-linear-gradient(0deg, transparent, transparent 31px, rgba(0,45,36,0.045) 32px)
        `,
        fontFamily: '"Source Sans 3", system-ui, sans-serif',
      }}
    >
      <SketchDecor compact={compact} />

      <div className={`relative z-10 flex flex-1 flex-col ${compact ? 'gap-5' : 'gap-7 lg:justify-between'}`}>
        <header className={compact ? '' : 'max-w-xl'}>
          <p
            className="mb-2 text-sm tracking-wide text-[#5a726a]"
            style={{ fontFamily: '"Caveat", cursive' }}
          >
            {logoLetters} · Performing arts teaching · EYFS to KS5
          </p>
          <h1
            className={`font-semibold leading-[1.08] tracking-tight text-[#002D24] ${
              compact ? 'text-[1.85rem] sm:text-[2.15rem]' : 'text-[2.15rem] sm:text-[2.55rem] lg:text-[2.75rem]'
            }`}
            style={{ fontFamily: '"Fraunces", Georgia, serif' }}
          >
            Creative Curriculum Designer
          </h1>
          <p
            className={`mt-3 text-[#0f3d34] ${
              compact ? 'text-xl sm:text-2xl' : 'text-2xl sm:text-[1.75rem] lg:text-[1.9rem]'
            }`}
            style={{ fontFamily: '"Caveat", cursive', fontWeight: 600 }}
          >
            Outstanding lessons start with a{' '}
            <span className="italic underline decoration-[#B6FF7E] decoration-[3px] underline-offset-4">
              connection
            </span>
          </p>
          <p className={`mt-2 text-[#4a635c] ${compact ? 'text-sm' : 'text-base lg:max-w-md'}`}>
            Capture ideas. Build lessons. Plan the half-term. Share or sell your resources —
            Drama, Music &amp; Dance from EYFS to A-level.
          </p>
        </header>

        <div
          className={`grid gap-3 ${compact ? 'grid-cols-1 sm:grid-cols-3' : 'grid-cols-1 sm:grid-cols-3 lg:gap-4'}`}
        >
          {SUBJECTS.map((subject, index) => (
            <SubjectCard key={subject.title} subject={subject} index={index} compact={compact} />
          ))}
        </div>

        <div className={`flex flex-wrap items-end gap-4 ${compact ? '' : 'mt-auto'}`}>
          <div
            className="login-sketch-sticky max-w-[220px] rounded-[2px] border border-[#e0c48a] px-3 py-2.5 shadow-[2px_3px_0_rgba(0,45,36,0.06)]"
            style={{
              backgroundColor: '#fff4c8',
              transform: 'rotate(-2deg)',
              fontFamily: '"Caveat", cursive',
            }}
          >
            <p className="text-lg leading-snug text-[#002D24]">
              Capture ideas →
              <br />
              Build lessons →
              <br />
              Plan the half-term
            </p>
          </div>

          <div
            className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-dashed border-[#002D24]/35 text-center"
            style={{ fontFamily: '"Caveat", cursive' }}
            aria-hidden
          >
            <span className="text-[0.7rem] leading-tight text-[#002D24]/80">
              Drama
              <br />
              Music
              <br />
              Dance
            </span>
          </div>

          {!compact && (
            <p
              className="ml-auto max-w-[10rem] text-right text-lg leading-tight text-[#5a726a]"
              style={{ fontFamily: '"Caveat", cursive' }}
            >
              Six half-terms at a glance
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function SubjectCard({
  subject,
  index,
  compact,
}: {
  subject: (typeof SUBJECTS)[number];
  index: number;
  compact: boolean;
}) {
  return (
    <div
      className="login-sketch-card rounded-sm border border-[#002D24]/12 bg-[#fffdf8]/80 px-3 py-2.5 backdrop-blur-[1px]"
      style={{ animationDelay: `${120 + index * 80}ms` }}
    >
      <div className="mb-1.5 flex items-center gap-2">
        <SubjectSketch kind={subject.title} />
        <h2
          className={`font-semibold uppercase tracking-wide text-[#002D24] ${compact ? 'text-xs' : 'text-sm'}`}
        >
          {index + 1}. {subject.title}
        </h2>
      </div>
      <ul className="space-y-0.5 text-[0.8rem] leading-snug text-[#3d5c54]">
        {subject.lines.map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>
    </div>
  );
}

function SubjectSketch({ kind }: { kind: string }) {
  if (kind === 'Drama') {
    return (
      <svg viewBox="0 0 40 28" className="h-6 w-8 text-[#002D24]" aria-hidden>
        <rect x="4" y="16" width="32" height="6" rx="1" fill="currentColor" opacity="0.15" />
        <circle cx="14" cy="10" r="3.5" fill="none" stroke="currentColor" strokeWidth="1.4" />
        <circle cx="26" cy="10" r="3.5" fill="none" stroke="currentColor" strokeWidth="1.4" />
        <path d="M8 22h24" stroke="currentColor" strokeWidth="1.2" opacity="0.5" />
      </svg>
    );
  }
  if (kind === 'Music') {
    return (
      <svg viewBox="0 0 40 28" className="h-6 w-8 text-[#002D24]" aria-hidden>
        <path d="M12 22V8l16-3v14" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="12" cy="22" r="3" fill="currentColor" />
        <circle cx="28" cy="19" r="3" fill="currentColor" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 40 28" className="h-6 w-8 text-[#002D24]" aria-hidden>
      <circle cx="12" cy="8" r="2.2" fill="currentColor" />
      <path d="M12 10c0 4 2 8 0 12M10 16h5" fill="none" stroke="currentColor" strokeWidth="1.3" />
      <circle cx="28" cy="9" r="2.2" fill="currentColor" />
      <path d="M28 11c-2 4 1 8 2 11M25 17h6" fill="none" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}

function SketchDecor({ compact }: { compact: boolean }) {
  return (
    <>
      <svg
        aria-hidden
        className={`pointer-events-none absolute text-[#002D24]/20 ${
          compact ? 'right-3 top-3 h-16 w-16' : 'right-6 top-5 h-24 w-24'
        }`}
        viewBox="0 0 80 80"
        fill="none"
      >
        <path
          d="M18 58c8-18 18-8 28-28s16-18 24-22"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
        <circle cx="22" cy="20" r="2" fill="currentColor" />
        <circle cx="58" cy="28" r="1.5" fill="currentColor" />
      </svg>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-[#002D24]/15 to-transparent lg:block"
      />
    </>
  );
}
