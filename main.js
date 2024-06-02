// GLOBAL VARIABLES

// Document elements
const canvas = document.getElementById('drawingCanvas');
const LightCone1Checkbox = document.getElementById('LightCone1Checkbox');
const LightCone2Checkbox = document.getElementById('LightCone2Checkbox');
const LightCone3Checkbox = document.getElementById('LightCone3Checkbox');

// Drawing variables
const ctx = canvas.getContext('2d');
const radius = 10;
const colors = [[57, 19, 247], [247, 93, 42], [63, 204, 89]];
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
  worldlines = [];
  drawAll();
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
    ctx.str
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
}

function drawLightCones() {
  ctx.lineWidth = 1;
  for (let i = 0; i < showLightCones.length; i++) {
    console.log(showLightCones);
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