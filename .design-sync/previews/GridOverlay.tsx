import { useEffect } from "react";
import GridOverlay from "@/components/GridOverlay";

/**
 * Hidden by default until the visitor presses "g" - no prop exists to force
 * it open, so this story dispatches the real keydown the component listens
 * for (the same interaction a visitor performs, just automated).
 */
export function Visible() {
  useEffect(() => {
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "g" }));
  }, []);
  return (
    <div style={{ position: "relative", height: 500, background: "var(--bg)" }}>
      <GridOverlay />
    </div>
  );
}
