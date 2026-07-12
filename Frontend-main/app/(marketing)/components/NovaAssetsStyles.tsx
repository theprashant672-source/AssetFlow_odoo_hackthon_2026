const css = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --teal: #18bfae;
    --teal-dark: #0f9488;
    --teal-soft: rgba(24,191,174,0.1);
    --teal-glow: rgba(24,191,174,0.18);
    --orange: #18bfae;
    --dark: #113f56;
    --dark2: #0d5c75;
    --page-edge: var(--dark2);
    --text: #2d2d2d;
    --text-light: #666;
    --bg: #f8f9fa;
    --white: #fff;
    --border: #e0e0e0;
    --shadow: 0 4px 24px rgba(0,0,0,0.08);
    --radius: 12px;
    --font-heading: 'Georgia', serif;
    --font-body: 'Segoe UI', system-ui, sans-serif;
  }
  html { scroll-behavior: smooth; }
  body { font-family: var(--font-body); color: var(--text); background: var(--bg); }
  /* Prevent accidental horizontal panning on iOS when any child overflows by a few px */
  body { overflow-x: clip; }

  /* TOP BAR */
  .topbar { background: var(--teal-dark); color: #e8fffb; font-size: 12px; padding: 6px 40px; display: flex; justify-content: space-between; align-items: center; gap: 16px; flex-wrap: wrap; }
  .topbar-left { display: flex; gap: 20px; }
  .topbar-right { display: flex; gap: 10px; }
  .topbar-right a { color: #e8fffb; text-decoration: none; font-size: 12px; }

  /* NAVBAR */
  .navbar { position: sticky; top: 0; z-index: 100; background: var(--white); border-bottom: 1px solid var(--border); transition: box-shadow 0.3s; }
  .navbar--scrolled { box-shadow: 0 2px 20px rgba(0,0,0,0.12); }
  .nav-inner { max-width: 1200px; margin: 0 auto; padding: 12px 24px; display: flex; align-items: center; justify-content: space-between; }
  .logo-btn { background: none; border: none; cursor: pointer; display: flex; align-items: center; gap: 12px; text-decoration: none; }
  .sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0; }
  .logo-image { position: relative; width: 78px; height: 56px; display: block; overflow: hidden; border-radius: 10px; }
  .logo-text { text-align: left; }
  .logo-brand { display: block; font-size: 20px; font-weight: 900; color: #0f172a; letter-spacing: 1.2px; line-height: 1.05; }
  .logo-tagline { display: block; font-size: 12px; color: #334155; letter-spacing: 0.4px; font-weight: 600; margin-top: 3px; }
  .nav-links { display: flex; align-items: center; gap: 4px; }
  .nav-link { background: none; border: none; cursor: pointer; padding: 8px 14px; font-size: 14px; font-weight: 500; color: var(--text); border-radius: 6px; transition: all 0.2s; text-decoration: none; display: inline-flex; align-items: center; }
  .nav-link:hover { color: var(--teal-dark); background: var(--teal-soft); }
  .nav-link--active { color: white; background: var(--teal); }
  .nav-link--cta { background: var(--teal); color: white !important; padding: 8px 20px; border-radius: 6px; font-weight: 600; }
  .nav-link--cta:hover { background: var(--teal-dark) !important; }
  .nav-dropdown { position: relative; }
  .nav-dropdown:hover > .dropdown-menu { display: flex; }
  .dropdown-menu { display: none; position: absolute; top: 100%; left: 0; background: white; border: 1px solid var(--border); border-radius: 8px; box-shadow: var(--shadow); flex-direction: column; min-width: 220px; overflow: visible; }
  .dropdown-menu a, .dropdown-menu button { background: none; border: none; cursor: pointer; padding: 12px 16px; text-align: left; font-size: 13px; color: var(--text); transition: background 0.15s; text-decoration: none; width: 100%; }
  .dropdown-menu a:hover, .dropdown-menu button:hover { background: var(--teal-soft); color: var(--teal-dark); }
  .dropdown-menu--open { display: flex; }
  .dropdown-sub { position: relative; }
  .dropdown-sub:hover > .dropdown-menu--sub { display: flex; }
  .dropdown-sub__trigger { display: flex; align-items: center; justify-content: space-between; gap: 10px; }
  .dropdown-menu--sub { top: 0; left: auto; right: 100%; min-width: 240px; }
  .hamburger { display: none; flex-direction: column; gap: 5px; background: none; border: none; cursor: pointer; padding: 4px; }
  .hamburger span { display: block; width: 22px; height: 2px; background: var(--dark); border-radius: 2px; }

  /* SECTIONS */
  .section { max-width: 1200px; margin: 0 auto; padding: 64px 24px; }
  .page-hero { background: linear-gradient(135deg, #f0fafa 0%, #e8f4f1 100%); padding: 48px 24px; text-align: center; }

  /* SECTION HEADING */
  .section-heading { text-align: center; margin-bottom: 48px; }
  .section-heading__line { display: flex; align-items: center; justify-content: center; gap: 16px; margin-bottom: 10px; }
  .section-heading__line h2 { font-size: 28px; font-weight: 700; color: var(--dark); white-space: nowrap; }
  .line-dash { flex: 1; max-width: 60px; height: 2px; background: var(--teal); border-radius: 1px; }
  .section-heading__sub { color: var(--text-light); font-size: 15px; }

  /* HERO */
  .hero { position: relative; min-height: 620px; background: linear-gradient(135deg, var(--dark2) 0%, var(--dark) 100%); overflow: hidden; padding: 76px 24px; }
  .hero-bg { position: absolute; inset: 0; background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2318bfae' fill-opacity='0.07'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E"); }
  .hero-inner { position: relative; z-index: 2; max-width: 1840px; margin: 0 auto; width: 100%; display: grid; grid-template-columns: minmax(300px, 0.55fr) minmax(980px, 3.45fr); align-items: center; gap: 28px; }
  .hero-content { text-align: left; max-width: 520px; }
  .hero-title { font-size: clamp(28px, 5vw, 48px); font-weight: 800; color: white; line-height: 1.15; margin-bottom: 16px; }
  .hero-title span { color: var(--teal); }
  .hero-sub { color: rgba(255,255,255,0.7); font-size: 16px; margin-bottom: 32px; }
  .hero-mockup { display: flex; justify-content: flex-end; }
  .hero-image { width: min(135%, 1320px); aspect-ratio: 1643 / 640; overflow: hidden; border-radius: 18px; box-shadow: 0 26px 90px rgba(0,0,0,0.45); border: 1px solid rgba(255,255,255,0.12); background: rgba(255,255,255,0.04); }
  .hero-image img { width: 100%; height: 100%; object-fit: cover; object-position: 55% 50%; display: block; transform: translateZ(0); }
  .mockup-card { background: rgba(255,255,255,0.08); backdrop-filter: blur(12px); border: 1px solid rgba(255,255,255,0.15); border-radius: var(--radius); padding: 20px 24px; min-width: 200px; }
  .mockup-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; gap: 24px; }
  .m-label { color: rgba(255,255,255,0.6); font-size: 12px; }
  .m-value { color: white; font-weight: 700; font-size: 16px; }
  .m-value.accent { color: var(--teal); }
  .mockup-efficiency { text-align: center; color: var(--orange); font-size: 13px; font-weight: 600; margin-top: 8px; }
  .hero-actions { display: flex; gap: 12px; flex-wrap: wrap; }

  /* BUTTONS */
  .btn-primary { background: var(--teal); color: white; border: none; cursor: pointer; padding: 12px 28px; border-radius: 6px; font-size: 14px; font-weight: 600; transition: all 0.2s; letter-spacing: 0.3px; text-decoration: none; display: inline-flex; align-items: center; justify-content: center; }
  .btn-primary:hover { background: var(--teal-dark); transform: translateY(-1px); }
  .btn-outline { display: inline-flex; align-items: center; justify-content: center; border: 2px solid var(--teal); color: var(--teal); padding: 10px 24px; border-radius: 6px; font-size: 14px; font-weight: 600; text-decoration: none; transition: all 0.2s; background: transparent; }
  .btn-outline:hover { background: var(--teal); color: white; }

  /* FOUNDATION */
  .foundation-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 48px; align-items: center; }
  .foundation-text h3.brand-name { font-size: 22px; font-weight: 800; color: var(--dark); }
  .brand-tag { color: var(--teal); font-size: 13px; font-weight: 600; margin: 2px 0 4px; }
  .brand-sub { color: var(--text-light); font-size: 13px; margin-bottom: 20px; }
  .foundation-list { list-style: none; display: flex; flex-direction: column; gap: 14px; margin-bottom: 28px; }
  .foundation-list li { display: flex; gap: 10px; align-items: flex-start; font-size: 13.5px; line-height: 1.6; }
  .foundation-image { display: flex; justify-content: center; }
  .foundation-photo { width: 100%; max-width: 420px; aspect-ratio: 1 / 1; border-radius: var(--radius); background: linear-gradient(135deg, #e8f5f2, #d4ede9); border: 1px solid var(--border); box-shadow: var(--shadow); display: flex; align-items: center; justify-content: center; padding: 18px; overflow: hidden; }
  .foundation-photo img { width: 100%; height: 100%; object-fit: contain; display: block; }
  .img-placeholder { width: 100%; max-width: 420px; height: 280px; background: linear-gradient(135deg, #e8f5f2, #d4ede9); border-radius: var(--radius); display: flex; flex-direction: column; align-items: center; justify-content: center; font-size: 48px; color: var(--teal); border: 2px dashed var(--teal); }
  .img-placeholder small { font-size: 13px; color: var(--text-light); margin-top: 8px; }
  .img-placeholder--house { font-size: 60px; }

  /* PRODUCT CARDS */
  .products-preview { padding-top: 0; }
  .product-cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
  .product-card { background: white; border-radius: var(--radius); border: 1px solid var(--border); padding: 24px; cursor: pointer; transition: all 0.25s; box-shadow: var(--shadow); text-decoration: none; display: block; }
  .product-card:hover { transform: translateY(-4px); box-shadow: 0 12px 40px rgba(24,191,174,0.15); border-color: var(--teal); }
  .product-card__img { position: relative; height: 260px; border-radius: 14px; margin-bottom: 14px; background: linear-gradient(135deg, #fbfbfc, #f3f4f6); border: 1px solid rgba(0,0,0,0.06); overflow: hidden; }
  .product-card__img img { padding: 6px; box-sizing: border-box; transition: transform 0.25s ease; }
  .product-card:hover .product-card__img img { transform: scale(1.03); }
  .product-card h4 { font-size: 15px; font-weight: 700; color: var(--dark); margin-bottom: 4px; }
  .product-card__range { font-size: 12px; color: var(--teal); font-weight: 600; margin-bottom: 14px; }
  .product-card ul { list-style: none; display: flex; flex-direction: column; gap: 7px; }
  .product-card li { font-size: 12.5px; display: flex; align-items: center; gap: 6px; color: var(--text-light); }

  /* TRUSTED */
  .trusted { background: linear-gradient(135deg, rgba(24,191,174,0.42) 0%, rgba(109,216,203,0.68) 100%); max-width: 100%; padding: 72px 24px; border-top: 1px solid rgba(24,191,174,0.22); border-bottom: 1px solid rgba(24,191,174,0.22); }
  .partners-marquee { max-width: 1200px; margin: 0 auto; }
  .marquee { position: relative; overflow: hidden; padding: 10px 6px; }
  .marquee::before, .marquee::after { content: ""; position: absolute; top: 0; bottom: 0; width: 64px; z-index: 2; pointer-events: none; }
  .marquee::before { left: 0; background: linear-gradient(to right, rgba(24,191,174,0.5), rgba(24,191,174,0.0)); }
  .marquee::after { right: 0; background: linear-gradient(to left, rgba(24,191,174,0.5), rgba(24,191,174,0.0)); }
  .marquee-track { display: flex; align-items: center; gap: 18px; width: max-content; animation: partners-marquee 28s linear infinite; }
  .marquee:hover .marquee-track { animation-play-state: paused; }
  .partner-card { position: relative; background: rgba(255,255,255,0.92); border: 1px solid rgba(0,0,0,0.08); border-radius: 16px; box-shadow: 0 10px 26px rgba(0,0,0,0.08); backdrop-filter: blur(6px); width: 220px; height: 92px; padding: 14px 18px; overflow: hidden; user-select: none; transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease; }
  .partner-card:hover { transform: translateY(-1px); box-shadow: 0 14px 34px rgba(24,191,174,0.22); border-color: rgba(24,191,174,0.45); }

  @keyframes partners-marquee {
    from { transform: translateX(0); }
    to { transform: translateX(-50%); }
  }

  @media (prefers-reduced-motion: reduce) {
    .marquee { overflow-x: auto; }
    .marquee-track { animation: none; padding-bottom: 6px; }
  }

  /* CORE */
  .core-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
  .core-card { background: white; border-radius: var(--radius); border: 1px solid var(--border); padding: 24px 20px; transition: all 0.2s; }
  .core-card:hover { border-color: var(--teal); box-shadow: 0 8px 24px rgba(24,191,174,0.12); }
  .core-card__icon { font-size: 28px; display: block; margin-bottom: 12px; }
  .core-card h4 { font-size: 15px; font-weight: 700; color: var(--dark); margin-bottom: 8px; }
  .core-card p { font-size: 13px; color: var(--text-light); line-height: 1.6; }

  /* ABOUT */
  .about-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 48px; align-items: center; }
  .about-block--reverse .about-grid { direction: rtl; }
  .about-block--reverse .about-grid > * { direction: ltr; }
  .about-text h3 { font-size: 24px; font-weight: 700; color: var(--dark); margin-bottom: 12px; }
  .about-intro { font-size: 13.5px; color: var(--text-light); line-height: 1.7; margin-bottom: 20px; }
  .about-list { list-style: none; display: flex; flex-direction: column; gap: 12px; margin-bottom: 24px; }
  .about-list li { display: flex; gap: 10px; align-items: flex-start; font-size: 13.5px; line-height: 1.6; }
  .about-image { display: flex; justify-content: center; }
  .about-photo { position: relative; width: 100%; max-width: 560px; height: 340px; border-radius: var(--radius); background: linear-gradient(135deg, #e8f5f2, #d4ede9); border: 1px solid var(--border); box-shadow: var(--shadow); overflow: hidden; }

  /* STATS */
  .stats-bar { background: var(--bg); padding: 48px 24px; max-width: 100%; display: flex; justify-content: center; gap: 0; flex-wrap: wrap; border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); }
  .stat-item { flex: 1; min-width: 180px; max-width: 260px; text-align: center; padding: 24px; }
  .stat-num { display: block; font-size: 40px; font-weight: 800; color: var(--dark); }
  .stat-label { display: block; font-size: 14px; font-weight: 600; color: var(--teal); margin: 4px 0; }
  .stat-sub { display: block; font-size: 12px; color: var(--text-light); }

  /* TEAM */
  .team-grid { max-width: 980px; margin: 0 auto; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 32px; }
  .team-card { background: white; border-radius: var(--radius); border: 1px solid var(--border); overflow: hidden; box-shadow: var(--shadow); }
  .team-photo { position: relative; width: 100%; aspect-ratio: 1 / 1; background: #f8fafc; }
  .team-photo img { transition: transform 0.35s ease, filter 0.25s ease; will-change: transform; }
  .team-overlay { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 28px 22px; background: radial-gradient(circle at 50% 45%, rgba(2,6,23,0.55), rgba(2,6,23,0.32) 60%, rgba(2,6,23,0.18)); opacity: 0; transition: opacity 0.25s ease; backdrop-filter: blur(2px); }
  .team-name { color: white; font-size: 18px; font-weight: 900; margin-bottom: 6px; text-shadow: 0 2px 16px rgba(0,0,0,0.55); }
  .team-role { color: rgba(255,255,255,0.92); font-size: 12.5px; font-weight: 700; letter-spacing: 0.2px; text-shadow: 0 2px 14px rgba(0,0,0,0.55); }
  .team-card:hover .team-overlay { opacity: 1; }
  .team-card:hover .team-photo img { filter: brightness(0.72) contrast(1.06); transform: scale(1.01); }
  .team-card:focus-within .team-overlay { opacity: 1; }

  @media (max-width: 900px) {
    .team-grid { grid-template-columns: 1fr; max-width: 760px; }
  }

  /* CTA BANNER */
  .cta-banner { background: linear-gradient(135deg, var(--dark) 0%, var(--dark2) 100%); padding: 64px 24px; text-align: center; }
  .cta-banner h2 { font-size: 28px; font-weight: 700; color: white; margin-bottom: 12px; }
  .cta-banner p { color: rgba(255,255,255,0.7); font-size: 15px; max-width: 560px; margin: 0 auto 28px; line-height: 1.6; }

  /* PRODUCT PAGE */
  .product-intro-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 48px; align-items: center; }
  .product-series-title { font-size: 26px; font-weight: 800; color: var(--dark); margin-bottom: 4px; }
  .product-series-sub { font-size: 13px; color: var(--teal); font-weight: 600; margin-bottom: 20px; }
  .product-image { display: flex; justify-content: center; }
  .product-photo { position: relative; width: 100%; max-width: 560px; height: 360px; border-radius: var(--radius); background: linear-gradient(135deg, #e8f5f2, #d4ede9); border: 1px solid var(--border); box-shadow: var(--shadow); overflow: hidden; }
  .product-photo img { padding: 10px; box-sizing: border-box; }
  .product-photo--large { max-width: 620px; height: 400px; }
  .tab-toggle { display: flex; gap: 8px; margin-bottom: 20px; flex-wrap: wrap; }
  .tab-btn { background: var(--bg); border: 1px solid var(--border); border-radius: 6px; padding: 8px 18px; font-size: 13px; font-weight: 600; cursor: pointer; color: var(--text); transition: all 0.2s; }
  .tab-btn--active { background: var(--teal); color: white; border-color: var(--teal); }

  /* SPEC TABLE */
  .spec-table-wrapper { overflow-x: auto; border-radius: var(--radius); border: 1px solid var(--border); background: white; box-shadow: var(--shadow); }
  .spec-table { width: 100%; border-collapse: collapse; font-size: 12.5px; }
  .spec-table th { background: var(--dark); color: white; padding: 12px 14px; text-align: center; font-weight: 600; white-space: nowrap; }
  .spec-table th:first-child { text-align: left; }
  .spec-section-row td { background: rgba(24,191,174,0.09); color: var(--teal-dark); font-weight: 700; padding: 10px 14px; font-size: 13px; border-top: 2px solid rgba(24,191,174,0.22); }
  .spec-label { padding: 10px 14px; color: var(--text); border-bottom: 1px solid var(--border); font-weight: 500; white-space: nowrap; background: white; }
  .spec-val { padding: 10px 14px; text-align: center; color: var(--text-light); border-bottom: 1px solid var(--border); border-left: 1px solid var(--border); }
  .spec-val--span { text-align: left; padding-left: 14px; }
  .spec-table tr:hover td { background: rgba(24,191,174,0.04); }

  /* CONTACT */
  .contact-section { max-width: 1100px; }
  .contact-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; margin-bottom: 40px; }
  .contact-info { display: flex; flex-direction: column; gap: 16px; }
  .contact-info-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .info-card { background: white; border: 1px solid var(--border); border-radius: var(--radius); padding: 20px; display: flex; align-items: flex-start; gap: 14px; box-shadow: var(--shadow); }
  .info-icon { font-size: 22px; color: var(--teal); flex-shrink: 0; }
  .info-card h4 { font-size: 14px; font-weight: 700; color: var(--dark); margin-bottom: 6px; }
  .info-card p { font-size: 13px; color: var(--text-light); line-height: 1.6; }
  .contact-form { background: white; border-radius: var(--radius); border: 1px solid var(--border); padding: 28px; box-shadow: var(--shadow); display: flex; flex-direction: column; gap: 14px; }
  .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
  .form-input { width: 100%; border: 1px solid var(--border); border-radius: 6px; padding: 11px 14px; font-size: 14px; outline: none; transition: border-color 0.2s; background: var(--bg); }
  .form-input:focus { border-color: var(--teal); background: white; }
  .form-textarea { width: 100%; border: 1px solid var(--border); border-radius: 6px; padding: 11px 14px; font-size: 14px; outline: none; resize: vertical; font-family: var(--font-body); transition: border-color 0.2s; background: var(--bg); }
  .form-textarea:focus { border-color: var(--teal); background: white; }
  .form-success { text-align: center; padding: 40px 20px; }
  .form-success span { font-size: 48px; display: block; margin-bottom: 16px; }
  .form-success h3 { font-size: 22px; font-weight: 700; color: var(--dark); margin-bottom: 8px; }
  .form-success p { color: var(--text-light); }
  .map-placeholder { background: linear-gradient(135deg, #e8f5f2, #d4ede9); border-radius: var(--radius); height: 250px; display: flex; align-items: center; justify-content: center; border: 1px solid var(--border); }
  .map-inner { text-align: center; }
  .map-inner span { font-size: 40px; display: block; margin-bottom: 10px; }
  .map-inner p { color: var(--text-light); font-size: 14px; margin-bottom: 14px; }

  /* ICONS */
  .icon { font-style: normal; flex-shrink: 0; font-size: 14px; }
  .icon--check { color: var(--teal); }
  .icon--bolt { color: var(--orange); }
  .icon--star { color: var(--orange); }
  .icon--shield { color: var(--teal); }
  .icon--warn { color: #e5a317; }
  .icon--phone { color: var(--teal); }

  /* FOOTER */
  .footer { background: var(--dark); color: rgba(255,255,255,0.75); }
  .footer-inner { max-width: 1200px; margin: 0 auto; padding: 56px 24px 40px; display: grid; grid-template-columns: 2fr 1fr 1fr 1.5fr; gap: 32px; }
  .footer-col h3 { color: white; font-size: 18px; font-weight: 700; margin-bottom: 14px; }
  .footer-col h4 { color: white; font-size: 14px; font-weight: 700; margin-bottom: 14px; text-transform: uppercase; letter-spacing: 0.5px; }
  .footer-col p { font-size: 13px; line-height: 1.7; margin-bottom: 8px; }
  .footer-col button, .footer-col a { display: block; background: none; border: none; cursor: pointer; color: rgba(255,255,255,0.65); font-size: 13px; margin-bottom: 8px; padding: 0; transition: color 0.2s; text-align: left; text-decoration: none; }
  .footer-col button:hover, .footer-col a:hover { color: var(--teal); }
  .footer-social { display: flex; gap: 10px; margin-top: 14px; }
  .footer-social a { background: rgba(255,255,255,0.1); color: white; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; text-decoration: none; transition: background 0.2s; }
  .footer-social a:hover { background: var(--teal); }
  .footer-bottom { border-top: 1px solid rgba(255,255,255,0.1); padding: 20px 24px; text-align: center; }
  .footer-bottom p { font-size: 12px; color: rgba(255,255,255,0.5); margin-bottom: 4px; }
  .footer-bottom strong { color: rgba(255,255,255,0.75); }

  /* RESPONSIVE */
  @media (max-width: 900px) {
    .foundation-grid, .about-grid, .product-intro-grid, .contact-grid { grid-template-columns: 1fr; }
    .about-block--reverse .about-grid { direction: ltr; }
    .core-grid { grid-template-columns: repeat(2, 1fr); }
    .product-cards { grid-template-columns: 1fr; }
    .product-card__img { height: 280px; }
    .about-photo { max-width: 720px; height: 360px; }
    .product-photo { max-width: 720px; height: 400px; }
    .product-photo--large { max-width: 760px; height: 440px; }
    .footer-inner { grid-template-columns: 1fr 1fr; }
    .hero-inner { grid-template-columns: 1fr; text-align: center; gap: 32px; }
    .hero-content { text-align: center; margin: 0 auto; }
    .hero-mockup { justify-content: center; width: 100%; }
    .hero-image { width: min(960px, 94vw); aspect-ratio: 16 / 9; margin-inline: auto; }
    .hero-actions { justify-content: center; }
    .partner-card { width: 200px; height: 86px; }
  }
  @media (max-width: 600px) {
    /* Mobile: don't force full-viewport hero (creates extra empty space on iOS) */
    .hero { min-height: 0; padding: 24px 16px calc(12px + env(safe-area-inset-bottom)); }
    .hero-inner { gap: 18px; }
    .hero-sub { margin-bottom: 18px; }
    .hero-actions { margin-bottom: 0px; }
    .hero-image { width: 100%; max-width: 100%; }
    .hero-mockup { align-items: center; }
    .nav-links { display: none; flex-direction: column; position: absolute; top: 100%; left: 0; right: 0; background: white; border-bottom: 1px solid var(--border); padding: 16px; gap: 4px; box-shadow: var(--shadow); }
    .nav-links--open { display: flex; }
    .navbar { position: sticky; }
    .nav-inner { position: relative; }
    .hamburger { display: flex; }
    /* Mobile: keep header compact */
    .topbar { display: none; }
    .nav-inner { padding: 10px 14px; }
    .logo-btn { gap: 10px; }
    .logo-image { width: 56px; height: 40px; border-radius: 9px; }
    .logo-brand { font-size: 16px; letter-spacing: 1px; }
    .logo-tagline { font-size: 10px; }
    .hamburger { padding: 8px; border-radius: 10px; }
    .hamburger:hover { background: var(--teal-soft); }

    /* Mobile dropdowns should expand inline (no hover) */
    .nav-dropdown:hover > .dropdown-menu { display: none; }
    .nav-dropdown .dropdown-menu.dropdown-menu--open { display: flex; }
    .dropdown-sub:hover > .dropdown-menu--sub { display: none; }
    .dropdown-menu { position: static; min-width: unset; width: 100%; border-radius: 12px; margin-top: 6px; box-shadow: none; }
    .dropdown-menu a, .dropdown-menu button { padding: 10px 12px; border-radius: 10px; }
    .dropdown-menu--sub { position: static; right: auto; left: auto; top: auto; }
    .core-grid { grid-template-columns: 1fr; }
    .footer-inner { grid-template-columns: 1fr; }
    .stats-bar { flex-direction: column; align-items: center; }
    .form-row { grid-template-columns: 1fr; }
    .contact-info-row { grid-template-columns: 1fr; }
    .marquee::before, .marquee::after { width: 40px; }
    .partner-card { width: 180px; height: 78px; }
    /* iPhone/retina: avoid moiré from tiny SVG pattern */
    .hero-bg { display: none !important; background: none !important; }
    /* Hero image: shift crop so inverter is centered on small screens */
    .hero-image img { object-position: 5% 50%; }
  }
`;

export default function NovaAssetsStyles() {
  return <style>{css}</style>;
}
