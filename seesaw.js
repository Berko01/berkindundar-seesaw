'use strict';

const PLANK_WIDTH = 400;
const PIVOT_X = PLANK_WIDTH / 2;
const MAX_ANGLE = 30;
const TORQUE_DIVISOR = 10;
const STORAGE_KEY = 'page_state';

const WEIGHT_COLORS = [
  '#e07b7b',
  '#8b6bbf',
  '#5ba89a',
  '#6a9fd8',
  '#7bbf7b',
  '#c4845a',
  '#8baed8',
  '#b07bbf',
  '#90bfb8',
  '#c47bb0',
];

let state = {
  objects: [],
  paused: false,
};

const plankEl        = document.getElementById('plank');
const seesawWrapper  = document.getElementById('seesaw-wrapper');
const leftTotalEl    = document.getElementById('left-total');
const rightTotalEl   = document.getElementById('right-total');
const balanceEl      = document.getElementById('balance-indicator');
const btnReset       = document.getElementById('btn-reset');
const btnPause       = document.getElementById('btn-pause');

function limitAngle(angle) {
  return Math.max(-MAX_ANGLE, Math.min(MAX_ANGLE, angle));
}

function getRandomWeight() {
  return Math.floor(Math.random() * 10) + 1;
}

function calcPhysics(objects) {
  let leftTorque  = 0;
  let rightTorque = 0;
  let leftWeight  = 0;
  let rightWeight = 0;

  for (const obj of objects) {
    if (obj.side === 'left') {
      leftTorque  += obj.weight * obj.distanceFromPivot;
      leftWeight  += obj.weight;
    } else {
      rightTorque += obj.weight * obj.distanceFromPivot;
      rightWeight += obj.weight;
    }
  }

  const angle = limitAngle((rightTorque - leftTorque) / TORQUE_DIVISOR);

  return { leftTorque, rightTorque, leftWeight, rightWeight, angle };
}

function getBalanceStatus(angle) {
  if (Math.abs(angle) < 1) {
    return { text: '⚖️ Balanced',    className: 'balance-indicator balanced' };
  }
  if (angle < 0) {
    return { text: '◀ Tilted left',  className: 'balance-indicator tilted-left' };
  }
  return   { text: 'Tilted right ▶', className: 'balance-indicator tilted-right' };
}

function createObjectEl(obj) {
  const wrapper = document.createElement('div');
  wrapper.className = 'seesaw-object';
  wrapper.dataset.id = String(obj.id);

  const size  = 24 + (obj.weight - 1) * 2.2;
  const color = WEIGHT_COLORS[obj.weight - 1];

  const circle = document.createElement('div');
  circle.className = 'object-circle';
  circle.style.width      = `${size}px`;
  circle.style.height     = `${size}px`;
  circle.style.background = color;
  circle.style.boxShadow  = `0 3px 10px ${color}88`;
  circle.textContent      = obj.weight;

  const label = document.createElement('div');
  label.className   = 'object-label';
  label.textContent = `${obj.weight} kg`;

  wrapper.appendChild(circle);
  wrapper.appendChild(label);
  wrapper.style.left = `${obj.plankX}px`;

  return wrapper;
}

function drawObjects() {
  plankEl.querySelectorAll('.seesaw-object').forEach((el) => el.remove());
  for (const obj of state.objects) {
    plankEl.appendChild(createObjectEl(obj));
  }
}

function render() {
  const { leftWeight, rightWeight, angle } = calcPhysics(state.objects);
  const balance = getBalanceStatus(angle);

  seesawWrapper.style.transform = `translateX(-50%) rotate(${angle}deg)`;
  leftTotalEl.textContent  = `${leftWeight} kg`;
  rightTotalEl.textContent = `${rightWeight} kg`;
  balanceEl.textContent    = balance.text;
  balanceEl.className      = balance.className;

  drawObjects();
}

function createObjectFromClick(clickedPlankPosition) {
  return {
    id:                Date.now(),
    weight:            getRandomWeight(),
    plankX:            clickedPlankPosition,
    side:              clickedPlankPosition < PIVOT_X ? 'left' : 'right',
    distanceFromPivot: Math.abs(clickedPlankPosition - PIVOT_X),
  };
}

function handlePlankClick(event) {
  if (state.paused) return;

  const rect                = plankEl.getBoundingClientRect();
  const clickedPlankPosition = event.clientX - rect.left;

  if (clickedPlankPosition < 0 || clickedPlankPosition > PLANK_WIDTH) return;

  state.objects.push(createObjectFromClick(clickedPlankPosition));
  render();
  saveState();
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.objects));
}

function loadState() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return;

  const parsed = JSON.parse(raw);
  if (Array.isArray(parsed)) {
    state.objects = parsed;
  }
}

function updatePauseButton() {
  btnPause.textContent = state.paused ? 'Resume' : 'Pause';
  btnPause.classList.toggle('paused', state.paused);
}

function handlePause() {
  state.paused = !state.paused;
  updatePauseButton();
}

function handleReset() {
  state.objects = [];
  state.paused  = false;
  updatePauseButton();
  render();
  saveState();
}

function init() {
  loadState();
  render();
  updatePauseButton();

  plankEl.addEventListener('click', handlePlankClick);
  btnReset.addEventListener('click', handleReset);
  btnPause.addEventListener('click', handlePause);
}

init();
