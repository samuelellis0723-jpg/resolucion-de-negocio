import { Link, NavLink } from 'react-router-dom';

export function SiteHeader() {
  return (
    <header className="site-header">
      <Link className="brand-lockup" to="/" aria-label="Sol de Casa, inicio">
        <span className="brand-symbol" aria-hidden="true"><span /></span>
        <span>sol de casa</span>
      </Link>
      <nav className="main-nav" aria-label="Navegación principal">
        <a href="/#como-funciona">Cómo funciona</a>
        <NavLink to="/calculadora">Calculadora</NavLink>
        <NavLink to="/simulador-caja">Caja 24 meses</NavLink>
        <NavLink to="/mi-ahorro">Mi ahorro</NavLink>
        <NavLink to="/panel-andres">Panel Andrés</NavLink>
      </nav>
      <a className="header-cta" href="/#formulario-demo">Formulario demo <span aria-hidden="true">↗</span></a>
    </header>
  );
}
