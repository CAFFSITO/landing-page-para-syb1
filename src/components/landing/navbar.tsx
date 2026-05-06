"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import logoSYB from "@/app/SYB RECUPERADO.png";

const CAL_URL = process.env.NEXT_PUBLIC_CAL_URL ?? "#";

const navLinks = [
  { label: "El problema", href: "#problema" },
  { label: "Metodología", href: "#metodologia" },
  { label: "Pilares", href: "#pilares" },
  { label: "Garantía", href: "#garantia" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 80, damping: 18 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
        ? "backdrop-blur-xl bg-[#0D0618]/85 border-b border-[rgba(157,92,192,0.2)] shadow-[0_4px_32px_rgba(0,0,0,0.5)]"
        : "bg-transparent border-b border-transparent"
        }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src={logoSYB}
            alt="Scale Your Business"
            height={48}
            className="w-auto object-contain"
            priority
          />
        </Link>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-contrast/55 hover:text-contrast transition-colors duration-200"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Desktop CTA */}
        <Link
          href={CAL_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden md:inline-flex items-center px-5 py-2 text-sm font-bold text-secondary border-[1.5px] border-secondary rounded-md transition-all duration-200 hover:bg-secondary/10 active:scale-[0.97]"
        >
          Agendá la llamada
        </Link>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden text-secondary p-2"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ type: "spring", stiffness: 120, damping: 22 }}
            className="md:hidden overflow-hidden bg-[#0D0618]/95 backdrop-blur-xl border-t border-[rgba(157,92,192,0.15)]"
          >
            <div className="px-6 py-4 flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-sm text-contrast/70 hover:text-contrast transition-colors"
                >
                  {link.label}
                </a>
              ))}
              <Link
                href={CAL_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileOpen(false)}
                className="mt-2 w-full text-center px-5 py-3 text-sm font-bold text-secondary border-[1.5px] border-secondary rounded-md hover:bg-secondary/10 transition-all duration-200"
              >
                Agendá la llamada
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
