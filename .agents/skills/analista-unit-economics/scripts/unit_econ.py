#!/usr/bin/env python3
"""Calculadora de unit economics. Salida en JSON. Sin dependencias externas.

Comandos: cascade, subscription, repeat, marginal, funnel, breakeven, ai-plan
Ejemplo: python unit_econ.py cascade --price 25 --cogs 8.75 --fulfil 5 --pay-pct 0.04 --cac 25
"""
import argparse
import json
import math


def r(x, n=2):
    if x is None:
        return None
    if isinstance(x, float) and (math.isinf(x) or math.isnan(x)):
        return "infinito"
    return round(x, n)


def cascade(a):
    gross = (a.price - a.discount) * (1 - a.returns_pct)
    net = gross / (1 + a.tax)
    fee = (a.price - a.discount) * a.pay_pct
    cm1 = net - a.cogs
    cm2 = cm1 - a.fulfil - fee - a.other_var
    cm2_pct = cm2 / net if net else 0
    be = gross / cm2 if cm2 > 0 else float("inf")
    out = {
        "ingreso_bruto_atribuido": r(gross), "ingreso_neto": r(net), "cm1": r(cm1), "cm1_pct": r(cm1 / net * 100) if net else None,
        "pasarela": r(fee), "cm2": r(cm2), "cm2_pct": r(cm2_pct * 100),
        "roas_equilibrio_1er_pedido": r(be),
    }
    if a.cac is not None:
        out["cm3_primer_pedido"] = r(cm2 - a.cac)
        out["cm3_pct"] = r((cm2 - a.cac) / net * 100) if net else None
    if a.roas is not None:
        out["resultado_por_1_en_anuncios"] = r(a.roas * (cm2 / gross) - 1 if gross else None)
        out["campana_rentable_en_1er_pedido"] = a.roas >= be
    return out


def curve_sub(cm2, churn, cac, horizon, r_m=0.0):
    cum, rows, payback = -cac, [], None
    for t in range(1, horizon + 1):
        retained = (1 - churn) ** (t - 1)
        cum += cm2 * retained
        rows.append({"mes": t, "retencion": r(retained * 100, 1), "caja_acumulada": r(cum)})
        if payback is None and cum >= 0:
            payback = t
    return rows, payback


def subscription(a):
    rows, payback = curve_sub(a.cm2, a.churn, a.cac, a.horizon, a.disc)
    ltv_n = a.cm2 * (1 - (1 - a.churn) ** a.horizon) / a.churn if a.churn else a.cm2 * a.horizon
    out = {
        "vida_media_meses": r(1 / a.churn, 1) if a.churn else "infinito",
        f"ltv_{a.horizon}_meses": r(ltv_n),
        "ltv_teorico_sin_limite": r(a.cm2 / a.churn) if a.churn else "infinito",
        "ltv_descontado_horizonte": r(sum(a.cm2 * (1 - a.churn) ** (t - 1) / (1 + a.disc) ** t for t in range(1, a.horizon + 1))),
        "payback_mes": payback if payback else f"no recupera en {a.horizon} meses",
        "curva": rows,
    }
    if a.cac:
        out["ltv_cac"] = r(ltv_n / a.cac)
    return out


def repeat(a):
    spacing = 12 / a.orders_per_year
    months = [1 + spacing * i for i in range(round(a.orders_per_year * a.years))]
    cum, payback, rows = -a.cac, None, []
    for m in months:
        cum += a.cm2
        rows.append({"mes": r(m, 1), "caja_acumulada": r(cum)})
        if payback is None and cum >= 0:
            payback = r(m, 1)
    ltv = a.cm2 * a.orders_per_year * a.years
    return {
        "ltv": r(ltv), "ltv_cac": r(ltv / a.cac) if a.cac else None,
        "payback_mes": payback if payback else "no recupera en el horizonte",
        "cm3_horizonte": r(ltv - a.cac), "curva": rows,
    }


def marginal(a):
    d_spend, d_cust = a.spend2 - a.spend1, a.cust2 - a.cust1
    m = d_spend / d_cust if d_cust > 0 else float("inf")
    out = {
        "cac_promedio_tramo1": r(a.spend1 / a.cust1),
        "cac_promedio_total": r(a.spend2 / a.cust2),
        "cac_marginal": r(m),
    }
    if a.ltv is not None:
        out["resultado_por_cliente_marginal"] = r(a.ltv - m)
        out["escalar_el_tramo"] = a.ltv - m > 0
    return out


def funnel(a):
    rows = []
    for c in a.cvr:
        clients = a.visits * c
        cac = a.spend / clients if clients else float("inf")
        row = {"conversion_pct": r(c * 100, 2), "clientes": r(clients, 1), "cac": r(cac)}
        if a.aov_cm2 is not None:
            row["resultado_por_cliente_1er_pedido"] = r(a.aov_cm2 - cac)
        if a.aov is not None:
            row["roas_1er_pedido"] = r(a.aov / cac)
        rows.append(row)
    return {"escenarios": rows}


def breakeven(a):
    units = math.ceil(a.fixed / a.cm2) if a.cm2 > 0 else float("inf")
    out = {"unidades_por_mes_para_cubrir_fijos": r(units, 1)}
    if a.cm2 > 0 and a.price:
        out["ventas_de_equilibrio"] = r(units * a.price)
    return out


