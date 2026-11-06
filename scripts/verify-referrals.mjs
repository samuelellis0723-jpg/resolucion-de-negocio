import assert from 'node:assert/strict';
import test from 'node:test';
import { createRequire } from 'node:module';
import { readFile } from 'node:fs/promises';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { build } from 'esbuild';
import { calculateReferralEstimate, parseMonthlyBill } from '../src/features/referrals/referral-calculator.js';
import { DEMO_REFERRAL_CODE, getReferralUrl, resolveReferralCode } from '../src/features/referrals/referral-demo.js';
import { CAC_LIMIT, getActiveReferralMetrics, getProjectedReferralEconomics } from '../src/features/referrals/referral-analytics.js';
import { DEMO_VISIT_CAPACITY, REFERRAL_STORAGE_KEY, advanceReferralRequest, getDemoMonth, getLatestRequest, getRemainingDemoCapacity, getSessionRequest, readReferralState, recordReferralEvent, setSessionRequest, submitReferralRequest } from '../src/features/referrals/referral-store.js';

class MemoryStorage {
  values = new Map();
  getItem(key) { return this.values.get(key) ?? null; }
  setItem(key, value) { this.values.set(key, value); }
  removeItem(key) { this.values.delete(key); }
}

async function loadJsxComponent(entryPoint) {
  const bundle = await build({
    entryPoints: [entryPoint], bundle: true, platform: 'node', format: 'cjs',
    write: false, packages: 'external', loader: { '.css': 'empty' }, jsx: 'automatic',
  });
  const bundledModule = { exports: {} };
  new Function('require', 'module', 'exports', bundle.outputFiles[0].text)(createRequire(import.meta.url), bundledModule, bundledModule.exports);
  return bundledModule.exports;
}

test('un recibo de $110 produce $77, $924 y 7,03 años', () => {
  const parsed = parseMonthlyBill('110');
  assert.equal(parsed.amount, 110);
  const result = calculateReferralEstimate(parsed.amount);
  assert.equal(result.monthlySaving, 77);
  assert.equal(result.annualSaving, 924);
  assert.equal(result.simplePaybackYears.toFixed(2), '7.03');
});

test('entradas vacías, cero, negativas e inválidas se rechazan', () => {
  for (const value of ['', ' ', '0', '-10', 'abc', '1,234', '10001']) {
    assert.ok(parseMonthlyBill(value).error, `Se aceptó ${JSON.stringify(value)}`);
  }
  assert.equal(parseMonthlyBill('110,50').amount, 110.5);
  const withCents = calculateReferralEstimate(110.5);
  assert.equal(withCents.monthlySaving, 77.35);
  assert.equal(withCents.annualSaving, 928.2);
});

test('enlace compartido y código inválido', () => {
  const url = getReferralUrl('https://soldecasa.example', DEMO_REFERRAL_CODE);
  assert.equal(url, `https://soldecasa.example/referidos/${DEMO_REFERRAL_CODE}`);
  assert.ok(resolveReferralCode(DEMO_REFERRAL_CODE));
  assert.equal(resolveReferralCode('codigo-invalido'), null);
  assert.equal(new URL(url).search, '');
});

