// GLOBAL VARIABLES

// Document elements
const canvas = document.getElementById('drawingCanvas');
const LightCone1Checkbox = document.getElementById('LightCone1Checkbox');
const LightCone2Checkbox = document.getElementById('LightCone2Checkbox');
const LightCone3Checkbox = document.getElementById('LightCone3Checkbox');

// Drawing variables
const ctx = canvas.getContext('2d');
const radius = 10;
const colors = [[68, 117, 248], [124, 51, 255], [36, 142, 35]];
const lightConeOpacity = 0.15;
const WINDOW_SIZE = 600;
let showLightCones = [true, true, true];

// 3-D list: first index is which worldline, second index is which point in worldline, third index is x or y
let worldlines = [[], [], []];
let worldlineIndex = 0; // index of current worldine (i.e. next one to add a point to)

// EVENT LISTENERS

function onRadioClick(radio) {
  worldlineIndex = Number(radio.value);
}

window.onload = function() {
  drawGrid();
};

canvas.addEventListener('click', function(event) {
  const rect = canvas.getBoundingClientRect();
  let x = event.clientX - rect.left;
  let y = event.clientY - rect.top;
  worldlines[worldlineIndex].push([x, y]);
  update_worldline_years();
  drawAll();
});

LightCone1Checkbox.addEventListener('change', function() {
  showLightCones[0] = this.checked;
  drawAll();
});

LightCone2Checkbox.addEventListener('change', function() {
  showLightCones[1] = this.checked;
  drawAll();
});

LightCone3Checkbox.addEventListener('change', function() {
  showLightCones[2] = this.checked;
  drawAll();
});

function clearWorldlines() {
  worldlines = [[], [], []];
  update_worldline_years();
  drawAll();
}

// MINKOWSKI FUNCTIONS

function update_worldline_years() {
  for (let i = 1; i <= 3; i++) {
    let name = 'worldline' + i + 'Years';
    let element = document.getElementById(name);
    let years = duration(i);
    element.textContent = Math.round(years * 100) / 100;
  }
}

// wordlineNumber is 1, 2, or 3

// Returns "ERROR" if any of the intervals are invalid
function duration(worldlineNumber) {
  let worldline = worldlines[worldlineNumber - 1];
  if (worldline.length == 1) {
    return 0;
  }
  let total_duration = 0;
  for (let i = 1; i < worldline.length; i++) {
    if (worldline.length == 0) {
      continue;
    }
    delta_t = (worldline[i-1][1] - worldline[i][1])/50; // inverted b/c of the coordinate system
    delta_x = (worldline[i][0] - worldline[i-1][0])/50;
    if (delta_t < 0) {
      alert("Worldlines cannot move backwards in time. Try again!");
      worldline.pop();
      return total_duration;
    }
    if (Math.abs(delta_x) > Math.abs(delta_t)) {
      alert("You can't travel faster than the speed of light! Make sure to stay within the light cones. Try again!");
      worldline.pop();
      return total_duration;
    }
    var duration_increment = Math.sqrt(-1*(-delta_t * delta_t + delta_x * delta_x));
    if (!duration_increment) {
      alert("You can't have a negative duration for an interval! Try again!");
      worldline.pop();
      return total_duration;
    }
    total_duration += duration_increment;
    
  }
  return total_duration;
}


// DRAWING FUNCTIONS

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function setStrokeColor(r, g, b) {
  ctx.strokeStyle = 'rgb(' + r + ',' + g + ',' + b + ')';
}

function setFillColor(r, g, b, a) {
  ctx.fillStyle = 'rgba(' + r + ', ' + g + ', ' + b + ', ' + a + ')';
}

function drawGrid() {
  ctx.strokeStyle = 'black';
  ctx.lineWidth = 1;
  for (let i = 0; i <= WINDOW_SIZE; i += 50) {
    // Horizontal lines
    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(WINDOW_SIZE, i);
    ctx.stroke();

    // Vertical lines
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, WINDOW_SIZE);
    ctx.stroke();
  }

  // Axis arrows
  ctx.lineWidth = 3;
  setFillColor(0, 0, 0, 1);
  ctx.beginPath();
  ctx.moveTo(10, 590);
  ctx.lineTo(10, 10);
  ctx.lineTo(5, 40);
  ctx.lineTo(15, 40);
  ctx.lineTo(10, 10);
  ctx.fill();
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(10, 590);
  ctx.lineTo(590, 590);
  ctx.lineTo(550, 595);
  ctx.lineTo(550, 585);
  ctx.lineTo(590, 590);
  ctx.fill();
  ctx.stroke();


}

function drawLightCones() {
  ctx.lineWidth = 1;
  for (let i = 0; i < showLightCones.length; i++) {
    if (worldlines[i].length == 0) {
      continue;
    }
    if (!showLightCones[i]) {
      continue;
    }
    setStrokeColor(colors[i][0], colors[i][1], colors[i][2]);
    setFillColor(colors[i][0], colors[i][1], colors[i][2], lightConeOpacity);
    let x = worldlines[i][worldlines[i].length - 1][0];
    let y = worldlines[i][worldlines[i].length - 1][1];

    // Upper part of light cone
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(0, y - x);
    ctx.lineTo(0, 0);
    ctx.lineTo(WINDOW_SIZE, 0);
    ctx.lineTo(WINDOW_SIZE, y - ( WINDOW_SIZE - x));
    ctx.lineTo(x, y);
    ctx.fill();
    ctx.stroke();

    // Low part of line clone
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(0, y + x);
    ctx.lineTo(0, WINDOW_SIZE);
    ctx.lineTo(WINDOW_SIZE, WINDOW_SIZE);
    ctx.lineTo(WINDOW_SIZE, y + (WINDOW_SIZE - x));
    ctx.lineTo(x, y);
    ctx.fill();
    ctx.stroke();
  }
}

function drawAll() {
  clearCanvas();
  drawGrid();
  
  for (let i = 0; i < worldlines.length; i++) {
    if (worldlines[i].length == 0) {
      continue;
    }

    for (let j = 0; j < worldlines[i].length; j++) {
      // Set stroke properties
      ctx.lineWidth = 2;
      setStrokeColor(colors[i][0], colors[i][1], colors[i][2]);

      // Find current point
      x = worldlines[i][j][0];
      y = worldlines[i][j][1];
  
      // Draw current point
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, 2 * Math.PI);
      ctx.stroke();
  
      // Draw line to next point
      if (j > 0) {
        ctx.beginPath();
        ctx.moveTo(worldlines[i][j-1][0], worldlines[i][j-1][1]);
        ctx.lineTo(x, y);
        ctx.stroke();
      }
      
      
    }
  }

  drawLightCones();
}