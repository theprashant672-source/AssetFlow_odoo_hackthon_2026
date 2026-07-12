"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

function isProductsPath(pathname: string) {
  return pathname === "/products" || pathname.startsWith("/products/");
}

export default function NovaAssetsNavbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const [downloadsOpen, setDownloadsOpen] = useState(false);
  const [datasheetOpen, setDatasheetOpen] = useState(false);
  const [hoverSupported, setHoverSupported] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    handler();
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    const media = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setHoverSupported(media.matches);
    update();

    if (typeof media.addEventListener === "function") {
      media.addEventListener("change", update);
      return () => media.removeEventListener("change", update);
    }

    media.addListener(update);
    return () => media.removeListener(update);
  }, []);

  const closeAllMenus = () => {
    setMenuOpen(false);
    setProductsOpen(false);
    setDownloadsOpen(false);
    setDatasheetOpen(false);
  };

  const activeHome = pathname === "/";
  const activeAbout = pathname === "/about";
  const activeProducts = isProductsPath(pathname);
  const activeContact = pathname === "/contact";
  const activeSupport = pathname === "/support";

  return (
    <>
      <div className="topbar">
        <div className="topbar-left">
          <span>✉ info@avavbusiness.com</span>
          <span>📞 +91 95402 63987</span>
          <span>📞 +91 98711 25102</span>
        </div>
        <div className="topbar-right">
          <a href="#" aria-label="Facebook">
            f
          </a>
          <a href="#" aria-label="Instagram">
            ig
          </a>
          <a href="#" aria-label="LinkedIn">
            in
          </a>
        </div>
      </div>

      <nav className={`navbar ${scrolled ? "navbar--scrolled" : ""}`}>
        <div className="nav-inner">
          <Link className="logo-btn" href="/" aria-label="Go to home">
            <span className="sr-only">NovaAssets - Your Power Partner</span>
            <span className="logo-image" aria-hidden="true">
              <Image
                src="/novaassets_logo.webp"
                alt=""
                fill
                sizes="220px"
                priority
                style={{ objectFit: "cover", objectPosition: "left center" }}
              />
            </span>
            <div className="logo-text">
              <span className="logo-brand">NovaAssets</span>
              <span className="logo-tagline">Your Power Partner</span>
            </div>
          </Link>

          <button
            className="hamburger"
            type="button"
            aria-label="Open menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span />
            <span />
            <span />
          </button>

          <div className={`nav-links ${menuOpen ? "nav-links--open" : ""}`}>
            <Link
              className={`nav-link ${activeHome ? "nav-link--active" : ""}`}
              href="/"
              onClick={closeAllMenus}
            >
              Home
            </Link>
            <Link
              className={`nav-link ${activeAbout ? "nav-link--active" : ""}`}
              href="/about"
              onClick={closeAllMenus}
            >
              About Us
            </Link>

            <div className="nav-dropdown">
              <button
                className={`nav-link ${activeProducts ? "nav-link--active" : ""}`}
                type="button"
                aria-haspopup="menu"
                aria-expanded={productsOpen}
                onClick={() =>
                  setProductsOpen((v) => {
                    const next = !v;
                    if (next) {
                      setDownloadsOpen(false);
                      setDatasheetOpen(false);
                    }
                    return next;
                  })
                }
              >
                Products ▾
              </button>
              <div className={`dropdown-menu ${productsOpen ? "dropdown-menu--open" : ""}`} role="menu">
                <Link role="menuitem" href="/products" onClick={closeAllMenus}>
                  View All Products
                </Link>
                <Link role="menuitem" href="/products/single-phase" onClick={closeAllMenus}>
                  SP Series (Single Phase)
                </Link>
                <Link role="menuitem" href="/products/three-phase" onClick={closeAllMenus}>
                  TP-L / TP-H Series (Three Phase)
                </Link>
              </div>
            </div>

            <div
              className="nav-dropdown"
              onMouseLeave={() => {
                setDownloadsOpen(false);
                setDatasheetOpen(false);
              }}
            >
              <button
                className="nav-link"
                type="button"
                aria-haspopup="menu"
                aria-expanded={downloadsOpen}
                onClick={() => {
                  setProductsOpen(false);
                  setDownloadsOpen((v) => {
                    const next = !v;
                    setDatasheetOpen(false);
                    return next;
                  });
                }}
              >
                Downloads ▾
              </button>
              <div className={`dropdown-menu ${downloadsOpen ? "dropdown-menu--open" : ""}`} role="menu">
                <a
                  role="menuitem"
                  href="/product_catalogue.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={closeAllMenus}
                >
                  Products Catalogue
                </a>

                <div
                  className="dropdown-sub"
                  onMouseEnter={() => {
                    if (hoverSupported) setDatasheetOpen(true);
                  }}
                  onMouseLeave={() => {
                    if (hoverSupported) setDatasheetOpen(false);
                  }}
                >
                  <button
                    className="dropdown-sub__trigger"
                    type="button"
                    aria-haspopup="menu"
                    aria-expanded={datasheetOpen}
                    onClick={() => {
                      if (!hoverSupported) setDatasheetOpen((v) => !v);
                    }}
                  >
                    Products Datasheet ▸
                  </button>
                  <div
                    className={`dropdown-menu dropdown-menu--sub ${
                      datasheetOpen ? "dropdown-menu--open" : ""
                    }`}
                    role="menu"
                  >
                    <a
                      role="menuitem"
                      href="/SP_DataSheet.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={closeAllMenus}
                    >
                      NovaAssets SP Series
                    </a>
                    <a
                      role="menuitem"
                      href="/TPL_DataSheet.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={closeAllMenus}
                    >
                      NovaAssets TP-L Series
                    </a>
                    <a
                      role="menuitem"
                      href="/TPH_DataSheet.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={closeAllMenus}
                    >
                      NovaAssets TP-H Series
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <Link
              className={`nav-link ${activeSupport ? "nav-link--active" : ""}`}
              href="/support"
              onClick={closeAllMenus}
            >
              Support
            </Link>
            <Link
              className={`nav-link nav-link--cta ${activeContact ? "nav-link--active" : ""}`}
              href="/contact"
              onClick={closeAllMenus}
            >
              Contact
            </Link>
          </div>
        </div>
      </nav>
    </>
  );
}
