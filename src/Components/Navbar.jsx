import React, { useState } from "react";
import { motion } from "framer-motion";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { href: "#layanan", label: "SERVICES" },
    { href: "#digital", label: "PLATFORM" }, // Mengganti Dashboard sementara
    { href: "#tentang", label: "SOLUTIONS" }, // Mengganti Tentang sementara
    { href: "#visimisi", label: "COMPANY" },
  ];

  return (
    <header className="vanta-glass fixed top-0 left-0 w-full z-50 shadow-lg">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex-shrink-0">
          <a href="#beranda" className="flex items-center space-x-2">
            {/* Placeholder Logo Glyph Violet Futuristik */}
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-violet-950/50 border border-violet-500/30">
              <span className="text-violet-400 font-extrabold text-xl">A</span>
            </div>
            <span className="text-2xl font-extrabold tracking-tight uppercase text-slate-100">
              AETHERA GLOBAL
            </span>
          </a>
        </div>

        {/* Menu Desktop (Latar Gelap, Teks Cyan hover) */}
        <div className="hidden md:flex items-center space-x-8 font-semibold tracking-wide text-sm">
          {menuItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-slate-300 hover:text-cyan-400 transition-colors uppercase"
            >
              {item.label}
            </a>
          ))}
          {/* Tombol bersinar Cyan */}
          <motion.a
            href="#kontak"
            className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 px-5 py-2.5 rounded-full uppercase text-xs font-extrabold tracking-widest shadow-md shadow-cyan-500/20"
            whileHover={{ scale: 1.05 }}
          >
            INITIATE CONSULTATION
          </motion.a>
        </div>

        {/* Tombol Hamburger Mobile */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-slate-200 focus:outline-none"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              ></path>
            </svg>
          </button>
        </div>
      </nav>

      {/* Menu Dropdown Mobile (Dark Mode) */}
      <div
        className={`${
          isMenuOpen ? "max-h-96" : "max-h-0"
        } md:hidden bg-slate-900 overflow-hidden transition-all duration-500 ease-in-out border-t border-slate-800`}
      >
        {menuItems.map((item) => (
          <a
            key={item.href}
            href={item.href}
            onClick={() => setIsMenuOpen(false)}
            className="block py-4 px-6 text-sm text-slate-200 hover:bg-slate-800 hover:text-cyan-400 border-b border-slate-800 uppercase tracking-wide font-medium"
          >
            {item.label}
          </a>
        ))}
        <a
          href="#kontak"
          onClick={() => setIsMenuOpen(false)}
          className="block py-4 px-6 text-sm text-cyan-400 font-bold hover:bg-slate-800 uppercase tracking-widest"
        >
          INITIATE CONSULTATION
        </a>
      </div>
    </header>
  );
}
