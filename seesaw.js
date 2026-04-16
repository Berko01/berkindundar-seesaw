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
