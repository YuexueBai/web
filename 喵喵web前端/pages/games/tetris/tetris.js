const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const rows = 20;
const cols = 10;
const blockSize = 30;
const colors = ['#000000', '#FFB6C1', '#DC143C', '#00008B', '#008B8B', '#006400', '#FF8C00', '#9400D3'];

let board = [];
for (let r = 0; r < rows; r++) {
  board[r] = [];
  for (let c = 0; c < cols; c++) {
    board[r][c] = 0;
  }
}

function drawSquare(x, y, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x * blockSize, y * blockSize, blockSize, blockSize);
  ctx.strokeRect(x * blockSize, y * blockSize, blockSize, blockSize);
}

function drawBoard() {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      drawSquare(c, r, colors[board[r][c]]);
    }
  }
}

const shapes = [
  [Z, Z, Z, Z],
  [S, S, S, S],
  [O, O, O, O],
  [L, L, L, L],
  [I, I, I, I],
  [T, T, T, T],
  [J, J, J, J]
];

const pieces = [
  [0, 0, 0, 0],
  [1, 1, 1, 1],
  [2, 2, 2, 2],
  [3, 3, 3, 3],
  [4, 4, 4, 4],
  [5, 5, 5, 5],
  [6, 6, 6, 6]
];

function Piece(shape, color) {
  this.shape = shape;
  this.color = color;
  this.shapeN = 0; 
  this.activeShape = this.shape[this.shapeN];
  this.x = 3;
  this.y = -2;
}

Piece.prototype.fill = function(color) {
  for (let r = 0; r < this.activeShape.length; r++) {
    for (let c = 0; c < this.activeShape.length; c++) {
      if (this.activeShape[r][c]) {
        drawSquare(this.x + c, this.y + r, color);
      }
    }
  }
};

Piece.prototype.draw = function() {
  this.fill(this.color);
};

Piece.prototype.unDraw = function() {
  this.fill(colors[0]);
};

Piece.prototype.moveDown = function() {
  if (!this.collision(0,1,this.activeShape)) {
    this.unDraw();
    this.y++;
    this.draw();
  } else {
    this.lock();
    p = randomPiece();
  }
};

Piece.prototype.lock = function() {
  for (let r = 0; r < this.activeShape.length; r++) {
    for (let c = 0; c < this.activeShape.length; c++) {
      if (!this.activeShape[r][c]) {
        continue;
      }
      if (this.y + r < 0) {
        alert("Game Over");
        // 结束游戏
        break;
      }
      board[this.y + r][this.x + c] = this.color;
    }
  }
  for (let r = 0; r < rows; r++) {
    let isRowFull = true;
    for (let c = 0; c < cols; c++) {
      isRowFull = isRowFull && (board[r][c] !== 0);
    }
    if (isRowFull) {
      for (let y = r; y > 1; y--) {
        for (let c = 0; c < cols; c++) {
          board[y][c] = board[y - 1][c]
          }
        }
        for (let c = 0; c < cols; c++) {
          board[0][c] = 0;
        }
        // 更新分数
      }
    }
    drawBoard();
  };
  
  Piece.prototype.collision = function(x, y, shape) {
    for (let r = 0; r < shape.length; r++) {
      for (let c = 0; c < shape.length; c++) {
        if (!shape[r][c]) {
          continue;
        }
        let newX = this.x + c + x;
        let newY = this.y + r + y;
        if (newX < 0 || newX >= cols || newY >= rows) {
          return true;
        }
        if (newY < 0) {
          continue;
        }
        if (board[newY][newX] !== 0) {
          return true;
        }
      }
    }
    return false;
  };
  
  Piece.prototype.moveLeft = function() {
    if (!this.collision(-1, 0, this.activeShape)) {
      this.unDraw();
      this.x--;
      this.draw();
    }
  };
  
  Piece.prototype.moveRight = function() {
    if (!this.collision(1, 0, this.activeShape)) {
      this.unDraw();
      this.x++;
      this.draw();
    }
  };
  
  Piece.prototype.rotate = function() {
    let nextPattern = this.shape[(this.shapeN + 1) % this.shape.length];
    let kick = 0;
    if (this.collision(0, 0, nextPattern)) {
      if (this.x > cols / 2) {
        // It's closer to the right wall
        kick = -1; // we need to move the piece left
      } else {
        // It's closer to the left wall
        kick = 1; // we need to move the piece right
      }
    }
  
    if (!this.collision(kick, 0, nextPattern)) {
      this.unDraw();
      this.x += kick;
      this.shapeN = (this.shapeN + 1) % this.shape.length;
      this.activeShape = this.shape[this.shapeN];
      this.draw();
    }
  };
  
  let p = randomPiece();
  
  document.addEventListener('keydown', function(event) {
    if (event.key === 'ArrowLeft') {
      // 向左移动方块
      p.moveLeft();
    } else if (event.key === 'ArrowRight') {
      // 向右移动方块
      p.moveRight();
    } else if (event.key === 'ArrowDown') {
      // 加速下落
      p.drop();
    } else if (event.key === 'ArrowUp') {
      // 旋转方块
      p.rotate();
    }
  });
  
  function randomPiece() {
    let r = Math.floor(Math.random() * pieces.length);
    return new Piece(shapes[r], pieces[r]);
  }
  
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    p.draw();
    drawBoard();
  }
  
  function drop() {
    p.moveDown();
  }
  
  let dropStart = Date.now();
  function update() {
    let now = Date.now();
    let delta = now - dropStart;
    if (delta > 1000) {
      drop();
      dropStart = Date.now();
    }
    draw();
    requestAnimationFrame(update);
  }
  update();  