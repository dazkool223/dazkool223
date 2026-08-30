import FieldNotesStrip from "@/components/FieldNotesStrip";

/** No props - pulls its real field notes from lib/data. The horizontal-pin scroll effect only engages on real page scroll at >=768px; below that (and in this card) it renders as a plain swipeable strip. */
export function Default() {
  return <FieldNotesStrip />;
}