def ai_plan(a):
    cost_session = (a.tokens_in * a.price_in + a.tokens_out * a.price_out) / 1_000_000
    monthly = cost_session * a.sessions
    cm2 = a.price - monthly - a.price * a.pay_pct - a.other_var
    out = {
        "costo_ia_por_sesion": r(cost_session, 4), "costo_ia_mensual_usuario": r(monthly),
        "cm2_mensual_usuario": r(cm2), "cm2_pct": r(cm2 / a.price * 100) if a.price else None,
        "sesiones_para_cm2_cero": r((a.price - a.price * a.pay_pct - a.other_var) / cost_session, 0) if cost_session else None,
    }
    if a.heavy_mult and a.heavy_mult > 1:
        heavy = monthly * a.heavy_mult
        out["usuario_intensivo_cm2"] = r(a.price - heavy - a.price * a.pay_pct - a.other_var)
    return out


def main():
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    s = p.add_subparsers(dest="cmd", required=True)

    c = s.add_parser("cascade", help="Cascada precio -> CM1 -> CM2 -> CM3 y ROAS de equilibrio")
    c.add_argument("--price", type=float, required=True, help="precio que paga el cliente")
    c.add_argument("--tax", type=float, default=0, help="IVA incluido en el precio (0.13 = 13%%)")
    c.add_argument("--discount", type=float, default=0)
    c.add_argument("--returns-pct", type=float, default=0)
    c.add_argument("--cogs", type=float, required=True)
    c.add_argument("--fulfil", type=float, default=0, help="logistica/envio por pedido")
    c.add_argument("--pay-pct", type=float, default=0, help="comision pasarela sobre el precio cobrado")
    c.add_argument("--other-var", type=float, default=0)
    c.add_argument("--cac", type=float)
    c.add_argument("--roas", type=float, help="ROAS real a auditar")
    c.set_defaults(f=cascade)

    c = s.add_parser("subscription", help="LTV acotado, curva de caja y payback con churn")
    c.add_argument("--cm2", type=float, required=True, help="CM2 mensual por cliente")
    c.add_argument("--churn", type=float, required=True)
    c.add_argument("--cac", type=float, required=True)
    c.add_argument("--horizon", type=int, default=12)
    c.add_argument("--disc", type=float, default=0, help="tasa de descuento mensual")
    c.set_defaults(f=subscription)

    c = s.add_parser("repeat", help="LTV y payback con pedidos espaciados")
    c.add_argument("--cm2", type=float, required=True)
    c.add_argument("--orders-per-year", type=float, required=True)
    c.add_argument("--cac", type=float, required=True)
    c.add_argument("--years", type=float, default=1)
    c.set_defaults(f=repeat)

    c = s.add_parser("marginal", help="CAC promedio vs. marginal al escalar")
    c.add_argument("--spend1", type=float, required=True)
    c.add_argument("--cust1", type=float, required=True)
    c.add_argument("--spend2", type=float, required=True)
    c.add_argument("--cust2", type=float, required=True)
    c.add_argument("--ltv", type=float)
    c.set_defaults(f=marginal)

    c = s.add_parser("funnel", help="CAC segun tasa de conversion")
    c.add_argument("--spend", type=float, required=True)
    c.add_argument("--visits", type=float, required=True)
    c.add_argument("--cvr", type=float, nargs="+", required=True, help="tasas, ej. 0.025 0.035")
    c.add_argument("--aov", type=float, help="ticket para ROAS del 1er pedido")
    c.add_argument("--aov-cm2", type=float, help="CM2 del 1er pedido")
    c.set_defaults(f=funnel)

    c = s.add_parser("breakeven", help="Punto de equilibrio contra costos fijos")
    c.add_argument("--fixed", type=float, required=True)
    c.add_argument("--cm2", type=float, required=True)
    c.add_argument("--price", type=float)
    c.set_defaults(f=breakeven)

    c = s.add_parser("ai-plan", help="Margen de un plan con costo de IA por usuario")
    c.add_argument("--price", type=float, required=True, help="precio mensual del plan")
    c.add_argument("--tokens-in", type=float, required=True, help="tokens de entrada por sesion")
    c.add_argument("--tokens-out", type=float, required=True, help="tokens de salida por sesion")
    c.add_argument("--price-in", type=float, required=True, help="precio por millon de tokens de entrada")
    c.add_argument("--price-out", type=float, required=True, help="precio por millon de tokens de salida")
    c.add_argument("--sessions", type=float, required=True, help="sesiones por mes")
    c.add_argument("--pay-pct", type=float, default=0)
    c.add_argument("--other-var", type=float, default=0)
    c.add_argument("--heavy-mult", type=float, default=0, help="multiplo de uso del usuario intensivo")
    c.set_defaults(f=ai_plan)

    a = p.parse_args()
    for key, value in vars(a).items():
        if isinstance(value, (int, float)) and (not math.isfinite(value) or value < 0):
            p.error(f"{key}: se requiere un número finito no negativo")
    for key in ("churn", "pay_pct", "returns_pct"):
        if hasattr(a, key) and not 0 <= getattr(a, key) <= 1:
            p.error(f"{key}: usa una tasa entre 0 y 1")
    for key in ("price", "horizon", "orders_per_year", "years", "cust1", "cust2", "visits"):
        if hasattr(a, key) and getattr(a, key) is not None and getattr(a, key) <= 0:
            p.error(f"{key}: debe ser positivo")
    if a.cmd == "cascade" and a.discount > a.price:
        p.error("El descuento no puede superar el precio")
    if a.cmd == "repeat" and not math.isclose(a.orders_per_year * a.years, round(a.orders_per_year * a.years)):
        p.error("El calendario requiere una cantidad entera de pedidos; usa una tabla para frecuencia esperada fraccionaria")
    if a.cmd == "marginal" and (a.spend2 <= a.spend1 or a.cust2 < a.cust1):
        p.error("El segundo tramo debe tener mayor gasto y no menos clientes acumulados")
    if a.cmd == "funnel" and any(not math.isfinite(c) or not 0 < c <= 1 for c in a.cvr):
        p.error("Las conversiones deben estar entre 0 (excluido) y 1")
    print(json.dumps(a.f(a), ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
