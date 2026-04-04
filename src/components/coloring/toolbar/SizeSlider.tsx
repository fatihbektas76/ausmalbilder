"use client";

import { BRUSH_PRESETS } from "../constants";

interface SizeSliderProps {
  brushSize: number;
  onSizeChange: (size: number) => void;
}

export default function SizeSlider({ brushSize, onSizeChange }: SizeSliderProps) {
  return (
    <div className="flex items-center gap-2">
      {/* Preset buttons */}
      {BRUSH_PRESETS.map((p) => (
        <button
          key={p.label}
          onClick={() => onSizeChange(p.size)}
          className={`flex h-8 w-8 items-center justify-center rounded-md text-xs font-semibold transition-colors ${
            brushSize === p.size
              ? "bg-[#1D1448] text-white"
              : "bg-[#F7F6F2] text-[#1D1448] hover:bg-[#1D1448]/10"
          }`}
          aria-label={`Pinselgröße ${p.label} (${p.size}px)`}
        >
          {p.shortLabel}
        </button>
      ))}

      {/* Slider */}
      <input
        type="range"
        min={1}
        max={60}
        value={brushSize}
        onChange={(e) => onSizeChange(Number(e.target.value))}
        className="h-1.5 w-20 cursor-pointer appearance-none rounded-full bg-gray-200 accent-[#E8490F]"
        aria-label="Pinselgröße"
      />

      {/* Size preview circle */}
      <div className="flex h-10 w-10 items-center justify-center">
        <div
          className="rounded-full bg-[#1D1448]"
          style={{
            width: Math.max(4, Math.min(brushSize, 40)),
            height: Math.max(4, Math.min(brushSize, 40)),
          }}
        />
      </div>

      <span className="text-xs text-gray-400">{brushSize}px</span>
    </div>
  );
}
