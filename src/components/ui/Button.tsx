import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "outline" | "ghost" | "dark";
type Size = "sm" | "md" | "lg";

const variantClasses: Record<Variant, string> = {
  primary: "bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-300",
  outline:
    "border border-blue-600 text-blue-600 bg-white hover:bg-blue-50 disabled:border-gray-300 disabled:text-gray-400",
  ghost: "text-gray-700 hover:bg-gray-100 disabled:text-gray-400",
  dark: "bg-gray-900 text-white hover:bg-gray-800 disabled:bg-gray-400",
};

const sizeClasses: Record<Size, string> = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-5 py-2.5 text-sm",
  lg: "px-7 py-3.5 text-base",
};

interface CommonProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
}

type ButtonProps = CommonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: undefined;
  };

interface LinkProps extends CommonProps {
  href: string;
  target?: string;
}

export default function Button(props: ButtonProps | LinkProps) {
  const { variant = "primary", size = "md", className = "", children } = props;
  const base =
    "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition disabled:cursor-not-allowed";
  const classes = `${base} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  if ("href" in props && props.href) {
    return (
      <Link href={props.href} target={props.target} className={classes}>
        {children}
      </Link>
    );
  }

  const { variant: _v, size: _s, className: _c, href: _h, ...rest } = props as ButtonProps;
  void _v;
  void _s;
  void _c;
  void _h;

  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
}
