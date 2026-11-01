import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { LeadRequestForm } from '@/features/landing/components/lead-request-form.jsx';
import './landing-page.css';

const solarHomeImage = new URL('../assets/solar-home-generated.jpg', import.meta.url).href;

export function LandingPage() {
  const [isParallaxPaused, setIsParallaxPaused] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return undefined;

    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });

    document.documentElement.classList.add('has-scroll-reveal');
    document.querySelectorAll('.solar-landing [data-reveal]').forEach((element) => revealObserver.observe(element));

    return () => {
      revealObserver.disconnect();
      document.documentElement.classList.remove('has-scroll-reveal');
    };
  }, []);

  useEffect(() => {
    const visual = document.querySelector('.landing-hero-photo');
    if (!visual || isParallaxPaused || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    let frameId = null;
    const updateParallax = () => {
      frameId = null;
      const bounds = visual.getBoundingClientRect();
      const distanceFromCenter = bounds.top + bounds.height / 2 - window.innerHeight / 2;
      const offset = Math.max(-16, Math.min(16, distanceFromCenter * -0.025));
      visual.style.setProperty('--photo-parallax-y', `${offset}px`);
    };
    const handleScroll = () => {
      if (frameId === null) frameId = window.requestAnimationFrame(updateParallax);
    };

    updateParallax();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      if (frameId !== null) window.cancelAnimationFrame(frameId);
      visual.style.removeProperty('--photo-parallax-y');
    };
  }, [isParallaxPaused]);

  return (
    <div className="solar-landing">
      <section className="landing-hero page-gutter" aria-labelledby="landing-title">
        <div className="landing-hero-copy" data-reveal>
          <p className="landing-eyebrow"><span aria-hidden="true" /> Energía residencial, vista desde casa</p>
          <h1 id="landing-title">El sol de todos los días. <em>Hecho energía.</em></h1>
          <p className="landing-intro">Conoce una propuesta solar pensada alrededor de la vivienda, el consumo y el ahorro.</p>
          <div className="landing-actions">
            <a className="landing-button" href="#formulario-demo">Ir al formulario de demostración <span aria-hidden="true">↗</span></a>
            <Link className="landing-text-link" to="/calculadora">Explorar la calculadora <span aria-hidden="true">↗</span></Link>
          </div>
          <div className="landing-review">
            <span className="landing-review-stars" role="img" aria-label="4,9 de 5 estrellas">★★★★★</span>
            <span><strong>4,9 / 5</strong><small>210 reseñas en Google</small></span>
          </div>
        </div>

        <figure className="landing-hero-visual" data-reveal>
          <div className="landing-photo-frame">
            <img
              className="landing-hero-photo"
              src={solarHomeImage}
              alt="Visualización generada de una vivienda con paneles solares en el techo; no representa una instalación real de Sol de Casa."
              width="1536"
              height="1024"
              fetchPriority="high"
            />
            <span className="landing-photo-stamp">Luz de tarde<br />energía en casa</span>
          </div>
          <figcaption>Imagen generada para el caso ficticio · No es una instalación real</figcaption>
          <button
            className="landing-motion-toggle"
            type="button"
            aria-pressed={isParallaxPaused}
            onClick={() => setIsParallaxPaused((paused) => !paused)}
          >
            {isParallaxPaused ? 'Activar profundidad' : 'Pausar profundidad'}
          </button>
        </figure>

        <div className="landing-scroll-note" aria-hidden="true"><span /> Baja para recorrer la propuesta</div>
      </section>

      <section className="landing-facts" aria-label="Datos del caso educativo" data-reveal>
        <div className="landing-facts-intro"><span>El caso, en cifras</span><p>Datos ficticios usados para esta demostración.</p></div>
        <div className="landing-fact"><strong>420</strong><span>casas instaladas</span></div>
        <div className="landing-fact"><strong>4,9 <small>★</small></strong><span>210 reseñas en Google</span></div>
        <div className="landing-fact landing-fact--saving"><strong>70<small>%</small></strong><span>ahorro promedio indicado</span></div>
      </section>

      <section className="landing-story page-gutter" id="como-funciona" aria-labelledby="story-title">
        <div className="landing-story-heading" data-reveal>
          <p className="landing-eyebrow"><span aria-hidden="true" /> Una decisión de casa</p>
          <h2 id="story-title">Una propuesta solar, <em>con números claros.</em></h2>
        </div>
        <div className="landing-story-copy" data-reveal>
          <p>La instalación promedio de este caso cuesta <strong>$6.500</strong>. El ahorro del 70 % es un promedio reportado en el caso ficticio; no es una promesa ni un resultado garantizado para cada hogar.</p>
          <Link className="landing-text-link" to="/calculadora">Mira cómo se construyen las cuentas <span aria-hidden="true">↗</span></Link>
        </div>
        <div className="landing-story-note" data-reveal>
          <span className="landing-sun-mark" aria-hidden="true">☼</span>
          <p>La propuesta parte de tu consumo. La cotización real depende de cada vivienda.</p>
        </div>
      </section>

      <section className="landing-form-section page-gutter" id="formulario-demo" aria-labelledby="form-title">
        <div className="landing-form-photo" role="img" aria-label="Imagen generada de referencia; no corresponde a una vivienda instalada por Sol de Casa." />
        <div className="landing-form-content" data-reveal>
          <p className="landing-eyebrow"><span aria-hidden="true" /> Prototipo educativo · Caso ficticio</p>
          <h2 id="form-title">Cuéntanos un poco sobre tu casa.</h2>
          <p className="landing-form-intro">Este formulario demuestra cómo podría comenzar una conversación. Sus respuestas se guardan únicamente en el mock local del proyecto.</p>
          <div className="landing-form-panel"><LeadRequestForm /></div>
        </div>
      </section>
    </div>
  );
}
