import { useEffect } from "react";
import ToolbenchPanel from "@/components/ToolbenchPanel";

export function Default() {
  return <ToolbenchPanel />;
}

/** Focusing a tool button (a real, statically-triggerable event) drives the same onFocus handler a visitor's tab/hover would - showing the inspector panel populated. */
export function WithSelection() {
  useEffect(() => {
    document
      .querySelector<HTMLButtonElement>('[data-ds-story="toolbench-selection"] button')
      ?.focus();
  }, []);
  return (
    <div data-ds-story="toolbench-selection">
      <ToolbenchPanel />
    </div>
  );
}
