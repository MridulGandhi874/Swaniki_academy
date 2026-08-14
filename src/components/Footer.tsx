import Link from "next/link";
import Logo from "@/components/Logo";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "Trainee Program", href: "/courses" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "My Profile", href: "/dashboard/my-profile" },
];

const resourceLinks = [
  { label: "Enrolled Courses", href: "/dashboard/enrolled-courses" },
  { label: "Certificates", href: "/dashboard/certificates" },
];

export default function Footer() {
  return (
    <footer className="mt-auto bg-[#111422] text-gray-300">
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-4">
          <div>
            <Logo size={28} textClassName="text-white" />
            <p className="mt-3 max-w-xs text-sm text-gray-400">
              Train like a professional. Build like an intern. A trainee program built for
              hands-on, real-world learning.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-white">
              Quick Links
            </h3>
            <ul className="mt-4 space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 transition hover:text-blue-400"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-white">
              Resources
            </h3>
            <ul className="mt-4 space-y-2">
              {resourceLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 transition hover:text-blue-400"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-white">
              Contact
            </h3>
            <p className="mt-4 text-sm text-gray-400">support@swaniki.academy</p>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-6 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} Swaniki Academy. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
