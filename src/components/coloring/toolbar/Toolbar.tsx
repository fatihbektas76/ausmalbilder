"use client";

import { useState, useRef, useEffect } from "react";
import type { Tool, DrawingTool, ShapeTool } from "../constants";
import { STAMPS } from "../constants";
import SizeSlider from "./SizeSlider";

// ---------------------------------------------------------------------------
// Toolbar — horizontal icon toolbar with dropdowns
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
  currentStampIndex: number;
  onNextStamp: () => void;
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
  { tool: "flower", label: "Blume" },
];

function ToolButton({
  active,
  onClick,
  children,
  label,
  disabled,
}: {
  active?: boolean;
  onClick: () => void;
  children: React.ReactNode;
  label: string;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
        active
          ? "bg-[#E8490F] text-white"
          : "bg-[#F7F6F2] text-[#1D1448] hover:bg-[#E8490F]/10"
      } disabled:cursor-not-allowed disabled:opacity-40`}
      aria-label={label}
      title={label}
    >
      {children}
    </button>
  );
}

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
  currentStampIndex,
  onNextStamp,
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

  return (
    <div className="mb-3 space-y-2">
      {/* Row 1: Tools */}
      <div className="flex flex-wrap items-center gap-1.5 rounded-lg bg-white p-2.5 shadow-sm">
        {/* Fill */}
        <ToolButton
          active={activeTool === "fill"}
          onClick={() => {
            onToolChange("fill");
            setOpenDropdown(null);
          }}
          label="Füllen"
        >
          {/* Paint bucket icon */}
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 18.75 7.5-7.5 7.5 7.5" />
            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 7.5-7.5 7.5 7.5" />
          </svg>
        </ToolButton>

        {/* Brush dropdown */}
        <div ref={brushDropRef} className="relative">
          <ToolButton
            active={isBrushActive}
            onClick={() => {
              if (openDropdown === "brush") {
                setOpenDropdown(null);
              } else {
                setOpenDropdown("brush");
                if (!isBrushActive) onToolChange("brush-round");
              }
            }}
            label={`Pinsel${activeBrush ? ` (${activeBrush.label})` : ""}`}
          >
            <span className="flex items-center gap-1">
              {/* Brush icon */}
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 0 0-5.78 1.128 2.25 2.25 0 0 1-2.4 2.245 4.5 4.5 0 0 0 8.4-2.245c0-.399-.078-.78-.22-1.128Zm0 0a15.998 15.998 0 0 0 3.388-1.62m-5.043-.025a15.994 15.994 0 0 1 1.622-3.395m3.42 3.42a15.995 15.995 0 0 0 4.764-4.648l3.876-5.814a1.151 1.151 0 0 0-1.597-1.597L14.146 6.32a15.996 15.996 0 0 0-4.649 4.763m3.42 3.42a6.776 6.776 0 0 0-3.42-3.42" />
              </svg>
              <svg className="h-3 w-3" fill="none" viewBox="0 0 12 12" stroke="currentColor" strokeWidth={2}>
                <path d="M3 5l3 3 3-3" />
              </svg>
            </span>
          </ToolButton>

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

        {/* Eraser */}
        <ToolButton
          active={activeTool === "eraser"}
          onClick={() => {
            onToolChange("eraser");
            setOpenDropdown(null);
          }}
          label="Radierer"
        >
          {/* Eraser icon */}
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M5.25 7.5l10.5-4.5 3 7.5-10.5 4.5-3-7.5z" />
          </svg>
        </ToolButton>

        <div className="mx-0.5 h-6 w-px bg-gray-200" />

        {/* Shapes dropdown */}
        <div ref={shapeDropRef} className="relative">
          <ToolButton
            active={isShapeActive}
            onClick={() => {
              if (openDropdown === "shape") {
                setOpenDropdown(null);
              } else {
                setOpenDropdown("shape");
                if (!isShapeActive) onToolChange("circle");
              }
            }}
            label={`Formen${activeShape ? ` (${activeShape.label})` : ""}`}
          >
            <span className="flex items-center gap-1">
              {/* Shape icon (rectangle + circle) */}
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <rect x="3" y="3" width="18" height="18" rx="2" />
              </svg>
              <svg className="h-3 w-3" fill="none" viewBox="0 0 12 12" stroke="currentColor" strokeWidth={2}>
                <path d="M3 5l3 3 3-3" />
              </svg>
            </span>
          </ToolButton>

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

        {/* Text */}
        <ToolButton
          active={activeTool === "text"}
          onClick={() => {
            onToolChange("text");
            setOpenDropdown(null);
          }}
          label="Text"
        >
          <span className="text-sm font-bold">T</span>
        </ToolButton>

        {/* Stamp */}
        <ToolButton
          active={activeTool === "stamp"}
          onClick={() => {
            onToolChange("stamp");
            setOpenDropdown(null);
          }}
          label={`Stempel (${STAMPS[currentStampIndex % STAMPS.length].label})`}
        >
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
            <path d={STAMPS[currentStampIndex % STAMPS.length].path} />
          </svg>
        </ToolButton>

        {activeTool === "stamp" && (
          <button
            onClick={onNextStamp}
            className="rounded-md bg-[#F7F6F2] px-2 py-2 text-xs font-medium text-[#1D1448] hover:bg-[#E8490F]/10"
            title="Nächster Stempel"
          >
            &rarr;
          </button>
        )}

        <div className="mx-0.5 h-6 w-px bg-gray-200" />

        {/* Undo */}
        <ToolButton active={false} onClick={onUndo} label="Rückgängig" disabled={!canUndo}>
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" />
          </svg>
        </ToolButton>

        {/* Redo */}
        <ToolButton active={false} onClick={onRedo} label="Wiederholen" disabled={!canRedo}>
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 15l6-6m0 0-6-6m6 6H9a6 6 0 0 0 0 12h3" />
          </svg>
        </ToolButton>

        {/* Reset */}
        <ToolButton active={false} onClick={onReset} label="Zurücksetzen">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182" />
          </svg>
        </ToolButton>

        <div className="mx-0.5 h-6 w-px bg-gray-200" />

        {/* Export */}
        <button
          onClick={onExport}
          className="rounded-md bg-[#1D1448] px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-[#1D1448]/90"
          title="Als PNG speichern"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
          </svg>
        </button>

        {/* Share */}
        {onShare && (
          <button
            onClick={onShare}
            className="rounded-md bg-[#E8490F] px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-[#E8490F]/90"
            title="Teilen"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" />
            </svg>
          </button>
        )}
      </div>

      {/* Row 2: Size slider (shown when a brush/eraser/shape tool is active) */}
      {activeTool !== "fill" && activeTool !== "text" && (
        <div className="rounded-lg bg-white p-2.5 shadow-sm">
          <SizeSlider brushSize={brushSize} onSizeChange={onSizeChange} />
        </div>
      )}
    </div>
  );
}
