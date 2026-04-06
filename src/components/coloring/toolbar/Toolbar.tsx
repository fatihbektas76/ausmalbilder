"use client";

import { useState, useRef, useEffect } from "react";
import type { Tool, DrawingTool, ShapeTool } from "../constants";
import SizeSlider from "./SizeSlider";

// ---------------------------------------------------------------------------
// Toolbar v3 — horizontal icon+label toolbar with dropdowns
// ---------------------------------------------------------------------------

interface ToolbarProps {
  activeTool: Tool;
  onToolChange: (tool: Tool) => void;
  brushSize: number;
  onSizeChange: (size: number) => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onReset: () => void;
  onExport: () => void;
  onShare?: () => void;
}

type DropdownType = "brush" | "shape" | null;

const brushTools: { tool: DrawingTool; label: string; icon: string }[] = [
  { tool: "brush-round", label: "Rund", icon: "M" },
  { tool: "brush-flat", label: "Flach", icon: "F" },
  { tool: "pencil", label: "Bleistift", icon: "B" },
  { tool: "marker", label: "Marker", icon: "K" },
];

const shapeTools: { tool: ShapeTool; label: string }[] = [
  { tool: "circle", label: "Kreis" },
  { tool: "rect", label: "Rechteck" },
  { tool: "star", label: "Stern" },
  { tool: "heart", label: "Herz" },
  { tool: "triangle", label: "Dreieck" },
];

// ---------------------------------------------------------------------------
// ToolButton — icon on top, small label below
// ---------------------------------------------------------------------------

