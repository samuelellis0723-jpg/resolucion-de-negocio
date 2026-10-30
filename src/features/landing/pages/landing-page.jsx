import { Link } from 'react-router-dom';
import { LeadRequestForm } from '@/features/landing/components/lead-request-form.jsx';
import { SolarRoofIllustration } from '@/features/landing/components/solar-roof-illustration.jsx';

export function LandingPage() {
  return (
    <>
      <section className="hero page-gutter">
        <div className="hero-copy">
          <p className="eyebrow"><span className="eyebrow-mark" /> Energía pensada para tu hogar</p>
          <h1>El sol de todos los días. <em>Hecho energía.</em></h1>
          <p className="hero-intro">Conoce una propuesta solar diseñada alrededor de tu casa, tu consumo y lo que quieres ahorrar.</p>
          <div className="hero-actions">
            <a className="button button--sun" href="#solicitar">Solicitar una cotización <span aria-hidden="true">↗</span></a>
            <Link className="text-link" to="/calculadora">Explorar la calculadora <span aria-hidden="true">↗</span></Link>
          </div>
          <div className="hero-proof">
            <div className="proof-stars" aria-label="4,9 de 5 estrellas">★★★★★</div>
            <div><strong>4,9 / 5</strong><span>210 reseñas en Google</span></div>
          </div>
        </div>
        <div className="hero-art-wrap">
          <div className="art-label art-label--top"><span>Casa + energía solar</span><span>01</span></div>
          <SolarRoofIllustration />
          <div className="art-caption"><span className="caption-sun" /> La luz cambia. Tu energía también puede.</div>
          <div className="art-side-note">DISEÑO PARA<br />EL DÍA A DÍA</div>
        </div>
        <div className="hero-bottomline"><span>Prototipo educativo · Caso ficticio</span><span>Desliza para conocer la propuesta ↓</span></div>
      </section>

      <section className="proof-band" aria-label="Datos del caso educativo">
        <div className="proof-band-intro"><span>El caso, en cifras</span><p>Datos ficticios usados para esta demostración.</p></div>
        <div className="proof-stat"><strong>420</strong><span>casas instaladas</span></div>
        <div className="proof-stat"><strong>4,9 <small>★</small></strong><span>210 reseñas en Google</span></div>
        <div className="proof-stat proof-stat--saving"><strong>70<small>%</small></strong><span>ahorro promedio indicado</span></div>
      </section>

      <section className="how-section page-gutter" id="como-funciona">
        <div className="section-heading">
          <p className="eyebrow">De tu techo a tu recibo</p>
          <h2>Una decisión de casa,<br />con números claros.</h2>
        </div>
        <div className="how-body">
          <p>Una instalación promedio en este caso cuesta <strong>$6.500</strong>. El ahorro del 70 % es un promedio reportado en el caso ficticio; no es una promesa ni un resultado garantizado para cada hogar.</p>
          <Link className="inline-arrow" to="/calculadora">Mira cómo se construyen las cuentas <span aria-hidden="true">↗</span></Link>
        </div>
        <div className="how-visual" aria-hidden="true">
          <div className="sun-path"><span /><span /><span /></div>
          <div className="roof-line"><span className="roof-home"><i /><b /><em /></span><span className="roof-panel roof-panel--one" /><span className="roof-panel roof-panel--two" /></div>
          <div className="visual-caption"><span>La propuesta parte de tu consumo.</span><span>La cotización real depende de cada vivienda.</span></div>
        </div>
      </section>

      <section className="quote-section" id="solicitar">
        <div className="quote-inner page-gutter">
          <div className="quote-copy">
            <p className="eyebrow">Empecemos por lo esencial</p>
            <h2>Cuéntanos un poco<br />sobre tu casa.</h2>
            <p>Este formulario demuestra cómo podría comenzar una conversación de cotización. Sus respuestas se guardan únicamente en el mock local del proyecto.</p>
            <div className="quote-footnote"><span className="quote-footnote-icon">i</span><span>La demostración no calcula una oferta ni transmite tus datos a una empresa.</span></div>
          </div>
          <div className="quote-form-panel"><LeadRequestForm /></div>
        </div>
      </section>
    </>
  );
}
