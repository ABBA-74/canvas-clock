import Star from './lib/Star.js';
import { days, months } from './lib/DaysMonths.js';

let isPath1Clockwise = false;
let isPath2Clockwise = true;

const canvas = document.querySelector('#canvas');
const ctx = canvas.getContext('2d');

let w, h;
let stars = [];
let mouse = {
  x: undefined,
  y: undefined,
};
let path = {
  x: undefined,
  y: undefined,
};
let cursorPosition = {
  x: undefined,
  y: undefined,
};
let initValue;
const init = () => {
  initValue = 5;
  resizeReset();
  animationLoop();
  displayChrono();
};

setInterval(() => {
  displayHour();
}, 1000);

const resizeReset = () => {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
};

/** HANDLE DISPLAY TIME **/

const timePartDayEl = document.querySelector('.time-part-day');
const timeDayStringEl = document.querySelector('.time-day-string');
const timeHourStringEl = document.querySelector('.time-hour');
const timeDateEl = document.querySelector('.time-date');
const timeEl = document.querySelector('.time');
const displayHour = () => {
  const date = new Date();
  const dayString = days[date.getDay()];
  const day = date.getDate() < 10 ? `0${date.getDate()}` : `${date.getDate()}`;
  const month = months[date.getMonth()].toUpperCase();
  const year = date.getFullYear();

  let hours = date.getHours();
  let partDay = hours > 12 ? 'APRÈS MIDI' : 'MATIN';
  hours = hours < 10 ? `0${hours}` : hours;
  const minutes =
    date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
  const seconds =
    date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds();

  timeDayStringEl.textContent = dayString.toUpperCase();
  timePartDayEl.textContent = partDay;
  timeHourStringEl.textContent = `${hours} : ${minutes} : ${seconds}`;
  timeDateEl.textContent = `${day} ${month} ${year}`;
};

const chronoEl = document.querySelector('.chrono-value');
const containerEl = document.querySelector('.container');
const displayChrono = () => {
  const idInterval = setInterval(() => {
    chronoEl.textContent = initValue;
    initValue--;
    if (initValue < 0) {
      clearInterval(idInterval);
      chronoEl.textContent = '';
      timeEl.classList.remove('d-none');
    }
  }, 1000);
};

/** ANIMATION PATH **/

let temp = 0;
let temp2 = 0;

const mousemove = (e) => {
  mouse.x = e.x;
  mouse.y = e.y;
  cursorPosition.x = e.x;
  cursorPosition.y = e.y;
  for (let i = 0; i < 5; i++) {
    stars.push(new Star(ctx, mouse));
  }
};

const handlePath = () => {
  const idInterval2 = setInterval(() => {
    temp = temp > Math.PI * 2 ? 0 : temp + 0.01 + speed1 / 36;
    clearInterval(idInterval2);
  }, 6000);

  let reverse1 = isPath1Clockwise ? -1 : 1;
  path.x = w / 2 + 250 * Math.sin(temp) * reverse1;
  path.y = h / 2 + 250 * Math.cos(temp);
  for (let i = 0; i < 5; i++) {
    stars.push(new Star(ctx, path));
  }
};
const handlePath2 = () => {
  const idInterval3 = setInterval(() => {
    temp2 = temp2 > Math.PI * 2 ? 0 : temp2 + 0.01 + speed2 / 36;
    clearInterval(idInterval3);
  }, 6000);
  let reverse2 = isPath2Clockwise ? 1 : -1;
  path.x = w / 2 + -500 * Math.sin(temp2) * reverse2;
  path.y = h / 2 + 500 * Math.cos(temp2);
  for (let i = 0; i < 5; i++) {
    stars.push(new Star(ctx, path));
  }
};

const mouseout = () => {
  mouse.x = undefined;
  mouse.y = undefined;
};

const drawStars = () => {
  for (let i = 0; i < stars.length; i++) {
    stars[i].draw();
    stars[i].update();
  }
};

const animationLoop = () => {
  ctx.globalCompositeOperation = 'lighter';
  ctx.clearRect(0, 0, w, h);
  handlePath();
  handlePath2();
  let temp = [];

  drawStars();
  for (let i = 0; i < stars.length; i++) {
    if (stars[i].time <= stars[i].ttl) {
      temp.push(stars[i]);
    }
  }
  stars = temp;

  requestAnimationFrame(animationLoop);
};

/** SETTINGS */

const settingsEl = document.querySelector('.settings');
let isStettingsActive = false;
let idTimeOut = '';
settingsEl.addEventListener('click', () => {
  handleDisplaySettings();
});

const inputsRange = document.querySelectorAll(
  '.settings .input-form input:not([type=checkbox])'
);
inputsRange.forEach((el) => {
  el.addEventListener('change', () => {
    handleDisplaySettings();
    handleChangeValueSpeed(el);
  });
});
let speed1 = 1;
let speed2 = 1;
const handleChangeValueSpeed = (el) => {
  const elSpanValue = el.nextElementSibling.lastChild;
  elSpanValue.textContent = el.value;
  el.id === 'speed-1' ? (speed1 = el.value) : (speed2 = el.value);
};
const handleDisplaySettings = () => {
  clearTimeout(idTimeOut);
  settingsEl.classList.add('active');
  settingsEl.classList.remove('inactive');
  isStettingsActive = true;
  idTimeOut = setTimeout(() => {
    isStettingsActive = false;
    settingsEl.classList.add('inactive');
    settingsEl.classList.remove('active');
  }, 8000);
};

const inputsCheckbox = document.querySelectorAll(
  '.settings input[type=checkbox]'
);

inputsCheckbox.forEach((el) => {
  el.addEventListener('click', () => {
    if (el.classList.contains('path1') && el.checked) {
      isPath1Clockwise = true;
      isPath2Clockwise = inputsCheckbox[1].checked ? true : false;
    } else if (el.classList.contains('path2') && el.checked) {
      isPath1Clockwise = inputsCheckbox[0].checked ? true : false;
      isPath2Clockwise = true;
    } else {
      isPath1Clockwise = inputsCheckbox[0].checked ? true : false;
      isPath2Clockwise = inputsCheckbox[1].checked ? true : false;
    }
    handlePath();
    handlePath2();
  });
});

/** ADDEVENTLISTENER */

window.addEventListener('DOMContentLoaded', init);
window.addEventListener('resize', resizeReset);
window.addEventListener('mousemove', mousemove);
window.addEventListener('mouseout', mouseout);
