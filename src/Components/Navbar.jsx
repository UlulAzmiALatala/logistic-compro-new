import React, { useState } from "react";
import { motion } from "framer-motion";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Disesuaikan urutannya: Visi Misi -> Layanan -> Jangkauan -> Flow Chart -> Lokasi
  const menuItems = [
    { href: "#visimisi", label: "COMPANY" },
    { href: "#layanan", label: "SERVICES" },
    { href: "#network", label: "NETWORK" },
    { href: "#timeline", label: "OPERATIONAL" },
    { href: "#lokasi", label: "LOCATION" },
  ];

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm transition-all duration-300">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* LOGO */}
        <div className="flex-shrink-0">
          <a href="#beranda">
            <img
              src="/logo-apl.jpeg"
              alt="Logo PT. Agung Perkasa Logistics"
              className="h-10 md:h-12 w-auto object-contain"
            />
          </a>
        </div>

        {/* MENU DESKTOP */}
        <div className="hidden md:flex items-center space-x-8 lg:space-x-10 font-bold tracking-tight text-sm">
          {menuItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-slate-600 hover:text-red-700 transition-colors uppercase"
            >
              {item.label}
            </a>
          ))}

          {/* TOMBOL CTA */}
          <motion.a
            href="https://wa.me/6281295377824"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-red-700 hover:bg-red-800 text-white px-7 py-2.5 rounded-md uppercase text-xs font-black tracking-widest shadow-md transition-all border-b-4 border-red-900 active:border-b-0 active:translate-y-1"
            whileHover={{ scale: 1.02 }}
          >
            HUBUNGI KAMI
          </motion.a>
        </div>

        {/* MOBILE TOGGLE */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-slate-900"
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

      {/* MOBILE MENU */}
      <div
        className={`${
          isMenuOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        } md:hidden bg-white overflow-hidden transition-all duration-300 border-t border-slate-100 shadow-xl`}
      >
        {menuItems.map((item) => (
          <a
            key={item.href}
            href={item.href}
            onClick={() => setIsMenuOpen(false)}
            className="block py-4 px-6 text-slate-800 font-bold hover:bg-red-50 hover:text-red-700 border-b border-slate-50 uppercase text-xs"
          >
            {item.label}
          </a>
        ))}
        <a
          href="https://wa.me/6281295377824"
          className="block py-5 px-6 text-red-700 font-black bg-red-50 uppercase text-xs tracking-widest"
        >
          HUBUNGI KAMI
        </a>
      </div>
    </header>
  );
}
