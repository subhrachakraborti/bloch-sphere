/*
MIT License
Copyright (c) 2025 Subhra Chakraborti
*/
import { BlochSphere } from './bloch-sphere.js';
import {
  applyGate,
  stateFromAngles,
  anglesFromState,
  changeBasis,
  probabilities,
  blochVectorFromState,
} from './quantum-gates.js';
import { formatComplex, formatNumber, initThemeToggle, setCurrentYear } from './utils.js';

const canvas = document.getElementById('blochCanvas');
const blochSphere = new BlochSphere(canvas);

const thetaSlider = document.getElementById('thetaSlider');
const phiSlider = document.getElementById('phiSlider');
const presetState = document.getElementById('presetState');
const stateComp = document.getElementById('stateComp');
const stateHadamard = document.getElementById('stateHadamard');
const stateY = document.getElementById('stateY');
const thetaValue = document.getElementById('thetaValue');
const phiValue = document.getElementById('phiValue');
const vectorValue = document.getElementById('vectorValue');
const probZero = document.getElementById('probZero');
const probOne = document.getElementById('probOne');
const probPlus = document.getElementById('probPlus');
const probMinus = document.getElementById('probMinus');

let currentState = stateFromAngles(Math.PI / 4, Math.PI / 4);

const updateUI = (updateSliders = true) => {
  const { theta, phi } = anglesFromState(currentState);
  blochSphere.updateFromAngles(theta, phi);

  if (updateSliders) {
    thetaSlider.value = formatNumber((theta * 180) / Math.PI, 0);
    phiSlider.value = formatNumber((phi * 180) / Math.PI, 0);
  }

  thetaValue.textContent = `${formatNumber((theta * 180) / Math.PI, 1)}°`;
  phiValue.textContent = `${formatNumber((phi * 180) / Math.PI, 1)}°`;

  const { x, y, z } = blochVectorFromState(currentState);
  vectorValue.textContent = `(${formatNumber(x)}, ${formatNumber(y)}, ${formatNumber(z)})`;

  stateComp.textContent = `${formatComplex(currentState[0])} |0⟩ + ${formatComplex(
    currentState[1]
  )} |1⟩`;

  const hadamard = changeBasis(currentState, 'hadamard');
  stateHadamard.textContent = `${formatComplex(hadamard[0])} |+⟩ + ${formatComplex(
    hadamard[1]
  )} |−⟩`;

  const yBasis = changeBasis(currentState, 'y');
  stateY.textContent = `${formatComplex(yBasis[0])} |i⟩ + ${formatComplex(yBasis[1])} |-i⟩`;

  const compProb = probabilities(currentState);
  probZero.textContent = formatNumber(compProb.zero);
  probOne.textContent = formatNumber(compProb.one);

  const xProb = probabilities(changeBasis(currentState, 'hadamard'));
  probPlus.textContent = formatNumber(xProb.zero);
  probMinus.textContent = formatNumber(xProb.one);
};

const applyPreset = (preset) => {
  switch (preset) {
    case 'zero':
      currentState = stateFromAngles(0, 0);
      break;
    case 'one':
      currentState = stateFromAngles(Math.PI, 0);
      break;
    case 'plus':
      currentState = stateFromAngles(Math.PI / 2, 0);
      break;
    case 'minus':
      currentState = stateFromAngles(Math.PI / 2, Math.PI);
      break;
    case 'plusI':
      currentState = stateFromAngles(Math.PI / 2, Math.PI / 2);
      break;
    case 'minusI':
      currentState = stateFromAngles(Math.PI / 2, (3 * Math.PI) / 2);
      break;
    default:
      currentState = stateFromAngles(
        (Number.parseFloat(thetaSlider.value) * Math.PI) / 180,
        (Number.parseFloat(phiSlider.value) * Math.PI) / 180
      );
  }
  updateUI(true);
};

presetState.addEventListener('change', (event) => {
  applyPreset(event.target.value);
});

thetaSlider.addEventListener('input', () => {
  presetState.value = 'custom';
  currentState = stateFromAngles(
    (Number.parseFloat(thetaSlider.value) * Math.PI) / 180,
    (Number.parseFloat(phiSlider.value) * Math.PI) / 180
  );
  updateUI(false);
});

phiSlider.addEventListener('input', () => {
  presetState.value = 'custom';
  currentState = stateFromAngles(
    (Number.parseFloat(thetaSlider.value) * Math.PI) / 180,
    (Number.parseFloat(phiSlider.value) * Math.PI) / 180
  );
  updateUI(false);
});

Array.from(document.querySelectorAll('.gate-btn')).forEach((button) => {
  button.addEventListener('click', () => {
    const gate = button.dataset.gate;
    currentState = applyGate(currentState, gate);
    presetState.value = 'custom';
    updateUI(true);
  });
});

initThemeToggle();
setCurrentYear();
updateUI(true);
