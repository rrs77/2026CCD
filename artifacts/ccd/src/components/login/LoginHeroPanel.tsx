interface LoginHeroPanelProps {
  compact?: boolean;
}

export const SKETCHBOOK_IMG = `${import.meta.env.BASE_URL}login-sketchbook-v6.jpg`;

/**
 * Full-bleed sketchbook page art (used when a separate hero panel is needed).
 * The main login screen now paints the book across the whole viewport.
 */
export function LoginHeroPanel({ compact = false }: LoginHeroPanelProps) {
  return (
    <div
      className={`relative w-full overflow-hidden bg-[#f3eadc] ${
        compact ? 'min-h-[40vh]' : 'min-h-full'
      }`}
    >
      <img
        src={SKETCHBOOK_IMG}
        alt="Creative Curriculum Designer sketchbook with Drama, Music and Dance sketches."
        className="absolute inset-0 h-full w-full object-cover"
        style={{ objectPosition: compact ? '12% 10%' : 'center center' }}
        decoding="async"
      />
    </div>
  );
}
