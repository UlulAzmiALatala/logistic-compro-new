import React from "react";
import { createRoot } from "react-dom/client";
import { LazyMotion, domAnimation } from "framer-motion";
import { HelmetProvider } from "react-helmet-async";

// Import halaman Home yang nanti akan kita buat
import Home from "./Pages/Home";

// CSS Utama (Tailwind) yang sudah kita set di Langkah 2
import "./index.css";

// CSS untuk Slider
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Vite default-nya menggunakan ID 'root', bukan 'app' seperti Laravel
const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <HelmetProvider>
      <LazyMotion features={domAnimation}>
        <Home />
      </LazyMotion>
    </HelmetProvider>
  </React.StrictMode>,
);
