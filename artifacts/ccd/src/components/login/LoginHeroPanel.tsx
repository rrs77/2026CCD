interface LoginHeroPanelProps {
  compact?: boolean;
}

const SKETCHBOOK_IMG = `${import.meta.env.BASE_URL}login-sketchbook-v5.jpg`;

/**
 * Sketchbook visual matching the approved open-notebook mockup.
 * Fills the panel edge-to-edge (minimal empty desk margin).
 */
export function LoginHeroPanel({ compact = false }: LoginHeroPanelProps) {
  return (
    <div
      className={`relative w-full overflow-hidden bg-[#f3eadc] ${
        compact ? 'aspect-[5/4] min-h-[320px] sm:min-h-[380px]' : 'min-h-full lg:min-h-[calc(100vh-3rem)]'
      }`}
    >
      <img
        src={SKETCHBOOK_IMG}
        alt="Creative Curriculum Designer sketchbook with Drama, Music and Dance sketches. Outstanding lessons start with a connection."
        className="absolute inset-0 h-full w-full object-cover"
        style={{ objectPosition: compact ? '8% 8%' : '18% center' }}
        decoding="async"
      />
    </div>
  );
}
