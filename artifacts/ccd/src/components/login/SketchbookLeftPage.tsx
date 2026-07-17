/**
 * Left page of the open-notebook login.
 * Uses the approved sketchbook artwork (Drama / Music / Dance scenes,
 * sticky note, and stamp) so the page matches the original design.
 */
export function SketchbookLeftPage() {
  const artSrc = `${import.meta.env.BASE_URL}login-sketchbook-left-art.jpg`;

  return (
    <div className="login-book-page login-book-page--left relative flex h-full min-h-[28rem] flex-col overflow-hidden lg:min-h-0">
      <div className="pointer-events-none absolute inset-0 login-book-paper" aria-hidden />

      {/* Desktop: hand-lettered brand title above the original art */}
      <header className="relative z-10 hidden shrink-0 px-7 pb-1 pt-8 lg:block lg:px-9 lg:pt-9">
        <span className="mb-1 inline-block text-sm text-[#0a2a44]/40" aria-hidden>
          ✦
        </span>
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

      {/* Original sketchbook art — stage, music, dance, sticky, stamp */}
      <div className="relative z-10 flex flex-1 items-stretch justify-center px-2 pb-3 pt-3 sm:px-3 sm:pb-4 lg:px-4 lg:pb-5 lg:pt-2">
        <img
          src={artSrc}
          alt="Sketchbook page: Drama stage, Music notes, and Dance figures with lesson ideas."
          className="login-sketch-left-art h-full w-full object-contain object-top"
          decoding="async"
        />
      </div>
    </div>
  );
}
