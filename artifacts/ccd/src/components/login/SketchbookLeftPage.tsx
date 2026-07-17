/**
 * Left page of the open-notebook login — the approved sketchbook mockup.
 * Shows the original Drama / Music / Dance artwork, sticky note, and stamp.
 */
export function SketchbookLeftPage() {
  const artSrc = `${import.meta.env.BASE_URL}login-sketchbook-left.jpg`;

  return (
    <div className="login-book-page login-book-page--left relative flex h-full min-h-[32rem] flex-col overflow-hidden bg-[#f3eadc] lg:min-h-0">
      <img
        src={artSrc}
        alt="Creative Curriculum Designer sketchbook: Drama, Music and Dance."
        className="absolute inset-0 h-full w-full object-cover object-top"
        decoding="async"
      />
      {/* Soft fade at bottom on very tall screens so the page edge feels natural */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-[#f3eadc]/40 to-transparent lg:hidden"
      />
    </div>
  );
}
