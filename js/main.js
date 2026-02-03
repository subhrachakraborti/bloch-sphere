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

const sphereColorInput = document.getElementById('sphereColor');
const arrowColorInput = document.getElementById('arrowColor');
const pointColorInput = document.getElementById('pointColor');
const resetSettingsBtn = document.getElementById('resetSettingsBtn');
const clearBtn = document.getElementById('clearBtn');
const exportPdfBtn = document.getElementById('exportPdfBtn');
const customAngleInput = document.getElementById('customAngle');
const rotateCustomBtn = document.getElementById('rotateCustomBtn');

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

const handleRotation = (axis, direction) => {
  const angle = direction === '+' ? Math.PI / 12 : -Math.PI / 12;
  const { theta, phi } = blochSphere.rotateAroundAxis(axis, angle);
  currentState = stateFromAngles(theta, phi);
  presetState.value = 'custom';
  updateUI(false);
};

const handleCustomRotation = () => {
  const angleDeg = Number.parseFloat(customAngleInput.value) || 15;
  const angle = (angleDeg * Math.PI) / 180;
  const axis = 'z';
  const { theta, phi } = blochSphere.rotateAroundAxis(axis, angle);
  currentState = stateFromAngles(theta, phi);
  presetState.value = 'custom';
  updateUI(false);
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

Array.from(document.querySelectorAll('.rotation-btn')).forEach((button) => {
  button.addEventListener('click', () => {
    const axis = button.dataset.axis;
    const direction = button.dataset.dir;
    handleRotation(axis, direction);
  });
});

rotateCustomBtn.addEventListener('click', handleCustomRotation);
customAngleInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    handleCustomRotation();
  }
});

sphereColorInput.addEventListener('input', (e) => {
  blochSphere.setSphereColor(e.target.value);
});

arrowColorInput.addEventListener('input', (e) => {
  blochSphere.setArrowColor(e.target.value);
});

pointColorInput.addEventListener('input', (e) => {
  blochSphere.setPointColor(e.target.value);
});

resetSettingsBtn.addEventListener('click', () => {
  sphereColorInput.value = '#356aff';
  arrowColorInput.value = '#8e75ff';
  pointColorInput.value = '#6fe5ff';
  blochSphere.setSphereColor('#356aff');
  blochSphere.setArrowColor('#8e75ff');
  blochSphere.setPointColor('#6fe5ff');
});

clearBtn.addEventListener('click', () => {
  const initialTheta = Math.PI / 4;
  const initialPhi = Math.PI / 4;
  currentState = stateFromAngles(initialTheta, initialPhi);
  blochSphere.reset(initialTheta, initialPhi);
  presetState.value = 'custom';
  updateUI(true);
});

exportPdfBtn.addEventListener('click', async () => {
  const { jsPDF } = window.jspdf;
  const exportBtnOriginalText = exportPdfBtn.innerHTML;
  exportPdfBtn.innerHTML = '<span class="btn-icon">⏳</span> Exporting...';
  exportPdfBtn.disabled = true;

  try {
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4',
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 15;

    pdf.setFontSize(20);
    pdf.setFont(undefined, 'bold');
    pdf.text('Bloch Sphere Lab - Quantum State Visualization', margin, margin + 5);

    pdf.setFontSize(10);
    pdf.setFont(undefined, 'normal');
    pdf.setTextColor(100);
    pdf.text(`Generated: ${new Date().toLocaleString()}`, margin, margin + 12);

    const heroVisual = document.querySelector('.hero-visual');
    const canvasElement = document.getElementById('blochCanvas');

    pdf.setTextColor(0);
    pdf.setFontSize(12);
    pdf.text(`State (|0⟩/|1⟩ basis): ${stateComp.textContent}`, margin, margin + 25);
    pdf.text(`State (|+⟩/|-⟩ basis): ${stateHadamard.textContent}`, margin, margin + 32);
    pdf.text(`State (|i⟩/|-i⟩ basis): ${stateY.textContent}`, margin, margin + 39);

    pdf.text(`θ: ${thetaValue.textContent}`, margin, margin + 52);
    pdf.text(`φ: ${phiValue.textContent}`, margin + 40, margin + 52);
    pdf.text(`Vector: ${vectorValue.textContent}`, margin + 80, margin + 52);

    pdf.text(`P(|0⟩): ${probZero.textContent}`, margin, margin + 65);
    pdf.text(`P(|1⟩): ${probOne.textContent}`, margin + 40, margin + 65);
    pdf.text(`P(|+⟩): ${probPlus.textContent}`, margin + 80, margin + 65);
    pdf.text(`P(|-⟩): ${probMinus.textContent}`, margin + 115, margin + 65);

    const canvasImage = await html2canvas(heroVisual, {
      backgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--bg-soft').trim() || '#141b24',
      scale: 2,
      logging: false,
    });

    const imgData = canvasImage.toDataURL('image/png');
    const imgWidth = pageWidth - margin * 2;
    const imgHeight = (canvasImage.height * imgWidth) / canvasImage.width;

    pdf.addImage(imgData, 'PNG', margin, margin + 75, imgWidth, Math.min(imgHeight, pageHeight - margin - 90));

    pdf.save('bloch-sphere-visualization.pdf');
  } catch (error) {
    console.error('PDF export error:', error);
    alert('Failed to export PDF. Please try again.');
  } finally {
    exportPdfBtn.innerHTML = exportBtnOriginalText;
    exportPdfBtn.disabled = false;
  }
});

initThemeToggle();
setCurrentYear();
updateUI(true);
