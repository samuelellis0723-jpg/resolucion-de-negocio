import { Link } from 'react-router-dom';

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <Link className="brand-lockup brand-lockup--footer" to="/">
        <span className="brand-symbol" aria-hidden="true"><span /></span>
        <span>sol de casa</span>
      </Link>
      <p>Prototipo educativo de un caso ficticio. No representa una oferta comercial.</p>
      <span className="footer-year">Caso Sol de Casa</span>
    </footer>
  );
}
