let grid, prevGrid;
let cols = 100;  
let rows = 100;  
let amplitude = 30; 
let timeStep = 0.7; 
let spaceStep = 5; 
let waveSpeed = 1;  
let centerX, centerY;

function setup() {
  let canvas=createCanvas(windowWidth, windowHeight);
  canvas.parent('sketch-holder');
  frameRate(600);  
  background(0);
  cols = floor(width / spaceStep);
  rows = floor(height / spaceStep);
  grid = create2DGrid(cols, rows);
  prevGrid = create2DGrid(cols, rows);
}
function draw() {
  background(0); 
  // simple wave equation
  for (let i = 1; i < cols - 1; i++) {
    for (let j = 1; j < rows - 1; j++) {
      let displacement = (grid[i + 1][j].y + grid[i - 1][j].y +
                          grid[i][j + 1].y + grid[i][j - 1].y -
                          4 * grid[i][j].y) * (waveSpeed * waveSpeed) * timeStep * timeStep;
      grid[i][j].y += displacement;
    }
  }
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      let x = i * spaceStep;
      let y = j * spaceStep;
      let displacement = grid[i][j].y;
      let size = map(abs(displacement), 0, amplitude, 0, 15); 
      let startColor = color(0, 0, 255);  
      let endColor = color(255, 0, 0);    
      let value = map(displacement, 0, amplitude, 0, 1); 
      let col = lerpColor(startColor, endColor, value); 
      fill(col);
      noStroke();
      ellipse(x, y, size, size); 
    }
  }
  copyGrid(grid, prevGrid);
}
function create2DGrid(cols, rows) {
  let grid = [];
  for (let i = 0; i < cols; i++) {
    grid[i] = [];
    for (let j = 0; j < rows; j++) {
      grid[i][j] = createVector(0, 0);  
    }
  }
  return grid;
}
function copyGrid(src, dest) {
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      dest[i][j].y = src[i][j].y;
    }
  }
}

function createDisturbance(x, y, radius, amplitude) {
    for (let i = -radius; i <= radius; i++) {
      for (let j = -radius; j <= radius; j++) {
        let dist = sqrt(i * i + j * j);
        if (dist <= radius) {
          let targetX = x + i;
          let targetY = y + j;
          if (targetX >= 0 && targetX < cols && targetY >= 0 && targetY < rows) {
            let falloff = amplitude * (1 - dist / radius); 
            grid[targetX][targetY].y += falloff;  
          }
        }
      }
    }
  }
  
function mousePressed() {
  let x = floor(mouseX / spaceStep);
  let y = floor(mouseY / spaceStep);
  createDisturbance(x, y, 5, amplitude); 
}
  
