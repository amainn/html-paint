const canvas = document.getElementById("test")
const ctx = canvas.getContext('2d')

const colorStr = document.getElementById('colorStr');
const widthStr = document.getElementById('widthStr');

let color, width = 0

let undo_stack = []
let redo_stack = []

const undo_button = document.getElementById('undo');
const redo_button = document.getElementById('redo');

undo_button.addEventListener('click', undo);
redo_button.addEventListener('click', redo);

function restoreCanvas(dataURL) {
  const img = new Image();
  img.onload = () => {
    clearCanvas();
    ctx.drawImage(img, 0, 0);
  };
  img.src = dataURL;
}

function saveUndoState() {
  undo_stack.push(canvas.toDataURL());
  redo_stack = []
}

function undo() {
  if(undo_stack.length > 1) {
    redo_stack.push(undo_stack.pop())
    restoreCanvas(undo_stack[undo_stack.length - 1])
  }
}

function redo() {
  if (redo_stack.length > 0) {
    const state = redo_stack.pop()
    undo_stack.push(state)
    restoreCanvas(state)
  }
}


saveUndoState();

colorStr.addEventListener('input', () => {
  color = colorStr.value
  console.log(color)
})

widthStr.addEventListener('input', () => {
  width = widthStr.value
  console.log(width)
})

let x = canvas.width / 2
let y = 0

let drawStr = false

canvas.addEventListener('mousedown', (e) =>
{
  x = e.offsetX
  y = e.offsetY
  drawStr = true

  if (drawStr) {
    ctx.lineWidth = width;
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.moveTo(x, y);
  }
})

canvas.addEventListener('mousemove', (e) =>
{
  x = e.offsetX
  y = e.offsetY

  if (drawStr) {
    ctx.lineTo(x, y);
    ctx.stroke();
  }
})

canvas.addEventListener('mouseup', (e) =>
{
  ctx.closePath();
  drawStr = false
  saveUndoState();
})

function clearCanvas() {
  ctx.clearRect(0,0,canvas.width, canvas.height);
}

const button = document.getElementById('clearAll');

button.addEventListener('click', clearCanvas);

