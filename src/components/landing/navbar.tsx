"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";

const CAL_URL = process.env.NEXT_PUBLIC_CAL_URL ?? "#";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-[#0D061880] border-b border-[rgba(157,92,192,0.15)]">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-secondary tracking-tight">
          SYB
        </Link>

        {/* Desktop CTA */}
        <Link
          href={CAL_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden md:inline-flex items-center px-6 py-2.5 text-sm font-bold text-secondary border-[1.5px] border-secondary rounded-md transition-all duration-200 hover:bg-[#9D5CC020]"
        >
          Agendá tu llamada
        </Link>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden text-secondary p-2"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {mobileOpen && (
        <div className="md:hidden px-6 pb-4 border-t border-[rgba(157,92,192,0.15)]">
          <Link
            href={CAL_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setMobileOpen(false)}
            className="block w-full mt-3 text-center px-6 py-3 text-sm font-bold text-secondary border-[1.5px] border-secondary rounded-md transition-all duration-200 hover:bg-[#9D5CC020]"
          >
            Agendá tu llamada
          </Link>
        </div>
      )}
    </nav>
  );
}
