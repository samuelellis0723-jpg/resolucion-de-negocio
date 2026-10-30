export function ControlField({ label, help, value, onChange, min = 0, max, step = 1, suffix = '', type = 'number', disabled = false }) {
  return (
    <label className={`control-field${disabled ? ' control-field--disabled' : ''}`}>
      <span className="control-label">{label}</span>
      {help && <span className="control-help">{help}</span>}
      <span className="control-input-wrap">
        <input disabled={disabled} max={max} min={min} onChange={onChange} step={step} type={type} value={value} />
        {suffix && <span className="input-suffix">{suffix}</span>}
      </span>
    </label>
  );
}
