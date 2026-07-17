interface FeatureWalkthroughGraphicProps {
  onClick: () => void;
  className?: string;
}

/**
 * Sketchbook-style CTA — clear label so visitors know this opens a short
 * product tour, not another form action.
 */
export function FeatureWalkthroughGraphic({ onClick, className = '' }: FeatureWalkthroughGraphicProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative w-full max-w-[280px] text-left transition-transform duration-300 hover:-rotate-1 hover:scale-[1.02] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#002D24] ${className}`}
      aria-label="Watch the feature walkthrough — a short tour of how Creative Curriculum Designer works"
    >
      <span
        aria-hidden
        className="absolute -left-1 -top-1 h-3 w-3 rounded-full bg-[#f0d9a8] shadow-sm ring-1 ring-[#c4a574]/60"
      />
      <span
        className="block rounded-[2px] border border-[#d4b896] px-3.5 py-3 shadow-[2px_3px_0_rgba(0,45,36,0.08)] transition-shadow group-hover:shadow-[3px_5px_0_rgba(0,45,36,0.12)]"
        style={{
          backgroundColor: '#fff4c8',
          backgroundImage:
            'linear-gradient(135deg, rgba(255,255,255,0.55) 0%, transparent 45%), repeating-linear-gradient(0deg, transparent, transparent 27px, rgba(0,45,36,0.05) 28px)',
          transform: 'rotate(-1.5deg)',
          fontFamily: '"Caveat", cursive',
        }}
      >
        <span className="flex items-start gap-2.5">
          <span
            className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-[#002D24] bg-[#002D24] text-[#B6FF7E] transition-colors group-hover:bg-[#014033]"
            aria-hidden
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4 translate-x-0.5" fill="currentColor">
              <path d="M8 5.14v13.72L19 12 8 5.14z" />
            </svg>
          </span>
          <span className="min-w-0">
            <span className="block text-[1.35rem] leading-tight font-semibold text-[#002D24]">
              Watch the feature walkthrough
            </span>
            <span
              className="mt-0.5 block text-[0.95rem] leading-snug text-[#3d5c54]"
              style={{ fontFamily: '"Source Sans 3", system-ui, sans-serif' }}
            >
              Short tour of how CCD works — activities, lessons &amp; half-terms
            </span>
          </span>
        </span>
      </span>
    </button>
  );
}
