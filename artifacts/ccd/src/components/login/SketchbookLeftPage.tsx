/**
 * Left page of the sketchbook — approved mockup art (mobile stack / fallback).
 */
export function SketchbookLeftPage() {
  const artSrc = `${import.meta.env.BASE_URL}login-sketchbook-left.jpg`;

  return (
    <div className="relative flex min-h-[22rem] w-full items-center justify-center overflow-hidden bg-[#f3eadc] sm:min-h-[28rem]">
      <img
        src={artSrc}
        alt="Creative Curriculum Designer sketchbook: Drama, Music and Dance."
        className="h-auto w-full max-w-full object-contain object-top"
        decoding="async"
      />
    </div>
  );
}
