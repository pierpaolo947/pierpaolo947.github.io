
let canvas = document.querySelector("#canvas");
let height = canvas.height;
let width = canvas.width;
let ctx = canvas.getContext("2d");

let turtle = {
    x: 0,
    y: 0,
    angle: 0,
    penDown: false,
    color: "green",
    moveForward(l) {
        ctx.beginPath();
        ctx.strokeStyle = this.color;
        ctx.moveTo(this.x, this.y);
        this.x = this.x + Math.cos(-this.angle) * l;
        this.y = this.y + Math.sin(-this.angle) * l;
        if (this.penDown) {
            ctx.lineTo(this.x, this.y);
        } else {
            ctx.moveTo(this.x, this.y);
        }
        ctx.stroke();
    },
    setAngle(a) {
        this.angle = a;
    },
    liftPen() {
        this.penDown = false;
    },
    putPenDown() {
        this.penDown = true;
    }
}

let l = 200;
let n = 10;
let ba = Math.PI / 6;
let cx = width / 2;
let cy = height / 2;
turtle.x = cx;
turtle.y = cy;

clear();
turtle.putPenDown();
drawTree(cx, cy, 0, l, n);

const recursionSlider = document.querySelector('#recursionInput');
recursionSlider.addEventListener('input', (e) => {
    n = Number(e.target.value);
    clear();
    drawTree(cx, cy, 0, l, n, ba);
});

const angleSlider = document.querySelector('#angleInput');
angleSlider.addEventListener('input', (e) => {
    ba = Number(e.target.value); //branching angle
    ba = toRadian(ba);
    clear();
    drawTree(cx, cy, 0, l, n, ba);
});

function drawTree(x, y, a, l, n, ba) {
    //ba is branching angle
    if (n <= 0) {
        return;
    }
    turtle.x = x;
    turtle.y = y;
    let verteces = drawV(x, y, a, l);
    drawTree(verteces[0].x, verteces[0].y, a - ba, l / 2, n - 1, ba);
    drawTree(verteces[1].x, verteces[1].y, a + ba, l / 2, n - 1, ba);
}

function drawV(x, y, a, l) {
    let points = [];
    turtle.x = x;
    turtle.y = y;
    turtle.setAngle(a);
    turtle.setAngle(turtle.angle + Math.PI / 3);
    turtle.putPenDown();
    turtle.moveForward(l);
    points.push({
        x: turtle.x,
        y: turtle.y
    });
    turtle.liftPen();
    turtle.setAngle(turtle.angle + Math.PI);
    turtle.moveForward(l);
    turtle.setAngle(turtle.angle - (Math.PI * 2 / 3));
    turtle.putPenDown();
    turtle.moveForward(l);
    points.push({
        x: turtle.x,
        y: turtle.y
    });
    return points;
}

function toRadian(degrees) {
    return degrees * (Math.PI / 180);
}

function clear(ts = 350) { //ts is trunk size
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, width, height);
    ctx.fillRect(0, height / 2 + ts, width, height - (height / 2 + ts));
    ctx.beginPath();
    ctx.strokeStyle = "black";
    ctx.moveTo(width / 2, height / 2);
    ctx.lineTo(width / 2, height / 2 + ts);
    ctx.moveTo(0, height / 2 + ts);
    ctx.stroke();
    ctx.beginPath();
    ctx.strokeStyle = "white";
    ctx.moveTo(0, height / 2 + ts);
    ctx.lineTo(width, height / 2 + ts);
    ctx.stroke();
}