function ToolButton({
  active,
  onClick,
  icon,
  label,
  disabled,
}: {
  active?: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex flex-col items-center gap-0.5 rounded-md px-2 py-1.5 transition-colors ${
        active
          ? "bg-[#E8490F] text-white"
          : "bg-[#F7F6F2] text-[#1D1448] hover:bg-[#E8490F]/10"
      } disabled:cursor-not-allowed disabled:opacity-40`}
      aria-label={label}
      title={label}
    >
      {icon}
      <span className="text-[10px] leading-tight">{label}</span>
    </button>
  );
}

// ---------------------------------------------------------------------------
// SVG Icons
// ---------------------------------------------------------------------------

const FillIcon = (
  <svg
    className="h-5 w-5"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M19 11.5s-2 2.17-2 3.5a2 2 0 1 0 4 0c0-1.33-2-3.5-2-3.5Z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m2.7 10.3 8.6 8.6a1 1 0 0 0 1.4 0l5.6-5.6a1 1 0 0 0 0-1.4L9.7 3.3a1 1 0 0 0-1.4 0L2.7 8.9a1 1 0 0 0 0 1.4Z"
    />
    <path strokeLinecap="round" strokeLinejoin="round" d="m2 17 6-6" />
  </svg>
);

const BrushIcon = (
  <svg
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9.53 16.122a3 3 0 0 0-5.78 1.128 2.25 2.25 0 0 1-2.4 2.245 4.5 4.5 0 0 0 8.4-2.245c0-.399-.078-.78-.22-1.128Zm0 0a15.998 15.998 0 0 0 3.388-1.62m-5.043-.025a15.994 15.994 0 0 1 1.622-3.395m3.42 3.42a15.995 15.995 0 0 0 4.764-4.648l3.876-5.814a1.151 1.151 0 0 0-1.597-1.597L14.146 6.32a15.996 15.996 0 0 0-4.649 4.763m3.42 3.42a6.776 6.776 0 0 0-3.42-3.42"
    />
  </svg>
);

const EraserIcon = (
  <svg
    className="h-5 w-5"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m16.24 3.56 4.95 4.94c.78.78.78 2.05 0 2.83L12 20.53a4 4 0 0 1-2.83 1.17H4l-.71-.71L9.54 14.75"
    />
    <path strokeLinecap="round" strokeLinejoin="round" d="m4 21 5-5" />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m14.5 5.32 4.95 4.94"
    />
  </svg>
);

const ShapesIcon = (
  <svg
    className="h-5 w-5"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
  >
    <rect
      x="3"
      y="3"
      width="10"
      height="10"
      rx="1"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle
      cx="17"
      cy="17"
      r="5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const UndoIcon = (
  <svg
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3"
    />
  </svg>
);

const RedoIcon = (
  <svg
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15 15l6-6m0 0-6-6m6 6H9a6 6 0 0 0 0 12h3"
    />
  </svg>
);

const ResetIcon = (
  <svg
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182"
    />
  </svg>
);

const DownloadIcon = (
  <svg
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
    />
  </svg>
);

const ShareIcon = (
  <svg
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z"
    />
  </svg>
);

const ChevronDownIcon = (
  <svg
    className="h-3 w-3"
    fill="none"
    viewBox="0 0 12 12"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path d="M3 5l3 3 3-3" />
  </svg>
);

// ---------------------------------------------------------------------------
// Main Toolbar component
// ---------------------------------------------------------------------------

export default function Toolbar({
  activeTool,
  onToolChange,
  brushSize,
  onSizeChange,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onReset,
  onExport,
  onShare,
}: ToolbarProps) {
  const [openDropdown, setOpenDropdown] = useState<DropdownType>(null);
  const brushDropRef = useRef<HTMLDivElement>(null);
  const shapeDropRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        brushDropRef.current &&
        !brushDropRef.current.contains(e.target as Node) &&
        shapeDropRef.current &&
        !shapeDropRef.current.contains(e.target as Node)
      ) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isBrushActive = brushTools.some((b) => b.tool === activeTool);
  const isShapeActive = shapeTools.some((s) => s.tool === activeTool);
  const activeBrush = brushTools.find((b) => b.tool === activeTool);
  const activeShape = shapeTools.find((s) => s.tool === activeTool);

  // Show size slider for everything except fill
  const showSizeSlider = activeTool !== "fill";

  return (
    <div className="mb-3 space-y-2">
      {/* Row 1: Tools */}
      <div className="flex flex-wrap items-center gap-1.5 rounded-lg bg-white p-2.5 shadow-sm">
        {/* ---- Drawing tools ---- */}

        {/* Farbeimer (Fill) */}
        <ToolButton
          active={activeTool === "fill"}
          onClick={() => {
            onToolChange("fill");
            setOpenDropdown(null);
          }}
          icon={FillIcon}
          label="Farbeimer"
        />

        {/* Pinsel (Brush dropdown) */}
        <div ref={brushDropRef} className="relative">
          <button
            onClick={() => {
              if (openDropdown === "brush") {
                setOpenDropdown(null);
              } else {
                setOpenDropdown("brush");
                if (!isBrushActive) onToolChange("brush-round");
              }
            }}
            className={`flex flex-col items-center gap-0.5 rounded-md px-2 py-1.5 transition-colors ${
              isBrushActive
                ? "bg-[#E8490F] text-white"
                : "bg-[#F7F6F2] text-[#1D1448] hover:bg-[#E8490F]/10"
            }`}
            aria-label={`Pinsel${activeBrush ? ` (${activeBrush.label})` : ""}`}
            title={`Pinsel${activeBrush ? ` (${activeBrush.label})` : ""}`}
          >
            <span className="flex items-center gap-0.5">
              {BrushIcon}
              {ChevronDownIcon}
            </span>
            <span className="text-[10px] leading-tight">Pinsel</span>
          </button>

          {openDropdown === "brush" && (
            <div className="absolute left-0 top-full z-50 mt-1 rounded-lg border border-gray-200 bg-white p-1 shadow-lg">
              {brushTools.map((b) => (
                <button
                  key={b.tool}
                  onClick={() => {
                    onToolChange(b.tool);
                    setOpenDropdown(null);
                  }}
                  className={`flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-sm ${
                    activeTool === b.tool
                      ? "bg-[#E8490F]/10 font-semibold text-[#E8490F]"
                      : "text-[#1D1448] hover:bg-gray-100"
                  }`}
                >
                  <span className="inline-flex h-5 w-5 items-center justify-center rounded bg-gray-100 text-xs font-bold">
                    {b.icon}
                  </span>
                  {b.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Radierer (Eraser) */}
        <ToolButton
          active={activeTool === "eraser"}
          onClick={() => {
            onToolChange("eraser");
            setOpenDropdown(null);
          }}
          icon={EraserIcon}
          label="Radierer"
        />

        {/* Formen (Shapes dropdown) */}
        <div ref={shapeDropRef} className="relative">
          <button
            onClick={() => {
              if (openDropdown === "shape") {
                setOpenDropdown(null);
              } else {
                setOpenDropdown("shape");
                if (!isShapeActive) onToolChange("circle");
              }
            }}
            className={`flex flex-col items-center gap-0.5 rounded-md px-2 py-1.5 transition-colors ${
              isShapeActive
                ? "bg-[#E8490F] text-white"
                : "bg-[#F7F6F2] text-[#1D1448] hover:bg-[#E8490F]/10"
            }`}
            aria-label={`Formen${activeShape ? ` (${activeShape.label})` : ""}`}
            title={`Formen${activeShape ? ` (${activeShape.label})` : ""}`}
          >
            <span className="flex items-center gap-0.5">
              {ShapesIcon}
              {ChevronDownIcon}
            </span>
            <span className="text-[10px] leading-tight">Formen</span>
          </button>

          {openDropdown === "shape" && (
            <div className="absolute left-0 top-full z-50 mt-1 rounded-lg border border-gray-200 bg-white p-1 shadow-lg">
              {shapeTools.map((s) => (
                <button
                  key={s.tool}
                  onClick={() => {
                    onToolChange(s.tool);
                    setOpenDropdown(null);
                  }}
                  className={`flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-sm whitespace-nowrap ${
                    activeTool === s.tool
                      ? "bg-[#E8490F]/10 font-semibold text-[#E8490F]"
                      : "text-[#1D1448] hover:bg-gray-100"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ---- Separator ---- */}
        <div className="mx-0.5 h-6 w-px bg-gray-200" />

        {/* ---- History controls ---- */}

        {/* Undo */}
        <ToolButton
          active={false}
          onClick={onUndo}
          icon={UndoIcon}
          label="Undo"
          disabled={!canUndo}
        />

        {/* Redo */}
        <ToolButton
          active={false}
          onClick={onRedo}
          icon={RedoIcon}
          label="Redo"
          disabled={!canRedo}
        />

        {/* Reset */}
        <ToolButton
          active={false}
          onClick={onReset}
          icon={ResetIcon}
          label="Reset"
        />

        {/* ---- Separator ---- */}
        <div className="mx-0.5 h-6 w-px bg-gray-200" />

        {/* ---- Export / Share ---- */}

        {/* Download */}
        <button
          onClick={onExport}
          className="flex flex-col items-center gap-0.5 rounded-md bg-[#1D1448] px-2 py-1.5 text-white transition-colors hover:bg-[#1D1448]/90"
          title="Als PNG speichern"
          aria-label="Download"
        >
          {DownloadIcon}
          <span className="text-[10px] leading-tight">Download</span>
        </button>

        {/* Teilen */}
        {onShare && (
          <button
            onClick={onShare}
            className="flex flex-col items-center gap-0.5 rounded-md bg-[#E8490F] px-2 py-1.5 text-white transition-colors hover:bg-[#E8490F]/90"
            title="Teilen"
            aria-label="Teilen"
          >
            {ShareIcon}
            <span className="text-[10px] leading-tight">Teilen</span>
          </button>
        )}
      </div>

      {/* Row 2: Size slider (shown for all tools except fill) */}
      {showSizeSlider && (
        <div className="rounded-lg bg-white p-2.5 shadow-sm">
          <SizeSlider brushSize={brushSize} onSizeChange={onSizeChange} />
        </div>
      )}
    </div>
  );
}
