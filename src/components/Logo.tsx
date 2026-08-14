interface LogoProps {
  size?: number;
  showText?: boolean;
  textClassName?: string;
  className?: string;
}

export default function Logo({
  size = 32,
  showText = true,
  textClassName = "text-gray-900",
  className = "",
}: LogoProps) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <span
        className="flex shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-[var(--color-soft-periwinkle)]"
        style={{ width: size, height: size }}
      >
        <svg
          width={size * 0.58}
          height={size * 0.58}
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 3L2 8l10 5 10-5-10-5z" />
          <path d="M6 10v5c0 1.7 2.7 3 6 3s6-1.3 6-3v-5" />
          <path d="M22 8v5" />
        </svg>
      </span>
      {showText && (
        <span className={`whitespace-nowrap text-sm font-bold sm:text-base ${textClassName}`}>
          Swaniki Academy
        </span>
      )}
    </span>
  );
}
