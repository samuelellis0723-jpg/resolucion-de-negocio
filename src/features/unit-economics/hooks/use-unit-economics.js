import { useMemo } from 'react';
import '@/features/unit-economics/unit-economics-model.js';

const { calculateModel, DEFAULT_INPUTS } = globalThis.SolDeCasaModel;

export function useUnitEconomics(inputs) {
  return useMemo(() => calculateModel(inputs), [inputs]);
}

export function createCaseInputs() {
  return structuredClone(DEFAULT_INPUTS);
}
