window.addEventListener('load', onLoad);
window.addEventListener('keydown', onKeyDown);

let tableDom;
let playerPos;
let direction = 'ArrowDown';
let fallbackDirection;
let points = 0;
let time = 0;
let moveInterval;
let timeInterval;
let fruitTimeout;
let fruitPositions = [];

function onLoad () {
  renderMaze();
}

function onKeyDown (e) {
  direction = e.key;
  if (!moveInterval && !timeInterval) {
    generateFruit();
    fruitTimeout = setTimeout(onFruitTimeout, 60000);
    moveInterval = setInterval(() => {
      if (movePlayer(direction)) {
        fallbackDirection = direction;
      } else {
        movePlayer(fallbackDirection);
      }
    }, 200);
    timeInterval = setInterval(() => {
      time++;
      if (time >= 200) endGame();
      document.getElementById('time-left').innerText = `${time}s`;
    }, 1000);
  }
}

function getCell (x, y) {
  const row = tableDom.children[y];
  if (!row) return null;
  return row.children[x];
}

function generateFruit () {
  let count = 0;
  while (count < 2) {
    const y = Math.round(Math.random() * tableDom.children.length - 1);
    const x = Math.round(Math.random() * tableDom.children[0].children.length - 1);
    const cell = getCell(x, y);
    if (cell && cell.className === 'd') {
      count++;
      cell.className = 'f';
      fruitPositions.push([x, y]);
    }
  }
}

function onFruitTimeout () {
  for (let [x,y] of fruitPositions) {
    const cell = getCell(x,y);
    cell.className = 'd';
  }
}

function endGame () {
  clearInterval(moveInterval);
  clearInterval(timeInterval);
  alert(`Zbrano stevilo tock: ${points}`);
}

function movePlayer (direction) {
  const isValidMove = (x, y) => (
    getCell(x, y) && getCell(x, y).className !== 'wall'
  );

  const movePlayer = ([x0, y0], [x1, y1]) => {
    const cell0 = getCell(x0, y0);
    cell0.className = '';
    const cell1 = getCell(x1, y1);
    if (cell1.className === 'd') {
      points++;
    }
    if (cell1.className === 'f') {
      points += 20;
    }
    cell1.className = 'player';
  };

  let isMoved = false;

  if (direction === 'ArrowUp') {
    const x = playerPos[0], y = playerPos[1] - 1;
    if (isValidMove(x, y)) {
      movePlayer(playerPos, [x, y]);
      playerPos = [x, y];
      isMoved = true;
    }
  }
  if (direction === 'ArrowLeft') {
    const x = playerPos[0] - 1, y = playerPos[1];
    if (isValidMove(x, y)) {
      movePlayer(playerPos, [x, y]);
      playerPos = [x, y];
      isMoved = true;
    }
  }
  if (direction === 'ArrowRight') {
    const x = playerPos[0] + 1, y = playerPos[1];
    if (isValidMove(x, y)) {
      movePlayer(playerPos, [x, y]);
      playerPos = [x, y];
      isMoved = true;
    }
  }
  if (direction === 'ArrowDown') {
    const x = playerPos[0], y = playerPos[1] + 1;
    if (isValidMove(x, y)) {
      movePlayer(playerPos, [x, y]);
      playerPos = [x, y];
      isMoved = true;
    }
  }

  document.getElementById('game-points').innerText = `${points}`;
  return isMoved;
}

function renderMaze (level = 0) {
  const table = document.createElement('table');
  tableDom = document.createElement('tbody');
  table.appendChild(tableDom);
  const maze = PacmanMAP[level].split('\n');
  for (let i = 0; i < maze.length; i++) {
    const nodes = maze[i].split('');
    const tr = document.createElement('tr');
    for (let j = 0; j < nodes.length; j++) {
      const td = document.createElement('td');
      td.id = `${j},${i}`;
      if (nodes[j] === 'X') {
        td.className = 'wall';
      }
      if (nodes[j] === '.') {
        td.className = 'd';
      }
      if (nodes[j] === 'P') {
        td.className = 'player';
        playerPos = [j, i];
      }
      tr.appendChild(td);
    }
    tableDom.appendChild(tr);
  }
  document.getElementById('body').appendChild(table);
}
