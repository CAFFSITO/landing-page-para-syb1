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
        width: "240px",
        flexShrink: 0,
        backgroundColor: "#120825",
        borderRight: "1px solid rgba(157,92,192,0.15)",
        height: "calc(100vh - 56px)",
        position: "sticky",
        top: "56px",
        overflowY: "auto",
        padding: "24px 0",
      }}
      className="hidden md:block"
    >
      <p
        style={{
          fontSize: "0.65rem",
          color: "rgba(157,92,192,0.5)",
          textTransform: "uppercase",
          letterSpacing: "0.12em",
          padding: "0 20px",
          marginBottom: "8px",
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
                gap: "10px",
                padding: "10px 20px",
                fontSize: "0.875rem",
                fontFamily: "inherit",
                textDecoration: "none",
                borderLeft: isActive
                  ? "3px solid #9D5CC0"
                  : "3px solid transparent",
                color: isActive ? "#9D5CC0" : "rgba(255,255,255,0.6)",
                backgroundColor: isActive
                  ? "rgba(157,92,192,0.08)"
                  : "transparent",
                transition: "color 150ms ease, background 150ms ease",
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.color = "#FFFFFF";
                  e.currentTarget.style.background = "rgba(157,92,192,0.05)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.color = "rgba(255,255,255,0.6)";
                  e.currentTarget.style.background = "transparent";
                }
              }}
            >
              <Icon size={16} />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
