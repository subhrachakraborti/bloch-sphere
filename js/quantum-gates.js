/*
MIT License
Copyright (c) 2025 Subhra Chakraborti
*/
import {
  complex,
  complexAdd,
  complexMul,
  complexScale,
  complexAbs2,
  complexConj,
  complexExp,
} from './utils.js';

const SQRT1_2 = 1 / Math.sqrt(2);

export const gates = {
  X: [
    [complex(0), complex(1)],
    [complex(1), complex(0)],
  ],
  Y: [
    [complex(0), complex(0, -1)],
    [complex(0, 1), complex(0)],
  ],
  Z: [
    [complex(1), complex(0)],
    [complex(0), complex(-1)],
  ],
  H: [
    [complex(SQRT1_2), complex(SQRT1_2)],
    [complex(SQRT1_2), complex(-SQRT1_2)],
  ],
  S: [
    [complex(1), complex(0)],
    [complex(0), complex(0, 1)],
  ],
  T: [
    [complex(1), complex(0)],
    [complex(0), complexExp(Math.PI / 4)],
  ],
};

export const applyGate = (state, gate) => {
  const [a, b] = state;
  const m = gates[gate];
  const newA = complexAdd(complexMul(m[0][0], a), complexMul(m[0][1], b));
  const newB = complexAdd(complexMul(m[1][0], a), complexMul(m[1][1], b));
  return normalizeState([newA, newB]);
};

export const normalizeState = (state) => {
  const norm = Math.sqrt(complexAbs2(state[0]) + complexAbs2(state[1]));
  if (norm === 0) return [complex(1), complex(0)];
  return [complexScale(state[0], 1 / norm), complexScale(state[1], 1 / norm)];
};

export const stateFromAngles = (theta, phi) => {
  const a = Math.cos(theta / 2);
  const b = Math.sin(theta / 2);
  return normalizeState([complex(a, 0), complexMul(complexExp(phi), complex(b, 0))]);
};

export const anglesFromState = (state) => {
  const [a, b] = state;
  const theta = 2 * Math.acos(Math.min(1, Math.max(-1, a.re)));
  const phi = Math.atan2(b.im, b.re);
  return { theta, phi: phi < 0 ? phi + Math.PI * 2 : phi };
};

export const blochVectorFromState = (state) => {
  const [a, b] = state;
  const abConj = complexMul(a, complexConj(b));
  return {
    x: 2 * abConj.re,
    y: 2 * abConj.im,
    z: complexAbs2(a) - complexAbs2(b),
  };
};

export const changeBasis = (state, basis) => {
  if (basis === 'hadamard') {
    return applyMatrix(state, gates.H);
  }
  if (basis === 'y') {
    const transform = [
      [complex(SQRT1_2), complex(0, -SQRT1_2)],
      [complex(SQRT1_2), complex(0, SQRT1_2)],
    ];
    return applyMatrix(state, transform);
  }
  return state;
};

export const probabilities = (state) => ({
  zero: complexAbs2(state[0]),
  one: complexAbs2(state[1]),
});

export const applyMatrix = (state, matrix) => {
  const [a, b] = state;
  return [
    complexAdd(complexMul(matrix[0][0], a), complexMul(matrix[0][1], b)),
    complexAdd(complexMul(matrix[1][0], a), complexMul(matrix[1][1], b)),
  ];
};
