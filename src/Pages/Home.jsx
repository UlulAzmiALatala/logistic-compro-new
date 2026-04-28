import React, { useState, useEffect, useRef } from "react";
import { Helmet } from "react-helmet-async";
import {
  motion,
  useAnimation,
  useScroll,
  useSpring,
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
    setPosition({ x: middleX * 0.2, y: middleY * 0.2 });
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
        hidden: { opacity: 0, y: 40, scale: 0.98 },
      }}
    >
      {children}
    </motion.section>
  );
};

// --- KOMPONEN MODAL DETAIL LAYANAN (DENGAN SUPPORT VIDEO) ---
// --- KOMPONEN MODAL DETAIL LAYANAN (DENGAN SUPPORT VIDEO) ---
const ServiceModal = ({ service, onClose }) => {
  const [imgIndex, setImgIndex] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [showDesc, setShowDesc] = useState(true);
  const dragRef = useRef(null);

  useEffect(() => {
    setZoom(1);
  }, [imgIndex]);

  const handleZoomIn = (e) => {
    e.stopPropagation();
    setZoom((prev) => Math.min(prev + 0.5, 3));
  };
  const handleZoomOut = (e) => {
    e.stopPropagation();
    setZoom((prev) => Math.max(prev - 0.5, 1));
  };

  const nextImg = (e) => {
    e.stopPropagation();
    setImgIndex((prev) => (prev + 1) % service.images.length);
  };
  const prevImg = (e) => {
    e.stopPropagation();
    setImgIndex(
      (prev) => (prev - 1 + service.images.length) % service.images.length,
    );
  };

  const currentMedia = service.images[imgIndex];
  const isVideo = currentMedia.endsWith(".mp4");

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[99999] flex items-center justify-center bg-slate-950/95 backdrop-blur-md overflow-hidden font-sans"
      onClick={onClose}
    >
      <div
        ref={dragRef}
        className="absolute inset-0 flex items-center justify-center overflow-hidden"
      >
        <AnimatePresence mode="wait">
          {isVideo ? (
            <motion.video
              key={`vid-${imgIndex}`}
              src={currentMedia}
              autoPlay
              loop
              muted
              controls
              playsInline
              drag={zoom > 1}
              dragConstraints={dragRef}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: zoom }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              /* PENAMBAHAN w-full h-full DI SINI AGAR VIDEO MEMBESAR OTOMATIS */
              className={`w-full h-full max-h-[85vh] max-w-[90vw] object-contain rounded-xl shadow-2xl ${zoom > 1 ? "cursor-grab active:cursor-grabbing" : ""}`}
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <motion.img
              key={`img-${imgIndex}`}
              src={currentMedia}
              alt={`${service.title} - ${imgIndex + 1}`}
              drag={zoom > 1}
              dragConstraints={dragRef}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: zoom }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              /* PENAMBAHAN w-full h-full DI SINI AGAR GAMBAR KECIL DIPAKSA MELAR */
              className={`w-full h-full max-h-[85vh] max-w-[90vw] object-contain rounded-xl shadow-2xl bg-slate-900 ${zoom > 1 ? "cursor-grab active:cursor-grabbing" : ""}`}
              onClick={(e) => e.stopPropagation()}
            />
          )}
        </AnimatePresence>
      </div>

      <button
        className="absolute top-6 right-6 md:top-10 md:right-10 text-white/70 hover:text-white bg-slate-800/50 hover:bg-red-600 rounded-full p-3 transition-all z-50"
        onClick={onClose}
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
            d="M6 18L18 6M6 6l12 12"
          ></path>
        </svg>
      </button>

      {service.images.length > 1 && (
        <>
          <button
            onClick={prevImg}
            className="absolute left-4 md:left-10 top-1/2 -translate-y-1/2 bg-slate-900/50 hover:bg-red-600 text-white p-3 rounded-full z-40 transition-colors"
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
                d="M15 19l-7-7 7-7"
              ></path>
            </svg>
          </button>
          <button
            onClick={nextImg}
            className="absolute right-4 md:right-10 top-1/2 -translate-y-1/2 bg-slate-900/50 hover:bg-red-600 text-white p-3 rounded-full z-40 transition-colors"
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
                d="M9 5l7 7-7 7"
              ></path>
            </svg>
          </button>
        </>
      )}

      <div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-slate-900/80 p-2 rounded-full border border-slate-700 z-40"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleZoomOut}
          disabled={zoom <= 1}
          className="p-2 text-white hover:bg-slate-700 rounded-full disabled:opacity-30 disabled:hover:bg-transparent"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7"
            ></path>
          </svg>
        </button>
        <span className="text-white text-xs font-bold w-12 text-center">
          {Math.round(zoom * 100)}%
        </span>
        <button
          onClick={handleZoomIn}
          disabled={zoom >= 3}
          className="p-2 text-white hover:bg-slate-700 rounded-full disabled:opacity-30 disabled:hover:bg-transparent"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
            ></path>
          </svg>
        </button>
      </div>

      <div
        className="absolute bottom-24 md:bottom-10 left-4 md:left-10 z-50 flex flex-col items-start max-w-md w-[calc(100%-2rem)] md:w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <AnimatePresence>
          {showDesc && (
            <motion.div
              initial={{ opacity: 0, y: 20, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: 20, height: 0 }}
              className="bg-slate-900/80 backdrop-blur-lg border border-slate-700 p-6 rounded-2xl mb-4 overflow-hidden shadow-2xl"
            >
              <div className="flex items-center gap-4 mb-4 border-b border-slate-700 pb-4">
                <span className="text-4xl">{service.icon}</span>
                <h3 className="text-2xl font-black text-white uppercase">
                  {service.title}
                </h3>
              </div>
              <p className="text-slate-300 text-sm leading-relaxed mb-4">
                {service.fullDesc}
              </p>
              {service.images.length > 1 && (
                <div className="flex flex-wrap gap-2">
                  {service.images.map((_, idx) => (
                    <div
                      key={idx}
                      className={`h-1.5 rounded-full transition-all ${idx === imgIndex ? "w-6 bg-red-500" : "w-2 bg-slate-600"}`}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={() => setShowDesc(!showDesc)}
          className="bg-red-700 hover:bg-red-800 text-white px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg flex items-center gap-2"
        >
          {showDesc ? (
            <>
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                ></path>
              </svg>{" "}
              Sembunyikan Keterangan
            </>
          ) : (
            <>
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                ></path>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268-2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                ></path>
              </svg>{" "}
              Lihat Keterangan
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
};

// --- KOMPONEN 3D CONVEX AUTO-CAROUSEL (DENGAN DRAG & SIDE-CLICK) ---
const ConvexCarousel = ({ items, onSelectService }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const displayItems = items.length === 4 ? [...items, ...items] : items;

  // Auto-play interval yang cerdas (reset jika activeIndex berubah manual)
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % displayItems.length);
    }, 5000); // 5 detik per putaran
    return () => clearInterval(interval);
  }, [displayItems.length, activeIndex]);

  // Fungsi untuk Handle Drag/Swipe
  const handleDragEnd = (event, info) => {
    if (info.offset.x > 50) {
      // Geser ke Kanan (Previous Card)
      setActiveIndex(
        (prev) => (prev - 1 + displayItems.length) % displayItems.length,
      );
    } else if (info.offset.x < -50) {
      // Geser ke Kiri (Next Card)
      setActiveIndex((prev) => (prev + 1) % displayItems.length);
    }
  };

  return (
    <div
      className="relative w-full h-[600px] md:h-[650px] flex justify-center items-center overflow-hidden touch-pan-y"
      style={{ perspective: "1500px" }}
    >
      {displayItems.map((card, i) => {
        let offset =
          (i - activeIndex + displayItems.length) % displayItems.length;
        if (offset > Math.floor(displayItems.length / 2))
          offset -= displayItems.length;

        const absOffset = Math.abs(offset);
        const isActive = offset === 0;

        return (
          <motion.div
            key={i}
            drag="x" // Mengaktifkan swipe ke kiri/kanan
            dragConstraints={{ left: 0, right: 0 }} // Snap kembali setelah di-drag
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
            className="absolute top-1/2 left-1/2 corporate-glass rounded-[2rem] p-8 flex flex-col justify-between bg-white/95 border border-slate-200 cursor-pointer"
            onClick={() => {
              if (isActive) {
                onSelectService(card); // Jika kartu di tengah, buka Modal
              } else {
                setActiveIndex(i); // Jika kartu di samping, geser ke tengah
              }
            }}
            animate={{
              x: `calc(-50% + ${offset * 320}px)`,
              y: "-50%",
              z: -absOffset * 250,
              rotateY: offset * -20,
              scale: isActive ? 1 : 0.85,
              opacity: absOffset >= 3 ? 0 : 1 - absOffset * 0.3,
            }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            style={{
              width: "340px",
              height: "480px",
              zIndex: 50 - absOffset,
              boxShadow: isActive
                ? "0 20px 40px rgba(183, 28, 28, 0.15)"
                : "none",
              borderColor: isActive
                ? "rgba(183, 28, 28, 0.4)"
                : "rgba(226, 232, 240, 1)",
              pointerEvents: absOffset >= 3 ? "none" : "auto", // Kartu di samping tetap bisa diklik
            }}
          >
            <div className="relative z-10 text-center pointer-events-none">
              <div
                className={`w-20 h-20 mx-auto rounded-2xl flex items-center justify-center text-4xl mb-6 ${card.colorBox} shadow-sm transition-all duration-500`}
              >
                {card.icon}
              </div>
              <h3
                className={`text-2xl font-black mb-4 uppercase tracking-tight transition-colors duration-500 ${isActive ? "text-red-700" : "text-slate-800"}`}
              >
                {card.title}
              </h3>
              <p className="text-slate-600 text-sm md:text-base leading-relaxed font-medium line-clamp-4">
                {card.desc}
              </p>
            </div>

            <div
              className={`relative z-10 w-full h-12 border rounded-xl flex items-center justify-center text-xs font-bold mt-6 tracking-widest overflow-hidden transition-colors duration-500 ${isActive ? "bg-red-700 border-red-800 shadow-md group hover:bg-red-800" : "bg-slate-50 border-slate-200"}`}
            >
              <span
                className={`flex items-center gap-2 ${isActive ? "text-white" : "text-slate-400"}`}
              >
                {isActive ? (
                  <>
                    LIHAT DETAIL{" "}
                    <svg
                      className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      ></path>
                    </svg>
                  </>
                ) : (
                  "BACA SELENGKAPNYA"
                )}
              </span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

// HELPER FUNCTION: Meng-generate array path gambar
const generatePaths = (prefix, count, ext = "jpeg") => {
  return Array.from(
    { length: count },
    (_, i) => `/images/layanan/${prefix}-${i + 1}.${ext}`,
  );
};

export default function Home() {
  const vantaRef = useRef(null);
  const [vantaEffect, setVantaEffect] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);

  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedService, setSelectedService] = useState(null);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

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
    }, 100);
    return () => clearInterval(timer);
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
          color: 0xd32f2f,
          backgroundColor: 0xffffff,
          size: 1.0,
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

  // DATA KONTEN LAYANAN (Disesuaikan dengan folder Tree)
  const serviceCards = [
    {
      id: "darat",
      icon: "🚚",
      title: "Cargo Darat",
      desc: "Layanan pengiriman barang via Trucking, serta melayani sewa Truck CDD, CDE, Fuso, Wingbox, Trailer, dll.",
      fullDesc:
        "PT. Agung Perkasa Logistics menyediakan armada darat yang komprehensif dan terawat untuk memastikan kelancaran distribusi barang Anda. Kami melayani Full Truck Load (FTL) maupun Less Than Truckload (LTL) dengan berbagai pilihan armada seperti Blind Van, CDD, CDE, Fuso, Wingbox, hingga Trailer.",
      colorBox: "bg-red-100 border-red-200 text-red-700",
      images: [
        "/images/layanan/darat/cargo-darat1.jpeg",
        "/images/layanan/darat/cargo-darat2.jpeg",
        "/images/layanan/darat/cargo-darat3.jpeg",
        "/images/layanan/darat/cargo-darat4.jpeg",
        "/images/layanan/darat/cargo-darat5.jpeg",
        "/images/layanan/darat/cargo-darat6.jpeg",
        "/images/layanan/darat/cargo-darat7.jpg",
        "/images/layanan/darat/cargo-darat8.jpeg",
        "/images/layanan/darat/cargo-darat9.jpeg",
        "/images/layanan/darat/cargo-darat10.jpg",
        "/images/layanan/darat/cargo-darat11.jpg",
        "/images/layanan/darat/cargo-darat12.jpg",
        "/images/layanan/darat/cargo-darat13.jpeg",
      ],
    },
    {
      id: "laut",
      icon: "🚢",
      title: "Cargo Laut",
      desc: "Layanan pengiriman via Kapal Pelni dan Kapal Cargo, serta melayani pengiriman LCL & FCL.",
      fullDesc:
        "Solusi logistik antar pulau yang efisien dan ekonomis. Layanan Cargo Laut kami mencakup pengiriman via Kapal RoRo, Kapal Pelni (Cepat), hingga Kapal Cargo Breakbulk. Kami memfasilitasi pengiriman skala kecil (LCL) hingga skala besar (FCL) dengan keamanan kargo yang terjamin.",
      colorBox: "bg-slate-200 border-slate-300 text-slate-800",
      images: [
        "/images/layanan/laut/cargo-laut1.jpg",
        "/images/layanan/laut/cargo-laut2.jpg",
        "/images/layanan/laut/cargo-laut3.jpg",
        "/images/layanan/laut/cargo-laut4.jpg",
        "/images/layanan/laut/cargo-laut5.jpg",
        "/images/layanan/laut/cargo-laut6.jpg",
        "/images/layanan/laut/cargo-laut7.jpg",
        "/images/layanan/laut/cargo-laut8.jpg",
        "/images/layanan/laut/cargo-laut9.jpg",
        "/images/layanan/laut/cargo-laut10.jpg",
        "/images/layanan/laut/cargo-laut11.jpeg",
        "/images/layanan/laut/cargo-laut12.png",
        "/images/layanan/laut/cargo-laut13.mp4",
      ],
    },
    {
      id: "udara",
      icon: "✈️",
      title: "Cargo Udara",
      desc: "Layanan pengiriman barang via udara dengan service Port To Port maupun Door To Door dengan aman dan cepat.",
      fullDesc:
        "Untuk kebutuhan distribusi yang sangat mendesak dan mengutamakan kecepatan waktu (Time-Sensitive), Cargo Udara adalah pilihan utama. Kami bekerja sama dengan maskapai terkemuka untuk menawarkan layanan pengiriman ekspres (Port-to-Port / Door-to-Door).",
      colorBox: "bg-red-100 border-red-200 text-red-700",
      images: [
        "/images/layanan/udara/cargo-udara1.jpg",
        "/images/layanan/udara/cargo-udara2.jpg",
        "/images/layanan/udara/cargo-udara3.jpg",
        "/images/layanan/udara/cargo-udara4.jpg",
        "/images/layanan/udara/cargo-udara5.jpg",
        "/images/layanan/udara/cargo-udara6.jpg",
        "/images/layanan/udara/cargo-udara7.jpg",
        "/images/layanan/udara/cargo-udara8.jpg",
        "/images/layanan/udara/cargo-udara9.jpg",
        "/images/layanan/udara/cargo-udara10.jpg",
        "/images/layanan/udara/cargo-udara11.jpeg",
        "/images/layanan/udara/cargo-udara12.jpeg",
        "/images/layanan/udara/cargo-udara13.jpeg",
      ],
    },
    {
      id: "container",
      icon: "📦",
      title: "Cargo Container",
      desc: "Layanan sewa Container 20ft maupun 40ft untuk kebutuhan logistik dan pengiriman proyek berskala besar.",
      fullDesc:
        "Kami menangani logistik berskala industri dan pengiriman proyek berat. Layanan penyewaan container 20ft dan 40ft kami kelola secara profesional mulai dari pemuatan (stuffing), perizinan pelabuhan, hingga proses bongkar (stripping) di lokasi akhir Anda.",
      colorBox: "bg-slate-200 border-slate-300 text-slate-800",
      images: [
        "/images/layanan/container/cargo-container1.jpeg",
        "/images/layanan/container/cargo-container2.jpeg",
        "/images/layanan/container/cargo-container3.jpeg",
        "/images/layanan/container/cargo-container4.jpeg",
        "/images/layanan/container/cargo-container5.jpeg",
        "/images/layanan/container/cargo-container6.jpeg",
        "/images/layanan/container/cargo-container7.jpeg",
        "/images/layanan/container/cargo-container8.jpeg",
        "/images/layanan/container/cargo-container9.jpeg",
        "/images/layanan/container/cargo-container10.jpeg",
        "/images/layanan/container/cargo-container11.jpeg",
        "/images/layanan/container/cargo-container12.jpeg",
        "/images/layanan/container/cargo-container13.jpeg",
        "/images/layanan/container/cargo-container14.jpeg",
        "/images/layanan/container/cargo-container15.jpg",
        "/images/layanan/container/cargo-container16.jpeg",
      ],
    },
  ];

  const clientsList = [
    { name: "Crystal Tech", logo: "/images/client-crystal.png" },
    { name: "Synergy Solusi", logo: "/images/client-synergy.png" },
    { name: "ProMinent", logo: "/images/client-prominent.jpg" },
    { name: "Sindo TV", logo: "/images/client-sindo.jpg" },
    { name: "Mitsubishi", logo: "/images/client-mitsubishi.png" },
  ];

  const timelineNodes = [
    {
      title: "Request Pick Up",
      entity: "Customer ➔ Customer Service",
      desc: "Pelanggan melakukan permintaan pengiriman. Permintaan ini langsung direspons dan dikoordinasikan oleh tim Customer Service.",
      align: "left",
    },
    {
      title: "Pick Up & Shipment",
      entity: "Courier",
      desc: "Kurir mengambil dokumen atau paket dari lokasi pelanggan untuk kemudian dikirimkan (Shipment) ke pusat operasional.",
      align: "right",
    },
    {
      title: "Team Processing",
      entity: "Komando Logistics",
      desc: "Barang tiba di pusat. Tim pemrosesan Komando Logistics Distribution melakukan pendataan untuk mengatur jadwal distribusi.",
      align: "left",
    },
    {
      title: "Distribution & Delivery",
      entity: "Inbound / Outbound",
      desc: "Proses pengiriman ke tujuan. Jalur Inbound untuk pengiriman dalam kota (City Courier), dan Outbound untuk rute domestik cabang.",
      align: "right",
    },
    {
      title: "POD & Tracing",
      entity: "System Reporting",
      desc: "Pemantauan status pengiriman secara berkala hingga selesai, dilanjutkan dengan penerbitan bukti lapor (Proof of Delivery / POD).",
      align: "left",
    },
  ];

  return (
    <>
      <Helmet>
        <title>
          PT. Agung Perkasa Logistics | Forwarder & Trucking Terpercaya
        </title>
      </Helmet>

      {/* --- LOADING SCREEN --- */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            className="fixed inset-0 z-[10000] bg-white flex flex-col items-center justify-center"
            exit={{ opacity: 0, y: "-100%" }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          >
            <div className="w-64 relative">
              <div className="flex justify-between text-red-700 font-bold text-xs mb-2 tracking-widest">
                <span>MEMUAT DATA</span>
                <span>{loadingProgress >= 100 ? 100 : loadingProgress}%</span>
              </div>
              <div className="h-1 w-full bg-slate-200 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-red-700"
                  initial={{ width: "0%" }}
                  animate={{ width: `${loadingProgress}%` }}
                />
              </div>
              <div className="mt-4 text-slate-500 font-semibold text-[10px] tracking-[0.2em] text-center animate-pulse">
                PT. AGUNG PERKASA LOGISTICS
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-600 to-red-900 origin-left z-[100]"
        style={{ scaleX }}
      />

      <div className="bg-slate-50 text-slate-900 font-sans antialiased overflow-x-hidden relative cursor-default">
        <Navbar />

        <main className="relative z-10">
          {/* 1. HERO SECTION */}
          <section
            id="beranda"
            className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20"
          >
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center z-0"></div>
            <div className="absolute inset-0 bg-white/85 z-10"></div>
            <div
              ref={vantaRef}
              className="absolute inset-0 z-20 mix-blend-multiply opacity-60 pointer-events-none"
            ></div>

            <motion.div
              className="container mx-auto px-6 text-center z-30 relative"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1, duration: 1 }}
                className="inline-block mb-6 px-5 py-2 rounded-full border border-red-200 bg-red-50 text-red-700 text-sm font-bold tracking-widest uppercase shadow-sm"
              >
                Professional Freight Forwarder
              </motion.div>

              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-tight tracking-tighter text-slate-900 mb-6 uppercase">
                PT. AGUNG PERKASA <br />
                <span className="corporate-text-gradient">LOGISTICS</span>
              </h1>

              <p className="text-lg md:text-xl text-slate-700 max-w-3xl mx-auto mb-12 font-medium leading-relaxed bg-white/50 backdrop-blur-sm py-4 px-6 rounded-2xl">
                Berdiri sejak 2022. Kami hadir sebagai solusi logistik Anda,
                melayani pengiriman barang ke seluruh Indonesia dengan
                spesialisasi Kurir, Trucking, Sea Freight, Air Freight, hingga
                Project Heavy Equipment.
              </p>

              <MagneticWrapper>
                <motion.a
                  href="#layanan"
                  className="btn-corporate-solid uppercase tracking-widest text-sm inline-block shadow-red-700/30"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Jelajahi Layanan Kami
                </motion.a>
              </MagneticWrapper>
            </motion.div>
          </section>

          {/* 2. VISI MISI SECTION */}
          <AnimatedSection
            id="visimisi"
            className="py-24 relative bg-white border-y border-slate-200"
          >
            <div className="container mx-auto px-6 z-10 relative">
              <div className="flex flex-col md:flex-row gap-12 items-center">
                <div className="md:w-1/2">
                  <h2 className="text-4xl md:text-5xl font-black mb-6 text-slate-900 tracking-tighter">
                    VISI & <span className="text-red-700">MISI</span>
                  </h2>
                  <div className="space-y-8">
                    <div className="bg-slate-50 p-8 rounded-2xl shadow-sm border border-slate-200 border-l-4 border-l-red-700 hover-lift">
                      <h3 className="text-2xl font-bold text-slate-900 mb-3">
                        Visi Kami
                      </h3>
                      <p className="text-slate-600 leading-relaxed font-medium">
                        Di era globalisasi dan pasar terbuka saat ini, kami
                        sangat meyakini kebutuhan logistik akan terus meningkat
                        setiap saat. Untuk itu kami hadir dengan pengalaman kami
                        untuk memberikan solusi kebutuhan logistik Anda.
                      </p>
                    </div>
                    <div className="bg-slate-50 p-8 rounded-2xl shadow-sm border border-slate-200 border-l-4 border-l-slate-800 hover-lift">
                      <h3 className="text-2xl font-bold text-slate-900 mb-3">
                        Misi Kami
                      </h3>
                      <p className="text-slate-600 leading-relaxed font-medium">
                        Berkomitmen untuk memberikan pelayanan terbaik untuk
                        kepuasan pelanggan setia kami. Kami selalu memperhatikan
                        setiap detail komponen logistik untuk memastikan
                        kepuasan pengirim dan penerima barang.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="md:w-1/2 flex justify-center">
                  <div className="w-full max-w-md aspect-square rounded-[3rem] bg-gradient-to-tr from-red-800 to-red-500 shadow-2xl relative overflow-hidden flex items-center justify-center p-8">
                    <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
                    <h2 className="text-white text-5xl md:text-6xl font-black z-10 text-center tracking-tighter">
                      AGUNG <br /> PERKASA <br /> LOGISTICS
                    </h2>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedSection>

          {/* 3. CAROUSEL LAYANAN UTAMA */}
          <AnimatedSection
            id="layanan"
            className="py-24 relative overflow-hidden bg-slate-50"
          >
            <div className="container mx-auto px-6 z-10 relative mb-4 text-center">
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase drop-shadow-sm">
                PRODUK <span className="text-red-700">LAYANAN</span>
              </h2>
              <p className="text-slate-500 mt-4 text-lg font-medium">
                Geser (swipe) kartu, atau klik kartu di samping untuk melihat
                detail layanan.
              </p>
            </div>
            <ConvexCarousel
              items={serviceCards}
              onSelectService={setSelectedService}
            />
          </AnimatedSection>

          {/* 4. JANGKAUAN LAYANAN */}
          <AnimatedSection
            id="network"
            className="py-24 bg-white relative border-y border-slate-200"
          >
            <div className="container mx-auto px-6 text-center">
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tighter uppercase">
                JANGKAUAN <span className="text-red-700">LAYANAN</span>
              </h2>
              <p className="text-slate-500 mb-16 text-lg max-w-2xl mx-auto">
                Jaringan distribusi dan agen kami tersebar di seluruh titik
                strategis wilayah Indonesia. Klik gambar untuk memperbesar.
              </p>

              <div className="grid md:grid-cols-2 gap-10">
                <div className="flex flex-col items-center">
                  <h3 className="text-2xl font-bold mb-6 text-slate-800 border-b-4 border-red-600 pb-2">
                    Branch & Agen
                  </h3>
                  <div
                    className="corporate-glass p-2 rounded-2xl w-full hover-lift cursor-pointer group relative"
                    onClick={() => setSelectedImage("/images/branch-agen.png")}
                  >
                    <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/10 rounded-2xl transition-colors flex items-center justify-center z-10">
                      <span className="bg-red-700 text-white px-4 py-2 rounded-full text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 shadow-lg">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                          ></path>
                        </svg>
                        Perbesar
                      </span>
                    </div>
                    <img
                      src="/images/branch-agen.png"
                      alt="Peta Branch & Agen"
                      className="w-full h-64 md:h-80 rounded-xl object-cover relative z-0"
                    />
                  </div>
                </div>

                <div className="flex flex-col items-center">
                  <h3 className="text-2xl font-bold mb-6 text-slate-800 border-b-4 border-red-600 pb-2">
                    Distribution / Trucking
                  </h3>
                  <div
                    className="corporate-glass p-2 rounded-2xl w-full hover-lift cursor-pointer group relative"
                    onClick={() =>
                      setSelectedImage("/images/distribution-route.png")
                    }
                  >
                    <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/10 rounded-2xl transition-colors flex items-center justify-center z-10">
                      <span className="bg-red-700 text-white px-4 py-2 rounded-full text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 shadow-lg">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                          ></path>
                        </svg>
                        Perbesar
                      </span>
                    </div>
                    <img
                      src="/images/distribution-route.png"
                      alt="Peta Rute Distribusi"
                      className="w-full h-64 md:h-80 rounded-xl object-cover relative z-0"
                    />
                  </div>
                </div>
              </div>
            </div>
          </AnimatedSection>

          {/* 5. OPERATIONAL FLOW CHART */}
          <AnimatedSection
            id="timeline"
            className="py-24 relative overflow-hidden bg-slate-50"
          >
            <div className="container mx-auto px-6 relative z-10">
              <div className="text-center mb-20">
                <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter">
                  OPERATIONAL <span className="text-red-700">FLOW CHART</span>
                </h2>
                <p className="text-slate-500 mt-4 text-lg font-medium">
                  Sistem alur kerja logistik terstruktur kami dari hulu ke
                  hilir.
                </p>
              </div>

              <div className="relative max-w-4xl mx-auto">
                <div className="absolute left-1/2 transform -translate-x-1/2 top-0 bottom-0 w-1 bg-slate-200 rounded-full">
                  <motion.div
                    className="w-full bg-red-600 shadow-[0_0_10px_#b71c1c]"
                    animate={{
                      height: ["0%", "100%", "0%"],
                      top: ["0%", "0%", "100%"],
                    }}
                    transition={{
                      duration: 6,
                      ease: "linear",
                      repeat: Infinity,
                    }}
                    style={{ position: "absolute" }}
                  />
                </div>

                {timelineNodes.map((node, idx) => (
                  <div
                    key={idx}
                    className={`relative flex items-center justify-between mb-16 ${node.align === "left" ? "flex-row-reverse" : ""}`}
                  >
                    <div className="w-5/12"></div>
                    <div className="w-2/12 flex justify-center relative">
                      <div className="w-6 h-6 rounded-full bg-white border-4 border-red-700 z-10 relative shadow-sm">
                        <motion.div
                          className="absolute inset-0 rounded-full bg-red-400"
                          animate={{
                            scale: [1, 1.8, 1],
                            opacity: [0.6, 0, 0.6],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            delay: idx * 0.4,
                          }}
                        />
                      </div>
                    </div>
                    <div
                      className={`w-5/12 ${node.align === "left" ? "text-right pr-8" : "text-left pl-8"}`}
                    >
                      <div className="corporate-glass p-6 rounded-2xl border-l-4 border-l-red-700 hover:-translate-y-2 transition-transform duration-300">
                        <span className="text-red-600 font-bold text-xs mb-2 block uppercase tracking-wider">
                          {node.entity}
                        </span>
                        <h4 className="text-xl font-black text-slate-900 mb-2 uppercase">
                          {node.title}
                        </h4>
                        <p className="text-slate-600 text-sm font-medium">
                          {node.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </AnimatedSection>

          {/* 6. CUSTOMER LIST */}
          <section className="py-20 bg-white border-y border-slate-200 overflow-hidden flex flex-col relative z-20 shadow-sm">
            <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>

            <div className="container mx-auto text-center mb-10 relative z-20">
              <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.3em]">
                Dipercaya Oleh
              </h3>
            </div>

            <div className="flex w-full overflow-hidden relative">
              <motion.div
                className="flex items-center w-max space-x-20 px-10"
                animate={{ x: ["0%", "-50%"] }}
                transition={{ ease: "linear", duration: 20, repeat: Infinity }}
              >
                {[...clientsList, ...clientsList].map((client, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-center w-48 h-24 grayscale hover:grayscale-0 transition-all duration-300 opacity-60 hover:opacity-100"
                  >
                    <img
                      src={client.logo}
                      alt={client.name}
                      className="max-h-16 max-w-full object-contain"
                    />
                  </div>
                ))}
              </motion.div>
            </div>

            <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>
          </section>

          {/* 7. KANTOR PUSAT */}
          <AnimatedSection
            id="lokasi"
            className="py-24 bg-slate-50 border-b border-slate-200"
          >
            <div className="container mx-auto px-6 z-10 relative text-center">
              <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tighter text-slate-900 uppercase">
                KANTOR <span className="text-red-700">PUSAT</span>
              </h2>
              <p className="text-slate-500 max-w-2xl mx-auto mb-12 text-lg font-medium">
                The Kensington Office Tower Lt.2 Ruang B2, Kelapa Gading Timur,
                Jakarta Utara.
              </p>

              <div className="corporate-glass p-2 rounded-[2rem] w-full max-w-6xl mx-auto h-[450px] overflow-hidden shadow-xl hover-lift relative bg-white">
                <iframe
                  src="https://maps.google.com/maps?q=The%20Kensington%20Office%20Tower,%20Kelapa%20Gading&t=&z=15&ie=UTF8&iwloc=&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="rounded-3xl"
                  title="Peta Lokasi PT. Agung Perkasa Logistics"
                ></iframe>
              </div>
            </div>
          </AnimatedSection>

          {/* 8. KONTAK SECTION */}
          <AnimatedSection
            id="kontak"
            className="py-32 relative overflow-hidden bg-white"
          >
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-96 bg-red-100 filter blur-[150px] z-0 pointer-events-none"></div>

            <div className="container mx-auto px-6 text-center z-10 relative corporate-glass max-w-4xl rounded-[3rem] py-20 border border-slate-200 shadow-2xl bg-white/90">
              <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tighter text-slate-900">
                KAMI SIAP <span className="text-red-700">MELAYANI ANDA.</span>
              </h2>
              <p className="text-slate-600 max-w-xl mx-auto mb-10 text-lg font-medium">
                Jangan ragu untuk berkonsultasi mengenai kebutuhan distribusi
                dan logistik perusahaan Anda bersama kami.
              </p>

              <div className="flex flex-col md:flex-row justify-center items-center gap-6">
                <MagneticWrapper>
                  <motion.a
                    href="https://wa.me/6281295377824"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-corporate-solid block text-lg px-10"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Hubungi via WhatsApp
                  </motion.a>
                </MagneticWrapper>
                <MagneticWrapper>
                  <motion.a
                    href="mailto:agungsaryanto.apljkt@gmail.com"
                    className="btn-corporate-outline block text-lg px-10"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Kirim Email
                  </motion.a>
                </MagneticWrapper>
              </div>
            </div>
          </AnimatedSection>
        </main>

        <Footer />

        {/* --- MODAL PETA LOKASI --- */}
        <AnimatePresence>
          {selectedImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-[99999] flex items-center justify-center bg-slate-900/90 p-4 md:p-10 backdrop-blur-sm"
              onClick={() => setSelectedImage(null)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="relative max-w-6xl w-full flex justify-center"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  className="absolute -top-12 right-0 md:-right-12 text-white/70 hover:text-white transition-colors bg-slate-800/50 hover:bg-red-600 rounded-full p-2"
                  onClick={() => setSelectedImage(null)}
                >
                  <svg
                    className="w-8 h-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    ></path>
                  </svg>
                </button>
                <img
                  src={selectedImage}
                  alt="Detail Jangkauan Layanan"
                  className="w-auto h-auto max-h-[85vh] max-w-full object-contain rounded-xl shadow-[0_0_50px_rgba(0,0,0,0.5)] border-4 border-white/10"
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* --- MODAL DETAIL LAYANAN DENGAN SLIDER GAMBAR --- */}
        <AnimatePresence>
          {selectedService && (
            <ServiceModal
              service={selectedService}
              onClose={() => setSelectedService(null)}
            />
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
