import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <section className="not-found page-gutter">
      <p className="eyebrow">Ruta no disponible</p>
      <h1>Esta página no está en el plano.</h1>
      <Link className="button button--dark" to="/">Volver al inicio</Link>
    </section>
  );
}
