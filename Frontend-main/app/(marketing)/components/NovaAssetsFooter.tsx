import Link from "next/link";

export default function NovaAssetsFooter() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-col">
          <h3>NovaAssets</h3>
          <p>
            Drawing on a legacy of decades of expertise in solar inverter repair, NovaAssets is
            committed to redefining energy solutions for a sustainable future with its range of
            intelligent and highly efficient hybrid inverters.
          </p>
          <div className="footer-social">
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

        <div className="footer-col">
          <h4>Useful Links</h4>
          <Link href="/">Home</Link>
          <button type="button">Career</button>
          <Link href="/contact">Contact Us</Link>
          <button type="button">Privacy Policy</button>
        </div>

        <div className="footer-col">
          <h4>Our Products</h4>
          <Link href="/products/single-phase">SP Series</Link>
          <Link href="/products/three-phase">TP-L Series</Link>
          <Link href="/products/three-phase">TP-H Series</Link>
        </div>

        <div className="footer-col">
          <h4>Reach Us</h4>
          <p>
            A-109Y
            <br />
            Sector 80, Noida
            <br />
            Uttar Pradesh - 201305
          </p>
          <p>
            <strong>Phone:</strong> +91-95402 63987, +91-98711 25102
          </p>
          <p>
            <strong>e-Mail:</strong> info@avavbusiness.com
          </p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>
          © Copyright <strong>NovaAssets</strong> All Rights Reserved
        </p>
        <p>
          Born from <strong>AVAV Business Consulting Pvt Ltd</strong> · Evolved, Energized,
          Unstoppable
        </p>
      </div>
    </footer>
  );
}

