const amountFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

export function formatSaving(amount) {
  return amountFormatter.format(amount);
}

export function ShareCard({ amount, period, invitation = false }) {
  if (invitation) {
    return (
      <div className="share-card share-card--invitation" aria-label="Invitación de Sol de Casa para calcular un ahorro estimado">
        <div className="share-card__top">
          <span className="share-card__brand">sol de casa</span>
          <span className="share-card__sun" aria-hidden="true" />
        </div>
        <p>Descubre lo que el sol podría aportar a tu casa.</p>
        <div className="share-card__value">
          <span>{period ? `Ahorro ${period} compartido · SIMULADO` : 'Ahorro promedio del caso ficticio'}</span>
          <strong>{period ? formatSaving(amount) : '70 %'}</strong>
        </div>
        <small>ESTIMADO · Calcula con tu propio importe mensual. El ahorro de cada hogar puede variar.</small>
      </div>
    );
  }

  return (
    <div className="share-card" aria-label={`Vista previa de tarjeta: ahorro ${period} simulado de ${formatSaving(amount)}`}>
      <div className="share-card__top">
        <span className="share-card__brand">sol de casa</span>
        <span className="share-card__sun" aria-hidden="true" />
      </div>
      <p>Así se ve la energía<br />desde casa.</p>
      <div className="share-card__value">
        <span>Ahorro {period} · SIMULADO</span>
        <strong>{formatSaving(amount)}</strong>
      </div>
      <small>Ejemplo basado en el 70 % promedio del caso ficticio. No garantiza el ahorro de otro hogar.</small>
    </div>
  );
}