test('recarga, doble envío, atribución y capacidad agotada', () => {
  const storage = new MemoryStorage();
  const estimate = calculateReferralEstimate(110);
  recordReferralEvent({ id: 'open-1', type: 'referral_opened', referralCode: DEMO_REFERRAL_CODE }, storage);
  recordReferralEvent({ id: 'open-1', type: 'referral_opened', referralCode: DEMO_REFERRAL_CODE }, storage);

  const firstInput = { id: 'request-1', referralCode: DEMO_REFERRAL_CODE, name: 'Vecino de prueba 1', email: 'vecino1@example.test', estimate };
  const first = submitReferralRequest(firstInput, storage);
  assert.equal(first.request.status, 'received');
  assert.equal(first.wasExisting, false);
  assert.equal(getRemainingDemoCapacity(storage), DEMO_VISIT_CAPACITY);
  assert.equal(submitReferralRequest(firstInput, storage).wasExisting, true);
  assert.equal(submitReferralRequest({ ...firstInput, id: 'otro-clic' }, storage).wasExisting, true);

  const reloadedStorage = new MemoryStorage();
  reloadedStorage.setItem(REFERRAL_STORAGE_KEY, storage.getItem(REFERRAL_STORAGE_KEY));
  assert.equal(getLatestRequest(DEMO_REFERRAL_CODE, reloadedStorage).id, 'request-1');
  assert.equal(getLatestRequest(DEMO_REFERRAL_CODE, reloadedStorage).referralCode, DEMO_REFERRAL_CODE);
  const firstTab = new MemoryStorage();
  setSessionRequest(DEMO_REFERRAL_CODE, 'request-1', firstTab);
  assert.equal(getSessionRequest(DEMO_REFERRAL_CODE, reloadedStorage, firstTab).id, 'request-1');

  const scheduled = advanceReferralRequest('request-1', 'scheduled', reloadedStorage);
  assert.equal(scheduled.request.status, 'scheduled');
  assert.equal(getRemainingDemoCapacity(reloadedStorage), 0);

  const second = submitReferralRequest({ ...firstInput, id: 'request-2', name: 'Vecino de prueba 2', email: 'vecino2@example.test' }, reloadedStorage);
  assert.equal(second.request.status, 'waiting');
  assert.equal(getLatestRequest(DEMO_REFERRAL_CODE, reloadedStorage).id, 'request-2');
  assert.equal(getSessionRequest(DEMO_REFERRAL_CODE, reloadedStorage, firstTab).id, 'request-1');
  assert.equal(getSessionRequest(DEMO_REFERRAL_CODE, reloadedStorage, new MemoryStorage()), null);
  const state = readReferralState(reloadedStorage);
  assert.equal(state.requests.length, 2);
  assert.deepEqual(state.events.map((event) => event.type), ['referral_opened', 'request_received', 'visit_scheduled', 'request_waitlisted']);
  assert.ok(state.events.every((event) => event.referralCode === DEMO_REFERRAL_CODE && event.simulated));
  assert.throws(() => submitReferralRequest({ ...firstInput, id: 'bad', referralCode: 'codigo-invalido' }, reloadedStorage));

  const malformedStorage = new MemoryStorage();
  malformedStorage.setItem(REFERRAL_STORAGE_KEY, JSON.stringify({ version: 1, requests: [{ id: 'broken' }], events: [{ id: 'broken' }] }));
  assert.deepEqual(readReferralState(malformedStorage).requests, []);
  assert.deepEqual(readReferralState(malformedStorage).events, []);
});

