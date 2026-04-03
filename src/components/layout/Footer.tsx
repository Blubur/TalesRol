import Link from 'next/link'

interface FooterProps {
  footerText?: string
}

export default function Footer({ footerText }: FooterProps) {
  const text = footerText || `© ${new Date().getFullYear()} — Plataforma de Roleplay`

  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-left">
          <span className="footer-logo">
            <span className="footer-symbol">✦</span>
            TalesRol
          </span>
          <span className="footer-copy">{text}</span>
        </div>
        <div className="footer-links">
          <Link href="/normas">Normas</Link>
          <Link href="/privacidad">Privacidad</Link>
          <Link href="/contacto">Contacto</Link>
        </div>
      </div>

      <style>{`
        .footer {
          border-top: 1px solid var(--border-subtle);
          background: var(--bg-secondary);
          margin-top: auto;
        }
        .footer-inner {
          max-width: 1280px;
          margin: 0 auto;
          padding: 1rem 1.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 0.75rem;
        }
        .footer-left {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .footer-logo {
          font-family: var(--font-cinzel);
          font-size: 0.85rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          color: var(--color-crimson);
          display: flex;
          align-items: center;
          gap: 0.3rem;
        }
        .footer-symbol { animation: flicker 3s infinite; }
        .footer-copy {
          font-size: 0.78rem;
          color: var(--text-muted);
        }
        .footer-links {
          display: flex;
          gap: 1.25rem;
        }
        .footer-links a {
          font-size: 0.78rem;
          color: var(--text-muted);
          text-decoration: none;
          font-family: var(--font-cinzel);
          letter-spacing: 0.05em;
          transition: color 0.2s;
        }
        .footer-links a:hover { color: var(--color-crimson); }
        @keyframes flicker {
          0%,100% { opacity: 1; }
          50% { opacity: 0.75; }
        }
      `}</style>
    </footer>
  )
}