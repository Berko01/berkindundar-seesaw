'use strict';

const PLANK_WIDTH = 400;
const MAX_ANGLE = 30;
const TORQUE_DIVISOR = 10;
const STORAGE_KEY = 'seesaw_state';

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

function clampAngle(angle) {
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
      leftTorque  += obj.weight * obj.distance;
      leftWeight  += obj.weight;
    } else {
      rightTorque += obj.weight * obj.distance;
      rightWeight += obj.weight;
    }
  }

  const angle = clampAngle((rightTorque - leftTorque) / TORQUE_DIVISOR);

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
