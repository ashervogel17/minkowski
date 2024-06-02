// GLOBAL VARIABLES

// Document elements
const canvas = document.getElementById('drawingCanvas');
const showLightConesCheckbox = document.getElementById('ShowLightConesCheckbox');

// Drawing variables
const ctx = canvas.getContext('2d');
const radius = 10;
const colors = [[57, 19, 247], [247, 93, 42], [63, 204, 89]];
const lightConeOpacity = 0.15;
const WINDOW_SIZE = 600;
let showLightCones = true;

// 3-D list: first index is which worldline, second index is which point in worldline, third index is x or y
let worldline = [];


// EVENT LISTENERS

window.onload = function() {
  drawGrid();
};

canvas.addEventListener('click', function(event) {
  const rect = canvas.getBoundingClientRect();
  let x = event.clientX - rect.left;
  let y = event.clientY - rect.top;
  worldline.push([x, y]);
  drawAll();
});

showLightConesCheckbox.addEventListener('change', function() {
  showLightCones = this.checked;
  drawAll();
});

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

function drawLightCone(x, y, r, g, b) {
  // Set fill color
  setFillColor(r, g, b, lightConeOpacity);

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

function drawAll() {
  clearCanvas();
  drawGrid();
  setStrokeColor(colors[0][0], colors[0][1], colors[0][2]);

  for (let i = 0; i < worldline.length; i++) {
    for (let j = 0; j < worldline[i].length; j++) {
      x = worldline[i][j];
      y = worldline[i][j];
      
      // Draw current point
      ctx.beginPath();
      ctx.strokeStyle = ''
    }
  }

  for (let i = 0; i < worldline.length; i++) {
    x = worldline[i][0];
    y = worldline[i][1];

    // Draw current point
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.stroke();

    // Draw line to next point
    if (i > 0) {
      ctx.beginPath();
      ctx.moveTo(worldline[i-1][0], worldline[i-1][1]);
      ctx.lineTo(x, y);
      ctx.stroke();
    }

    if (i == worldline.length - 1 && showLightCones) {
      drawLightCone(x, y, colors[0][0], colors[0][1], colors[0][2]);
    }
  }

}