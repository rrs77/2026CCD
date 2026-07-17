import { PROTOTYPE_NOTICE } from './prototypeCopy';

/**
 * Full-width notice bar — sits above login/landing content without overlapping it.
 */
export function PrototypeNoticeBar() {
  return (
    <div
      role="status"
      className="flex w-full shrink-0 items-center justify-center px-3 py-2 sm:px-4 sm:py-2.5"
      style={{
        backgroundColor: 'rgba(0, 45, 36, 0.92)',
        backdropFilter: 'blur(6px)',
      }}
    >
      <p className="max-w-5xl text-center text-[0.7rem] font-medium leading-snug text-white sm:text-xs sm:leading-relaxed">
        {PROTOTYPE_NOTICE}
      </p>
    </div>
  );
}
