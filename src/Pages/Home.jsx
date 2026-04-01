import React, { useState, useEffect, useRef } from "react";
import { Helmet } from "react-helmet-async";
import {
  motion,
  useAnimation,
  useScroll,
  useSpring,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import { useInView } from "react-intersection-observer";

import Navbar from "@/Components/Navbar";
import Footer from "@/Components/Footer";

// --- KOMPONEN MAGNETIK ---
const MagneticWrapper = ({ children, className }) => {
  const ref = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e) => {
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    setPosition({ x: middleX * 0.3, y: middleY * 0.3 });
  };

  const reset = () => setPosition({ x: 0, y: 0 });

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      className={`inline-block ${className}`}
    >
      {children}
    </motion.div>
  );
};

// --- KOMPONEN ANIMASI SCROLL ---
const AnimatedSection = ({ children, id, className = "" }) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.15 });

  useEffect(() => {
    if (inView) controls.start("visible");
  }, [controls, inView]);

  return (
    <motion.section
      id={id}
      ref={ref}
      className={className}
      animate={controls}
      initial="hidden"
      variants={{
        visible: {
          opacity: 1,
          y: 0,
          scale: 1,
          transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] },
        },
        hidden: { opacity: 0, y: 60, scale: 0.98 },
      }}
    >
      {children}
    </motion.section>
  );
};

