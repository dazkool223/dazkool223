import Magnetic from "@/components/Magnetic";

/** Resting state - the hover-follow motion can't be captured statically. */
export function Default() {
  return (
    <Magnetic>
      <a className="label-mono inline-flex items-center gap-3 border border-accent px-6 py-4 !text-ink transition-colors hover:bg-accent hover:!text-bg">
        hire me
        <span aria-hidden>→</span>
      </a>
    </Magnetic>
  );
}
