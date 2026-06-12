"use client";

import { useState } from "react";
import Reveal from "@/components/Reveal";
import { toolbench, toolGroups, type Tool } from "@/lib/data";

/**
 * The tool wall, embedded inside the experiments section. Hover (or tap)
 * any tool and the inspector panel reads out its metadata, like hovering
 * a node in devtools.
 */
export default function ToolbenchPanel() {
  const [selected, setSelected] = useState<Tool | null>(null);

  return (
    <div className="grid gap-10 md:grid-cols-12 md:gap-12">
      <div className="md:col-span-8">
        {toolGroups.map((group, gi) => (
          <Reveal key={group.id} delay={gi * 0.05} className="mb-8">
            <p className="label-mono mb-4">{group.label}</p>
            <div className="flex flex-wrap gap-2.5">
              {toolbench
                .filter((t) => t.group === group.id)
                .map((tool) => (
                  <button
                    key={tool.name}
                    type="button"
                    onMouseEnter={() => setSelected(tool)}
                    onFocus={() => setSelected(tool)}
                    onClick={() => setSelected(tool)}
                    className={`border px-3.5 py-2 font-mono text-sm transition-all duration-300 ${
                      selected?.name === tool.name
                        ? "border-accent bg-accent-dim text-ink"
                        : "border-line text-muted hover:border-accent/50 hover:text-ink"
                    }`}
                  >
                    {tool.name}
                  </button>
                ))}
            </div>
          </Reveal>
        ))}
      </div>

      <div className="md:col-span-4">
        <Reveal delay={0.15}>
          <div className="fig-frame sticky top-24 bg-surface/70 p-6 font-mono text-sm">
            <p className="label-mono mb-5 text-accent">// inspector</p>
            {selected ? (
              <dl className="flex flex-col gap-3">
                <div>
                  <dt className="text-faint">name</dt>
                  <dd className="text-lg text-ink">{selected.name}</dd>
                </div>
                <div>
                  <dt className="text-faint">group</dt>
                  <dd className="text-ink">{selected.group}</dd>
                </div>
                <div>
                  <dt className="text-faint">field note</dt>
                  <dd className="leading-relaxed text-muted">
                    “{selected.note}”
                  </dd>
                </div>
              </dl>
            ) : (
              <p className="leading-relaxed text-faint">
                hover or tap a tool on the bench to inspect it.
                <span className="caret" />
              </p>
            )}
          </div>
        </Reveal>
      </div>
    </div>
  );
}
