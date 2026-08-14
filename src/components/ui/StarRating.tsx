interface StarRatingProps {
  rating: number;
  size?: number;
  className?: string;
}

function Star({ fill, size }: { fill: number; size: number }) {
  const id = `star-clip-${Math.round(fill * 1000)}-${size}`;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <defs>
        <clipPath id={id}>
          <rect x="0" y="0" width={24 * fill} height="24" />
        </clipPath>
      </defs>
      <path
        d="M12 2.5l2.9 6.06 6.6.85-4.86 4.6 1.28 6.55L12 17.4l-5.92 3.16 1.28-6.55-4.86-4.6 6.6-.85z"
        fill="none"
        stroke="#d1d5db"
        strokeWidth="1"
      />
      <path
        d="M12 2.5l2.9 6.06 6.6.85-4.86 4.6 1.28 6.55L12 17.4l-5.92 3.16 1.28-6.55-4.86-4.6 6.6-.85z"
        fill="#f59e0b"
        clipPath={`url(#${id})`}
      />
    </svg>
  );
}

export default function StarRating({ rating, size = 16, className = "" }: StarRatingProps) {
  const clamped = Math.min(5, Math.max(0, rating));

  return (
    <div className={`flex items-center gap-0.5 ${className}`} aria-label={`${clamped} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => {
        const fill = Math.min(1, Math.max(0, clamped - i));
        return <Star key={i} fill={fill} size={size} />;
      })}
    </div>
  );
}
