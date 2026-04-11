import React from "react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* KOLOM 1: PROFIL SINGKAT */}
          <div>
            <img
              src="/logo-apl.jpeg"
              alt="Logo APL"
              className="h-12 w-auto mb-6 rounded bg-white p-1"
            />
            <p className="text-slate-400 leading-relaxed font-medium">
              PT. Agung Perkasa Logistics (APL) hadir sebagai solusi logistik
              terpercaya sejak tahun 2022, melayani pengiriman kargo darat,
              laut, dan udara ke seluruh wilayah Indonesia.
            </p>
          </div>

          {/* KOLOM 2: NAVIGASI CEPAT (Disesuaikan dengan urutan section) */}
          <div>
            <h4 className="text-lg font-bold mb-6 border-l-4 border-red-600 pl-3">
              Navigasi
            </h4>
            <ul className="space-y-4 text-slate-400 font-medium">
              <li>
                <a
                  href="#beranda"
                  className="hover:text-red-500 transition-colors"
                >
                  Beranda
                </a>
              </li>
              <li>
                <a
                  href="#visimisi"
                  className="hover:text-red-500 transition-colors"
                >
                  Visi & Misi
                </a>
              </li>
              <li>
                <a
                  href="#layanan"
                  className="hover:text-red-500 transition-colors"
                >
                  Produk Layanan
                </a>
              </li>
              <li>
                <a
                  href="#network"
                  className="hover:text-red-500 transition-colors"
                >
                  Jangkauan Layanan
                </a>
              </li>
              <li>
                <a
                  href="#timeline"
                  className="hover:text-red-500 transition-colors"
                >
                  Alur Operasional
                </a>
              </li>
              <li>
                <a
                  href="#lokasi"
                  className="hover:text-red-500 transition-colors"
                >
                  Lokasi Kantor
                </a>
              </li>
            </ul>
          </div>

          {/* KOLOM 3: KONTAK RESMI & SOSIAL MEDIA */}
          <div>
            <h4 className="text-lg font-bold mb-6 border-l-4 border-red-600 pl-3">
              Kantor Pusat
            </h4>
            <ul className="space-y-4 text-slate-400 font-medium">
              <li className="flex items-start gap-3">
                <span className="text-red-500">📍</span>
                <span>
                  The Kensington Office Tower, Lt.2 Ruang B2 <br />
                  Kelapa Gading Timur, Jakarta Utara
                </span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-red-500">📞</span>
                <span>0812-9537-7824</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-red-500">✉️</span>
                <span className="break-all">
                  agungsaryanto.apljkt@gmail.com
                </span>
              </li>
              {/* INSTAGRAM SECTION */}
              <li className="flex items-center gap-3 pt-2">
                <span className="text-red-500">📸</span>
                <a
                  href="https://instagram.com/jasa_kiriman_murah_"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-red-500 transition-colors break-all"
                >
                  @jasa_kiriman_murah_
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* COPYRIGHT BORDER */}
        <div className="border-t border-slate-800 pt-8 text-center text-slate-500 text-sm font-bold tracking-wider">
          <p>
            &copy; {currentYear} PT. AGUNG PERKASA LOGISTICS. ALL RIGHTS
            RESERVED.
          </p>
        </div>
      </div>
    </footer>
  );
}
