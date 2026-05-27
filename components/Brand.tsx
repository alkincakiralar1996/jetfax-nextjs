export function PaperPlane({
  className,
  motion: showMotion = true,
}: {
  className?: string;
  motion?: boolean;
}) {
  return (
    <svg viewBox="0 0 240 240" className={className}>
      <g transform="rotate(-22 120 120)">
        {showMotion ? (
          <g stroke="#FFB020" strokeWidth="11" strokeLinecap="round">
            <line x1="40" y1="155" x2="105" y2="155" />
            <line x1="55" y1="135" x2="100" y2="135" opacity="0.9" />
            <line x1="68" y1="175" x2="98" y2="175" opacity="0.75" />
          </g>
        ) : null}
        <g fill="#0F3D2E">
          <path d="M120 60 L205 90 L130 135 Z" />
          <path d="M120 60 L130 135 L102 165 Z" opacity="0.88" />
          <path d="M102 165 L130 135 L205 90 L155 175 Z" opacity="0.78" />
        </g>
      </g>
    </svg>
  );
}

export function PaperPlaneWhite({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 240 240" className={className}>
      <g transform="rotate(-22 120 120)">
        <g stroke="#FFB020" strokeWidth="11" strokeLinecap="round">
          <line x1="40" y1="155" x2="105" y2="155" />
          <line x1="55" y1="135" x2="100" y2="135" opacity="0.9" />
          <line x1="68" y1="175" x2="98" y2="175" opacity="0.75" />
        </g>
        <g fill="#FFFFFF">
          <path d="M120 60 L205 90 L130 135 Z" />
          <path d="M120 60 L130 135 L102 165 Z" opacity="0.88" />
          <path d="M102 165 L130 135 L205 90 L155 175 Z" opacity="0.78" />
        </g>
      </g>
    </svg>
  );
}

export function AppleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M16.365 1.43c0 1.14-.493 2.27-1.177 3.08-.78.93-2.075 1.65-3.05 1.65-.107 0-.214-.015-.235-.022-.013-.06-.044-.244-.044-.45 0-1.13.583-2.21 1.196-2.92.738-.83 1.99-1.49 3.02-1.55.043.18.29.21.29.21zM21 17.1c-.6 1.34-.876 1.94-1.65 3.12-1.083 1.66-2.61 3.74-4.5 3.76-1.67.02-2.1-1.08-4.36-1.07-2.27.01-2.74 1.09-4.41 1.07-1.89-.02-3.34-1.9-4.43-3.56C.95 18.34.1 14.6 1.45 12.07c.95-1.78 2.45-2.91 4.05-2.93 1.63-.03 3.17 1.1 4.18 1.1 1.01 0 2.88-1.36 4.86-1.16.83.04 3.14.34 4.63 2.5-4.06 2.22-3.4 8.05.83 9.52z" />
    </svg>
  );
}

export function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