test('etapas válidas, premios únicos, CAC activo y proyección del caso', () => {
  const storage = new MemoryStorage();
  const estimate = calculateReferralEstimate(110);
  recordReferralEvent({ id: 'share-1', type: 'share_action_opened', referralCode: DEMO_REFERRAL_CODE }, storage);
  recordReferralEvent({ id: 'page-1', type: 'referral_opened', referralCode: DEMO_REFERRAL_CODE }, storage);
  recordReferralEvent({ id: 'calc-1', type: 'estimate_viewed', referralCode: DEMO_REFERRAL_CODE }, storage);
  submitReferralRequest({ id: 'journey-1', referralCode: DEMO_REFERRAL_CODE, name: 'Vecino de prueba 1', email: 'vecino1@example.test', estimate }, storage);
  assert.throws(() => advanceReferralRequest('journey-1', 'closed', storage), /no sigue/);
  let metrics = getActiveReferralMetrics(readReferralState(storage));
  assert.equal(metrics.visitsCompleted, 0);
  assert.equal(metrics.rewardCost, 0);
  assert.equal(metrics.cac, null);
  assert.deepEqual([metrics.shareActionOpens, metrics.referralPageVisits, metrics.estimates, metrics.requests], [1, 1, 1, 1]);

  submitReferralRequest({ id: 'journey-2', referralCode: DEMO_REFERRAL_CODE, name: 'Vecino de prueba 2', email: 'vecino2@example.test', estimate }, storage);
  assert.equal(getLatestRequest(DEMO_REFERRAL_CODE, storage).status, 'received');
  advanceReferralRequest('journey-1', 'scheduled', storage);
  assert.equal(getRemainingDemoCapacity(storage, getDemoMonth()), 0);
  assert.throws(() => advanceReferralRequest('journey-2', 'scheduled', storage), /agotada/);
  advanceReferralRequest('journey-2', 'waiting', storage);
  submitReferralRequest({ id: 'journey-3', referralCode: DEMO_REFERRAL_CODE, name: 'Vecino de prueba 3', email: 'vecino3@example.test', estimate }, storage);
  assert.equal(getLatestRequest(DEMO_REFERRAL_CODE, storage).status, 'waiting');
  assert.throws(() => advanceReferralRequest('journey-2', 'received', storage), /agotada/);
  assert.throws(() => advanceReferralRequest('journey-2', 'scheduled', storage), /no sigue/);
  metrics = getActiveReferralMetrics(readReferralState(storage));
  assert.equal(metrics.visitsCompleted, 0);
  assert.equal(metrics.scheduled, 1);
  assert.equal(metrics.cac, null);

  advanceReferralRequest('journey-1', 'completed', storage);
  advanceReferralRequest('journey-1', 'completed', storage);
  metrics = getActiveReferralMetrics(readReferralState(storage));
  assert.equal(metrics.visitsCompleted, 1);
  assert.equal(metrics.visitCost, 60);
  assert.equal(metrics.rewardCost, 15);
  assert.equal(metrics.cac, null);
  assert.equal(metrics.rewards.length, 1);

  advanceReferralRequest('journey-1', 'closed', storage);
  advanceReferralRequest('journey-1', 'closed', storage);
  metrics = getActiveReferralMetrics(readReferralState(storage));
  assert.equal(metrics.salesClosed, 1);
  assert.equal(metrics.rewardCost, 65);
  assert.equal(metrics.rewards.length, 2);
  assert.equal(metrics.cac, 125);
  assert.equal(metrics.capacityRemaining, 0);

  const projected = getProjectedReferralEconomics();
  assert.equal(projected.visitCostPerSale.toFixed(2), '133.33');
  assert.equal(projected.rewardBudgetPerSale.toFixed(2), '166.67');
  assert.equal(projected.projectedCac.toFixed(2), '216.67');
  assert.ok(projected.projectedCac < CAC_LIMIT);

  const costlyEvents = [
    ...Array.from({ length: 5 }, (_, index) => ({ type: 'visit_completed', id: `visit-${index}` })),
    { type: 'sale_closed', id: 'sale-1' },
    { type: 'reward_granted', id: 'reward-1', amount: 65 },
  ];
  assert.ok(getActiveReferralMetrics({ events: costlyEvents, requests: [] }).cac > CAC_LIMIT);
});

