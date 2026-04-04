"use client";

import { COLOR_PALETTE } from "../constants";

interface ColorPaletteProps {
  activeColor: string;
  recentColors: string[];
  onColorChange: (color: string) => void;
}

export default function ColorPalette({
  activeColor,
  recentColors,
  onColorChange,
}: ColorPaletteProps) {
  return (
    <div className="flex flex-wrap items-center gap-1.5 rounded-lg bg-white p-3 shadow-sm">
      {/* Recent colors */}
      {recentColors.length > 0 && (
        <>
          <span className="mr-1 text-[10px] font-medium text-gray-400">Zuletzt</span>
          {recentColors.map((color, i) => (
            <button
              key={`recent-${i}`}
              onClick={() => onColorChange(color)}
              className="h-6 w-6 rounded-full border transition-transform hover:scale-110"
              style={{
                backgroundColor: color,
                borderColor: color === "#FFFFFF" ? "#D1D5DB" : color,
                outline: activeColor === color ? "2px solid #E8490F" : "none",
                outlineOffset: "2px",
              }}
              aria-label={`Zuletzt verwendet: ${color}`}
            />
          ))}
          <div className="mx-1.5 h-5 w-px bg-gray-200" />
        </>
      )}

      {/* Palette groups */}
      {COLOR_PALETTE.map((group) =>
        group.colors.map((color) => (
          <button
            key={color}
            onClick={() => onColorChange(color)}
            className="h-7 w-7 rounded-full border transition-transform hover:scale-110"
            style={{
              backgroundColor: color,
              borderColor: color === "#FFFFFF" ? "#D1D5DB" : color,
              outline: activeColor === color ? "2px solid #E8490F" : "none",
              outlineOffset: "2px",
            }}
            aria-label={`Farbe ${color}`}
          />
        ))
      )}

      {/* Custom color picker */}
      <label className="relative flex h-7 w-7 cursor-pointer items-center justify-center overflow-hidden rounded-full border border-dashed border-gray-400">
        <input
          type="color"
          value={activeColor}
          onChange={(e) => onColorChange(e.target.value)}
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
        />
        <span className="text-xs font-bold text-gray-500">+</span>
      </label>

      {/* Active color preview */}
      <div className="ml-2 flex items-center gap-1.5">
        <div
          className="h-5 w-5 rounded border border-gray-300"
          style={{ backgroundColor: activeColor }}
        />
        <span className="text-[10px] text-gray-400">{activeColor}</span>
      </div>
    </div>
  );
}
