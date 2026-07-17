interface LoginHeroPanelProps {
  logoLetters?: string;
  compact?: boolean;
}

const SKETCHBOOK_IMG = `${import.meta.env.BASE_URL}login-sketchbook-reference.jpg`;

/**
 * Sketchbook visual from the approved mockup.
 * On iPhone this sits below the login form; on desktop it is the left page.
 */
export function LoginHeroPanel({ compact = false }: LoginHeroPanelProps) {
  return (
    <div
      className={`relative w-full overflow-hidden bg-[#f3eadc] ${
        compact ? 'min-h-[420px] sm:min-h-[480px]' : 'min-h-[560px] min-h-full'
      }`}
    >
      <img
        src={SKETCHBOOK_IMG}
        alt="Creative Curriculum Designer sketchbook. Outstanding lessons start with a connection. Drama, Music and Dance from EYFS to KS5 — Activity Library, Lesson Builder, Units of work."
        className="absolute inset-0 h-full w-full object-cover"
        style={{ objectPosition: compact ? '12% top' : '20% center' }}
        decoding="async"
      />
      {!compact && (
        <div
          className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-[#f3eadc]/85 to-transparent"
          aria-hidden
        />
      )}
      {compact && (
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#f3eadc]/70 to-transparent"
          aria-hidden
        />
      )}
    </div>
  );
}