test('la ruta directa presenta el cálculo, el inválido tiene salida y la recarga muestra confirmación', async () => {
  const originalWindow = globalThis.window;
  try {
    const routeSource = await readFile(new URL('../src/routes/routing.jsx', import.meta.url), 'utf8');
    assert.match(routeSource, /path="\/referidos\/:codigo"/);
    assert.match(routeSource, /path="\/panel-andres"/);
    const { ReferralPage } = await loadJsxComponent('src/features/referrals/pages/referral-page.jsx');
    const { SavingsPage } = await loadJsxComponent('src/features/referrals/pages/savings-page.jsx');
    const { AndresPanelPage } = await loadJsxComponent('src/features/referrals/pages/andres-panel-page.jsx');
    const storage = new MemoryStorage();
    const firstTab = new MemoryStorage();
    const secondTab = new MemoryStorage();
    globalThis.window = { localStorage: storage, sessionStorage: firstTab, location: { origin: 'https://soldecasa.example' } };
    const renderRoute = (path) => renderToString(React.createElement(MemoryRouter, { initialEntries: [path] },
      React.createElement(Routes, null, React.createElement(Route, { path: '/referidos/:codigo', element: React.createElement(ReferralPage) })),
    ));
    const savingsMarkup = renderToString(React.createElement(MemoryRouter, null, React.createElement(SavingsPage)));
    const sharedPath = savingsMarkup.match(/href="(\/referidos\/[^\"]+)"/)?.[1];
    assert.equal(sharedPath, `/referidos/${DEMO_REFERRAL_CODE}`);
    const invitation = renderRoute(sharedPath);
    assert.match(invitation, /Descubre cuánto podrías ahorrar/);
    assert.match(invitation, /¿Cuánto pagas de luz al mes/);
    assert.doesNotMatch(invitation, /Solicitar una visita de prueba/);
    const panelWithoutSales = renderToString(React.createElement(MemoryRouter, null, React.createElement(AndresPanelPage)));
    assert.match(panelWithoutSales, /Sin ventas para calcular/);

    const invalid = renderRoute('/referidos/codigo-invalido');
    assert.match(invalid, /Este código no es válido/);
    assert.match(invalid, /Ir al inicio/);

    const request = submitReferralRequest({ id: 'reload-1', referralCode: DEMO_REFERRAL_CODE, name: 'Vecino de prueba', email: 'vecino@example.test', estimate: calculateReferralEstimate(110) }, storage).request;
    setSessionRequest(DEMO_REFERRAL_CODE, request.id, firstTab);
    const afterReload = renderRoute(sharedPath);
    assert.match(afterReload, /Solicitud recibida · SIMULADO/);
    assert.ok(afterReload.includes(request.id));
    assert.ok(afterReload.includes(DEMO_REFERRAL_CODE));
    assert.doesNotMatch(afterReload, /Ver mi estimación/);

    advanceReferralRequest('reload-1', 'scheduled', storage);
    const familyAfterSchedule = renderToString(React.createElement(MemoryRouter, null, React.createElement(SavingsPage)));
    assert.match(familyAfterSchedule, /Visita agendada · SIMULADO/);
    assert.doesNotMatch(familyAfterSchedule, /\$15 para quien refirió · habilitado una vez/);
    submitReferralRequest({ id: 'reload-2', referralCode: DEMO_REFERRAL_CODE, name: 'Vecino de prueba 2', email: 'vecino2@example.test', estimate: calculateReferralEstimate(110) }, storage);
    setSessionRequest(DEMO_REFERRAL_CODE, 'reload-2', secondTab);
    globalThis.window.sessionStorage = secondTab;
    const afterCapacity = renderRoute(sharedPath);
    assert.match(afterCapacity, /En espera · SIMULADO/);
    assert.match(afterCapacity, /Conservamos tu interés en espera/);
    assert.match(renderRoute('/referidos/codigo-invalido'), /Este código no es válido/);
    const familyWithWaiting = renderToString(React.createElement(MemoryRouter, null, React.createElement(SavingsPage)));
    assert.match(familyWithWaiting, /En espera · SIMULADO/);

    advanceReferralRequest('reload-1', 'completed', storage);
    const familyAfterVisit = renderToString(React.createElement(MemoryRouter, null, React.createElement(SavingsPage)));
    assert.match(familyAfterVisit, /Visita realizada · SIMULADO/);
    assert.match(familyAfterVisit, /\$15 para quien refirió · habilitado una vez/);
    assert.doesNotMatch(familyAfterVisit, /\$50 de descuento para el nuevo cliente · habilitado una vez/);
    advanceReferralRequest('reload-1', 'closed', storage);
    globalThis.window.sessionStorage = firstTab;
    const neighborAfterClose = renderRoute(sharedPath);
    assert.match(neighborAfterClose, /Venta cerrada · SIMULADO/);
    assert.match(neighborAfterClose.replaceAll('<!-- -->', ''), /Descuento de \$50 para el nuevo cliente habilitado una vez/);
    const familyAfterClose = renderToString(React.createElement(MemoryRouter, null, React.createElement(SavingsPage)));
    assert.match(familyAfterClose, /Venta cerrada · SIMULADO/);
    assert.match(familyAfterClose, /\$15 para quien refirió · habilitado una vez/);
    assert.match(familyAfterClose, /\$50 de descuento para el nuevo cliente · habilitado una vez/);
    const panel = renderToString(React.createElement(MemoryRouter, null, React.createElement(AndresPanelPage)));
    assert.match(panel, /Costo de cada cierre referido/);
    assert.match(panel, /\$125/);
    assert.match(panel, /Capacidad agotada · SIMULADO/);
  } finally {
    globalThis.window = originalWindow;
  }
});
