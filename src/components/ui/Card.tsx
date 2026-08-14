import type { HTMLAttributes, ReactNode } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  padded?: boolean;
}

export default function Card({ children, className = "", padded = true, ...rest }: CardProps) {
  return (
    <div
      className={`rounded-2xl border border-gray-100 bg-white shadow-sm ${
        padded ? "p-6" : ""
      } ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}
