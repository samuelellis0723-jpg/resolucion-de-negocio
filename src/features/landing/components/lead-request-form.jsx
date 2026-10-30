import { useState } from 'react';
import { saveDemoRequest } from '@/features/landing/services/request-service.js';

const initialForm = { name: '', email: '', ownsHome: '', billOver80: '' };

export function LeadRequestForm() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState({ type: 'idle', message: '' });

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((currentForm) => ({ ...currentForm, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus({ type: 'loading', message: 'Guardando en la base local de demostración…' });

    try {
      await saveDemoRequest(form);
      setStatus({ type: 'success', message: 'Guardado en la base JSON local de demostración. No se envió a una empresa.' });
      setForm(initialForm);
    } catch {
      setStatus({ type: 'error', message: 'No se pudo guardar. Inicia la API mock con npm run mock:api y vuelve a intentar.' });
    }
  }

  return (
    <form className="lead-form" onSubmit={handleSubmit}>
      <div className="form-grid">
        <label className="field">
          <span>¿Cómo te llamas?</span>
          <input autoComplete="name" name="name" onChange={handleChange} required value={form.name} maxLength="80" />
        </label>
        <label className="field">
          <span>Correo electrónico</span>
          <input autoComplete="email" name="email" onChange={handleChange} required type="email" value={form.email} maxLength="120" />
        </label>
        <label className="field">
          <span>¿Eres dueño/a de la casa?</span>
          <select name="ownsHome" onChange={handleChange} required value={form.ownsHome}>
            <option value="" disabled>Selecciona una opción</option>
            <option value="sí">Sí</option>
            <option value="no">No</option>
          </select>
        </label>
        <label className="field">
          <span>¿Tu recibo supera los $80?</span>
          <select name="billOver80" onChange={handleChange} required value={form.billOver80}>
            <option value="" disabled>Selecciona una opción</option>
            <option value="sí">Sí</option>
            <option value="no">No</option>
          </select>
        </label>
      </div>
      <div className="form-submit-row">
        <button className="button button--sun" disabled={status.type === 'loading'} type="submit">
          {status.type === 'loading' ? 'Guardando…' : 'Guardar solicitud de demo'}
          <span aria-hidden="true">↗</span>
        </button>
        <span className="form-note">No ingreses información sensible.</span>
      </div>
      <p className="mock-warning" role="note">
        Demostración local: se guarda solo en la base JSON de este proyecto. No llega a Sol de Casa ni inicia una cotización real. No publiques ni despliegues esta API.
      </p>
      {status.message && <p className={`form-status form-status--${status.type}`} role={status.type === 'error' ? 'alert' : 'status'}>{status.message}</p>}
    </form>
  );
}
