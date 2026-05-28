"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Users } from "lucide-react";

const NAV_LINKS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/socios", label: "Socios", icon: Users, exact: false },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside
      style={{
        width: "220px",
        flexShrink: 0,
        backgroundColor: "var(--background-soft)",
        borderRight: "1px solid var(--hairline)",
        minHeight: "calc(100dvh - 56px)",
        position: "sticky",
        top: "56px",
        alignSelf: "flex-start",
        padding: "28px 0",
      }}
      className="hidden md:block"
    >
      <p
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "0.62rem",
          fontWeight: 500,
          color: "var(--foreground-subtle)",
          textTransform: "uppercase",
          letterSpacing: "0.2em",
          padding: "0 22px",
          margin: "0 0 12px 0",
        }}
      >
        Navegación
      </p>

      <nav>
        {NAV_LINKS.map(({ href, label, icon: Icon, exact }) => {
          const isActive = exact ? pathname === href : pathname.startsWith(href);

          return (
            <Link
              key={href}
              href={href}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "10px 22px",
                fontSize: "0.875rem",
                fontFamily: "var(--font-sans)",
                fontWeight: isActive ? 600 : 500,
                textDecoration: "none",
                borderLeft: isActive
                  ? "2px solid var(--foreground)"
                  : "2px solid transparent",
                color: isActive ? "var(--foreground)" : "var(--foreground-muted)",
                backgroundColor: isActive ? "var(--surface-2)" : "transparent",
                transition: "color 150ms ease, background 150ms ease",
              }}
            >
              <Icon size={15} strokeWidth={1.5} />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