// --- KOMPONEN BARU: 3D CONVEX AUTO-CAROUSEL (EFEK CEMBUNG OTOMATIS) ---
const ConvexCarousel = ({ items }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  // Auto putar setiap 2.5 detik
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % items.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [items.length]);

  return (
    <div
      className="relative w-full h-[600px] md:h-[700px] flex justify-center items-center overflow-hidden"
      style={{ perspective: "1500px" }}
    >
      {items.map((card, i) => {
        // Kalkulasi posisi melingkar (cembung)
        let offset = (i - activeIndex + items.length) % items.length;
        if (offset > Math.floor(items.length / 2)) offset -= items.length;

        const absOffset = Math.abs(offset);
        const isActive = offset === 0;

        return (
          <motion.div
            key={i}
            className="absolute top-1/2 left-1/2 vanta-glass rounded-[2rem] p-8 border border-slate-700/50 flex flex-col justify-between"
            // INI INTI EFEK CEMBUNGNYA (Z di-push mundur, rotateY dimiringkan, X digeser)
            animate={{
              x: `calc(-50% + ${offset * 320}px)`,
              y: "-50%",
              z: -absOffset * 250, // Semakin jauh dari tengah, semakin mundur ke dalam layar
              rotateY: offset * -25, // Dimiringkan mengarah ke tengah
              scale: isActive ? 1 : 0.85,
              opacity: absOffset > 2 ? 0 : 1 - absOffset * 0.25,
            }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            style={{
              width: "340px",
              height: "520px",
              zIndex: 50 - absOffset,
              boxShadow: isActive ? "0 0 50px rgba(34,211,238,0.15)" : "none",
              borderColor: isActive
                ? "rgba(34,211,238,0.4)"
                : "rgba(51,65,85,0.5)",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent z-0"></div>
            <div className="relative z-10">
              <div
                className={`w-20 h-20 rounded-2xl flex items-center justify-center text-4xl mb-8 ${card.colorBox} shadow-lg transition-all duration-500`}
              >
                {card.icon}
              </div>
              <h3
                className={`text-3xl font-black mb-4 uppercase tracking-tight transition-colors duration-500 ${isActive ? "text-cyan-400" : "text-white"}`}
              >
                {card.title}
              </h3>
              <p className="text-slate-400 text-lg leading-relaxed">
                {card.desc}
              </p>
            </div>

            {/* Status Bar Ala Cyberpunk */}
            <div className="relative z-10 w-full h-12 border border-slate-600 rounded-xl flex items-center justify-center text-xs font-bold mt-6 tracking-widest overflow-hidden">
              <div
                className={`absolute inset-0 opacity-20 ${isActive ? "bg-cyan-400" : "bg-transparent"}`}
              ></div>
              <span className={isActive ? "text-cyan-300" : "text-slate-500"}>
                {isActive ? "● SYSTEM ACTIVE" : "○ STANDBY"}
              </span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default function Home() {
  const vantaRef = useRef(null);
  const [vantaEffect, setVantaEffect] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const cursorX = useSpring(0, { stiffness: 500, damping: 28 });
  const cursorY = useSpring(0, { stiffness: 500, damping: 28 });
  const [isHovering, setIsHovering] = useState(false);

  const dashboardRef = useRef(null);
  const { scrollYProgress: dashScroll } = useScroll({
    target: dashboardRef,
    offset: ["start end", "center center"],
  });
  const dashScale = useTransform(dashScroll, [0, 1], [0.8, 1.05]);
  const dashOpacity = useTransform(dashScroll, [0, 1], [0.3, 1]);

  useEffect(() => {
    const timer = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => setIsLoading(false), 800);
          return 100;
        }
        return prev + Math.floor(Math.random() * 15) + 5;
      });
    }, 150);

    const handleMouseMove = (e) => {
      cursorX.set(e.clientX - 16);
      cursorY.set(e.clientY - 16);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      clearInterval(timer);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  useEffect(() => {
    if (isLoading) return;

    let effect = null;
    const loadVanta = async () => {
      try {
        const THREE = await import("three");
        const GLOBE = (await import("vanta/dist/vanta.globe.min")).default;
        window.THREE = THREE;

        effect = GLOBE({
          el: vantaRef.current,
          THREE: THREE,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.0,
          minWidth: 200.0,
          scale: 1.0,
          scaleMobile: 1.0,
          color: 0x22d3ee,
          backgroundColor: 0x0f172a,
          size: 1.3,
        });
        setVantaEffect(effect);
      } catch (error) {
        console.error("Gagal memuat Vanta.js:", error);
      }
    };
    if (!vantaEffect && vantaRef.current) loadVanta();
    return () => {
      if (effect) effect.destroy();
    };
  }, [isLoading]);

  const partners = [
    "GLOBAL FREIGHT",
    "MAERSK HUB",
    "DHL EXPRESS",
    "FEDEX CORP",
    "NEXUS CHAIN",
    "SMART PORT",
    "AERO CARGO",
    "OCEAN LINK",
  ];

  // Data Kartu yang sudah diperbarui dengan class warna Tailwind statis agar tidak error PurgeCSS
  const ecoCards = [
    {
      icon: "🌍",
      title: "Global Network",
      desc: "Satelit GPS presisi tinggi mendeteksi kargo Anda di seluruh belahan bumi.",
      colorBox: "bg-cyan-500/20 border-cyan-500/50 text-cyan-400",
    },
    {
      icon: "🤖",
      title: "Auto-Warehouse",
      desc: "Ribuan drone dan robot cerdas memilah inventaris Anda 24/7 tanpa henti.",
      colorBox: "bg-violet-500/20 border-violet-500/50 text-violet-400",
    },
    {
      icon: "⚡",
      title: "Smart Routing",
      desc: "Algoritma memprediksi kemacetan dan cuaca untuk mencari rute tercepat.",
      colorBox: "bg-teal-500/20 border-teal-500/50 text-teal-400",
    },
    {
      icon: "📊",
      title: "Big Data Freight",
      desc: "Analitik prediktif mengamankan fluktuasi harga bahan bakar dan logistik.",
      colorBox: "bg-blue-500/20 border-blue-500/50 text-blue-400",
    },
    {
      icon: "❄️",
      title: "Cold Chain IoT",
      desc: "Sensor suhu mikroskopis mengawal kualitas bahan medis dan makanan segar.",
      colorBox: "bg-indigo-500/20 border-indigo-500/50 text-indigo-400",
    },
    {
      icon: "🚁",
      title: "Aero Drone",
      desc: "Pengiriman tahap akhir via udara memangkas waktu kirim di pusat kota padat.",
      colorBox: "bg-fuchsia-500/20 border-fuchsia-500/50 text-fuchsia-400",
    },
  ];

  return (
    <>
      <Helmet>
        <title>NEXT-GEN LOGISTICS - THE FUTURE OF SUPPLY CHAIN</title>
      </Helmet>

      <motion.div
        className="fixed top-0 left-0 w-8 h-8 rounded-full border border-cyan-400 pointer-events-none z-[9999] mix-blend-screen hidden md:block"
        style={{
          x: cursorX,
          y: cursorY,
          scale: isHovering ? 1.5 : 1,
          backgroundColor: isHovering
            ? "rgba(34, 211, 238, 0.1)"
            : "transparent",
        }}
      />

      <AnimatePresence>
        {isLoading && (
          <motion.div
            className="fixed inset-0 z-[10000] bg-slate-950 flex flex-col items-center justify-center"
            exit={{ opacity: 0, y: "-100%" }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          >
            <div className="w-64 relative">
              <div className="flex justify-between text-cyan-500 font-mono text-xs mb-2 tracking-widest">
                <span>SYSTEM.INIT</span>
                <span>{loadingProgress >= 100 ? 100 : loadingProgress}%</span>
              </div>
              <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-cyan-400 shadow-[0_0_15px_#22d3ee]"
                  initial={{ width: "0%" }}
                  animate={{ width: `${loadingProgress}%` }}
                />
              </div>
              <div className="mt-4 text-slate-500 font-mono text-[10px] tracking-[0.2em] text-center animate-pulse">
                INITIATING QUANTUM LOGISTICS...
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 to-violet-500 origin-left z-[100]"
        style={{ scaleX }}
      />

      <div className="bg-slate-950 text-slate-200 font-sans antialiased overflow-x-hidden relative bg-grid-pattern cursor-default">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-600/30 rounded-full mix-blend-screen filter blur-[128px] animate-blob z-0 pointer-events-none"></div>
        <div className="absolute top-40 right-1/4 w-96 h-96 bg-violet-600/20 rounded-full mix-blend-screen filter blur-[128px] animate-blob animation-delay-2000 z-0 pointer-events-none"></div>

        <Navbar />

        <main className="relative z-10">
          {/* HERO SECTION DENGAN GLITCH TEXT */}
          <section
            id="beranda"
            ref={vantaRef}
            className="min-h-screen flex items-center justify-center text-white relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-950/70 to-slate-950 z-0 pointer-events-none"></div>

            <motion.div
              className="container mx-auto px-6 text-center z-10 mt-20"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1, duration: 1 }}
                className="inline-block mb-4 px-4 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 backdrop-blur-md text-cyan-400 text-sm font-bold tracking-widest uppercase"
              >
                Autonomous Supply Chain
              </motion.div>

              <h1 className="text-5xl md:text-8xl font-black leading-tight tracking-tighter text-white mb-6 drop-shadow-2xl uppercase">
                LOGISTICS <br />
                <div className="glitch-wrapper">
                  <span
                    className="futuristic-text-gradient bg-clip-text text-transparent glitch-text"
                    data-text="REIMAGINED."
                  >
                    REIMAGINED.
                  </span>
                </div>
              </h1>

              <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto mb-12 font-medium leading-relaxed drop-shadow-md">
                Menghubungkan titik-titik global dengan kecerdasan buatan. Kargo
                Anda tiba lebih cepat, lebih aman, dan terlacak secara
                real-time.
              </p>

              <MagneticWrapper>
                <motion.a
                  href="#layanan"
                  className="btn-electric-cyan-glow uppercase tracking-widest text-sm font-black relative overflow-hidden group inline-block"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onMouseEnter={() => setIsHovering(true)}
                  onMouseLeave={() => setIsHovering(false)}
                >
                  <span className="relative z-10 text-slate-950">
                    ENTER THE SYSTEM
                  </span>
                  <div className="absolute inset-0 -translate-x-full bg-white/40 skew-x-12 group-hover:animate-[shimmer_1.5s_infinite] z-0"></div>
                </motion.a>
              </MagneticWrapper>
            </motion.div>
          </section>

          {/* MARQUEE PARTNERS */}
          <div className="py-10 bg-slate-900/50 border-y border-slate-800 backdrop-blur-md overflow-hidden flex relative z-20">
            <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-slate-950 to-transparent z-10 pointer-events-none"></div>
            <div className="animate-scroll flex space-x-16 items-center px-8">
              {[...partners, ...partners].map((partner, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-3 text-slate-500 font-bold text-2xl md:text-3xl tracking-widest whitespace-nowrap hover:text-cyan-400 transition-colors duration-300 cursor-default"
                  onMouseEnter={() => setIsHovering(true)}
                  onMouseLeave={() => setIsHovering(false)}
                >
                  <span className="text-cyan-500/50">◆</span>
                  <span>{partner}</span>
                </div>
              ))}
            </div>
            <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-slate-950 to-transparent z-10 pointer-events-none"></div>
          </div>

          {/* --- SECTION BARU: HOLOGRAPHIC CARGO TRACE TIMELINE --- */}
          <AnimatedSection
            id="timeline"
            className="py-24 relative overflow-hidden"
          >
            <div className="container mx-auto px-6 relative z-10">
              <div className="text-center mb-20">
                <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter">
                  LIVE <span className="text-violet-400">OPERATION NODE</span>
                </h2>
                <p className="text-slate-400 mt-4 text-lg">
                  Protokol eksekusi pengiriman presisi tinggi berbasis AI.
                </p>
              </div>

              <div className="relative max-w-4xl mx-auto">
                {/* Garis Hologram Vertikal di Tengah */}
                <div className="absolute left-1/2 transform -translate-x-1/2 top-0 bottom-0 w-1 bg-slate-800 rounded-full">
                  {/* Garis Cahaya yang berjalan */}
                  <motion.div
                    className="w-full bg-cyan-400 shadow-[0_0_20px_#22d3ee]"
                    animate={{
                      height: ["0%", "100%", "0%"],
                      top: ["0%", "0%", "100%"],
                    }}
                    transition={{
                      duration: 4,
                      ease: "linear",
                      repeat: Infinity,
                    }}
                    style={{ position: "absolute" }}
                  />
                </div>

                {/* Timeline Items */}
                {[
                  {
                    title: "AI Routing Initialization",
                    time: "00:00:01",
                    desc: "Sistem memindai 1.4 juta rute alternatif dalam milidetik.",
                    align: "left",
                  },
                  {
                    title: "Autonomous Loading",
                    time: "00:15:42",
                    desc: "Robotik AGV memasukkan kargo ke armada terdekat secara otomatis.",
                    align: "right",
                  },
                  {
                    title: "Real-Time Fleet Sync",
                    time: "04:30:10",
                    desc: "Kargo bergerak dalam pengawasan penuh satelit Low Earth Orbit.",
                    align: "left",
                  },
                  {
                    title: "Drone Last-Mile Drop",
                    time: "12:45:00",
                    desc: "Drone mengantarkan paket tepat ke titik koordinat akhir.",
                    align: "right",
                  },
                ].map((node, idx) => (
                  <div
                    key={idx}
                    className={`relative flex items-center justify-between mb-16 ${node.align === "left" ? "flex-row-reverse" : ""}`}
                  >
                    <div className="w-5/12"></div>
                    <div className="w-2/12 flex justify-center relative">
                      {/* Titik Node Bercahaya */}
                      <div className="w-6 h-6 rounded-full bg-slate-900 border-4 border-cyan-500 z-10 relative shadow-[0_0_15px_#22d3ee]">
                        <motion.div
                          className="absolute inset-0 rounded-full bg-cyan-400"
                          animate={{
                            scale: [1, 1.8, 1],
                            opacity: [0.8, 0, 0.8],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            delay: idx * 0.5,
                          }}
                        />
                      </div>
                    </div>
                    <div
                      className={`w-5/12 ${node.align === "left" ? "text-right pr-8" : "text-left pl-8"}`}
                    >
                      <div className="vanta-glass p-6 rounded-2xl border-l-4 border-cyan-500 hover:-translate-y-2 transition-transform duration-300">
                        <span className="text-cyan-400 font-mono text-xs mb-2 block">
                          {node.time}
                        </span>
                        <h4 className="text-xl font-bold text-white mb-2">
                          {node.title}
                        </h4>
                        <p className="text-slate-400 text-sm">{node.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </AnimatedSection>

          {/* --- 3D CONVEX AUTO CAROUSEL (PS5 CEMBUNG OTOMATIS) --- */}
          <AnimatedSection
            id="layanan"
            className="py-24 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-slate-950 z-0">
              {/* Efek cahaya radial di belakang carousel */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-4xl bg-cyan-900/20 blur-[150px] rounded-full"></div>
            </div>

            <div className="container mx-auto px-6 z-10 relative mb-4 text-center">
              <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase drop-shadow-lg">
                SMART <span className="text-cyan-400">MODULES</span>
              </h2>
              <p className="text-slate-300 mt-4 text-xl">
                Sistem berputar otomatis memindai modul aktif.
              </p>
            </div>

            {/* Panggil Komponen Cembung Otomatis Tanpa Tombol Kiri-Kanan */}
            <ConvexCarousel items={ecoCards} />
          </AnimatedSection>

          {/* CINEMATIC ZOOM DASHBOARD PREVIEW */}
          <AnimatedSection id="digital" className="py-32 relative">
            <div className="container mx-auto px-6 text-center z-10 relative">
              <h2 className="text-4xl md:text-6xl font-black mb-6 text-white tracking-tighter">
                FLEET{" "}
                <span className="futuristic-text-gradient">COMMAND CENTER</span>
              </h2>
              <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-20 font-medium">
                Visualisasikan metrik distribusi Anda secara real-time.
                Antarmuka komando yang membesar dan menarik Anda ke dalam kokpit
                data.
              </p>

              <div ref={dashboardRef} className="max-w-7xl mx-auto py-10">
                <motion.div
                  className="rounded-[3rem] p-2 bg-gradient-to-b from-cyan-500/20 to-violet-500/20 backdrop-blur-xl border border-white/10 shadow-[0_20px_70px_rgba(34,211,238,0.3)] relative"
                  style={{ scale: dashScale, opacity: dashOpacity }}
                >
                  <div className="absolute inset-0 bg-cyan-400/20 rounded-[3rem] blur-[120px] -z-10"></div>
                  <img
                    src="/images/contoh-dashboard.jpg"
                    alt="Mockup Dashboard Logistik"
                    className="w-full h-auto rounded-[2.5rem] border border-slate-800"
                  />
                </motion.div>
              </div>
            </div>
          </AnimatedSection>

          {/* KONTAK SECTION */}
          <AnimatedSection
            id="kontak"
            className="py-32 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-cyan-950 via-slate-950 to-slate-950 z-0"></div>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-96 bg-cyan-600/20 filter blur-[150px] z-0 pointer-events-none"></div>

            <div className="container mx-auto px-6 text-center z-10 relative vanta-glass max-w-5xl rounded-[3rem] py-20 border-cyan-500/30 shadow-[0_0_80px_rgba(34,211,238,0.1)]">
              <h2 className="text-5xl md:text-7xl font-black mb-8 tracking-tighter text-white">
                SECURE YOUR <br />{" "}
                <span className="text-cyan-400">NETWORK.</span>
              </h2>
              <p className="text-slate-300 max-w-2xl mx-auto mb-12 text-xl font-medium">
                Jangan biarkan kompetitor mengambil alih rute Anda. Inisialisasi
                koneksi dengan arsitek logistik kami hari ini.
              </p>

              <MagneticWrapper>
                <motion.a
                  href="https://wa.me/6281234567890"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-electric-cyan-glow block"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onMouseEnter={() => setIsHovering(true)}
                  onMouseLeave={() => setIsHovering(false)}
                >
                  INITIALIZE LINK
                </motion.a>
              </MagneticWrapper>
            </div>
          </AnimatedSection>
        </main>

        <Footer />
      </div>
    </>
  );
}
