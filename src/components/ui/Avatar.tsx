interface AvatarProps {
  name: string;
  photoURL?: string;
  size?: number;
  className?: string;
}

function getInitials(name: string) {
  const source = name?.trim() || "";
  if (!source) return "?";
  const parts = source.split(" ").filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return source.slice(0, 2).toUpperCase();
}

export default function Avatar({ name, photoURL, size = 40, className = "" }: AvatarProps) {
  const style = { width: size, height: size };

  if (photoURL) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={photoURL}
        alt={name}
        style={style}
        className={`rounded-full object-cover ${className}`}
      />
    );
  }

  return (
    <div
      style={{ ...style, fontSize: size * 0.4 }}
      className={`flex items-center justify-center rounded-full bg-blue-600 font-semibold text-white ${className}`}
    >
      {getInitials(name)}
    </div>
  );
}
