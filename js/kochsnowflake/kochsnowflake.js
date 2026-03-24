let canvas = document.querySelector("#canvas");
let height = canvas.height;
let width = canvas.width;
let ctx = canvas.getContext("2d");
let turtle = {
    x: 0,
    y: 0,
    angle: 0,
    penDown: false,
    color: "black",
    moveForward(l) {
        ctx.strokeStyle = this.color;
        ctx.moveTo(this.x, this.y);
        this.x = this.x + Math.cos(-this.angle) * l;
        this.y = this.y + Math.sin(-this.angle) * l;
        if (this.penDown) {
            ctx.lineTo(this.x, this.y);
        } else {
            ctx.moveTo(this.x, this.y);
        }
    },
    setAngle(a) {
        this.angle = a;
    },
    liftPen() {
        this.penDown = false;
    },
    putPenDown() {
        this.penDown = true;
    },
    reset() {
        turtle.angle = 0;
        turtle.x = width / 2 - l * 1.5;
        turtle.y = height / 2 - l;
    }
}
let l = 100;
let n = 4;
turtle.reset();
turtle.putPenDown();

const recursionSlider = document.querySelector('#recursionInput');
recursionSlider.addEventListener('input', (e) => {
    n = e.target.value;
    clear();
    turtle.reset();
    drawTriangle(l, n);
});

const lengthSlider = document.querySelector('#lengthInput');
lengthSlider.addEventListener('input', (e) => {
    l = e.target.value;
    clear();
    turtle.reset();
    drawTriangle(l, n);
});

clear();
drawTriangle(l, n);

function drawTriangle(l, n) {
    ctx.beginPath();
    drawEdge(l, n);
    turtle.setAngle(turtle.angle - Math.PI * 2 / 3);
    drawEdge(l, n);
    turtle.setAngle(turtle.angle - Math.PI * 2 / 3);
    drawEdge(l, n);
    ctx.stroke();
}

function drawEdge(l, n) {
    if (n == 0) {
        turtle.moveForward(l);
        turtle.setAngle(turtle.angle + Math.PI / 3);
        turtle.moveForward(l);
        turtle.setAngle(turtle.angle - Math.PI * 2 / 3);
        turtle.moveForward(l);
        turtle.setAngle(turtle.angle + Math.PI / 3);
        turtle.moveForward(l);
        return;
    }
    drawEdge(l / 3, n - 1);
    turtle.setAngle(turtle.angle + Math.PI / 3);
    drawEdge(l / 3, n - 1);
    turtle.setAngle(turtle.angle - Math.PI * 2 / 3);
    drawEdge(l / 3, n - 1);
    turtle.setAngle(turtle.angle + Math.PI / 3);
    drawEdge(l / 3, n - 1);
}

function clear() {
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, width, height);
    ctx.fillRect(0, 0, width, height);
}