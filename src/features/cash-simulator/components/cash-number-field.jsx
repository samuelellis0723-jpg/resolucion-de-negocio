export function CashNumberField({ label, value, onChange, min = 0, max, step, suffix }) {
  return (
    <label className="cash-field">
      <span>{label}</span>
      <span className="cash-number-wrap">
        <input max={max} min={min} onChange={(event) => {
          const boundedValue = Math.max(min, Math.min(max, Number(event.target.value)));
          onChange(step === 1 ? Math.round(boundedValue) : boundedValue);
        }} step={step} type="number" value={value} />
        {suffix && <small>{suffix}</small>}
      </span>
    </label>
  );
}
