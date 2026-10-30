import { formatMoney } from '@/features/unit-economics/components/number-formatters.js';

export function ChannelTrap({ caseResult }) {
  const meta = caseResult.channels.meta;
  const google = caseResult.channels.google;
  const difference = ((meta.realCac / google.realCac) - 1) * 100;
  return (
    <aside className="channel-trap">
      <div className="trap-mark" aria-hidden="true">↗</div>
      <div className="trap-copy"><span>La trampa del CPL</span><h3>El lead de Meta es más barato.<br />El cliente de Meta es más caro.</h3><p>En el caso base, cada cliente de Meta cuesta {Math.round(difference)}% más que uno de Google al sumar las visitas realizadas.</p></div>
      <div className="trap-values"><div><span>CPL · Meta</span><strong>{formatMoney(meta.cpl, 2)}</strong></div><div><span>CAC real · Meta</span><strong>{formatMoney(meta.realCac, 2)}</strong></div><div><span>CAC real · Google</span><strong>{formatMoney(google.realCac, 2)}</strong></div></div>
    </aside>
  );
}
