interface AdUnitProps {
  slot?: string;
  className?: string;
}

export default function AdUnit({ slot, className = "" }: AdUnitProps) {
  return (
    // Google AdSense wird nach Freischaltung hier eingefuegt.
    // Bis dahin dient dieser Block als visueller Platzhalter.
    <div
      className={`flex min-h-[90px] items-center justify-center rounded-lg bg-gray-200 ${className}`}
      data-ad-slot={slot}
      aria-hidden="true"
    >
      <span className="text-xs text-gray-400">Werbung</span>
    </div>
  );
}
