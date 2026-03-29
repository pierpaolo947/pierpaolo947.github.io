const canvas = document.querySelector("#turtle");
const ctx = canvas.getContext("2d");
const drawbtn = document.querySelector("#draw-btn");
const clearbtn = document.querySelector("#clear-btn");
const turtle = {
    x:0,
    y: 0,
    angle: 0,
    pendown: true,
    color: "lightblue",
    name: "tartaruga",
    turn:(a)=>{
        turtle.angle+=a;
    },
    forward:(p)=>{
        ctx.moveTo(turtle.x,turtle.y);
        let x2 = turtle.x + p * Math.cos(turtle.angle*(Math.PI/180));
        let y2 = turtle.y + p * Math.sin(turtle.angle*(Math.PI/180));
        
        if(turtle.pendown === true){
            ctx.lineTo(x2,y2);
            ctx.stroke();
        }else{
            ctx.moveTo(x2,y2);
        }
        turtle.x=x2;
        turtle.y=y2;
    } , 
    move:(x,y)=>{
        this.x = this.x+x;
        this.y = this.y+y;
        ctx.moveTo(this.x,this.y);

    }
}

function recuperaValore() {
    const polinomioStr = document.getElementById("funzione").value;
    return polinomioStr;
}

function recuperaValorex() {
    const puntoStr = document.getElementById("punto").value;
    return parseFloat(puntoStr);
}

function calcolaPolinomio(polinomioStr, x) {
    // Rimuovi spazi
    polinomioStr = polinomioStr.replace(/\s/g, '');
    
    // Aggiungi '+' all'inizio se non c'è segno
    if (polinomioStr[0] !== '+' && polinomioStr[0] !== '-') {
        polinomioStr = '+' + polinomioStr;
    }
    
    // Separa i termini usando regex
    const termini = polinomioStr.match(/[+-][^+-]+/g);
    
    let risultato = 0;
    
    termini.forEach(termine => {
        // Estrai coefficiente ed esponente
        let coefficiente = 1;
        let esponente = 0;
        
        if (termine.includes('x')) {
            // Separa coefficiente dalla parte con x
            const parti = termine.split('x');
            
            // Gestisci il coefficiente
            if (parti[0] === '+' || parti[0] === '') {
                coefficiente = 1;
            } else if (parti[0] === '-') {
                coefficiente = -1;
            } else {
                coefficiente = parseFloat(parti[0]);
            }
            
            // Gestisci l'esponente
            if (parti[1] === '') {
                esponente = 1; // Solo 'x' significa x^1
            } else {
                esponente = parseInt(parti[1]);
            }
        } else {
            // Termine costante (senza x)
            coefficiente = parseFloat(termine);
            esponente = 0;
        }
        
        // Calcola il contributo di questo termine
        risultato += coefficiente * Math.pow(x, esponente);
    });
    
    return risultato;
}


function getRandomColor() {
    let letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
  
function disegnafunzione(){
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const scalaX = 100;
    const scalaY = 100;
    
    ctx.beginPath();
    ctx.strokeStyle = getRandomColor();
    ctx.lineWidth = 2;
    for (let i = -1000; i <= 1000; i++) {
        const y = calcolaPolinomio(recuperaValore(), i / scalaX);
        const canvasX = centerX + i;
        const canvasY = centerY - (y * scalaY);
        
        if (i === -1000) {
            ctx.moveTo(canvasX, canvasY);
        } else {
            ctx.lineTo(canvasX, canvasY);
        }
    }
    
    ctx.stroke();
}

function disegnaAssi() {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    ctx.strokeStyle = "gray";
    ctx.lineWidth = 1;
    
    // Asse X
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(canvas.width, centerY);
    ctx.stroke();
    
    // Asse Y
    ctx.beginPath();
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, canvas.height);
    ctx.stroke();
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    disegnaAssi();
}
let circle = function(x2, y2, radios) {
    ctx.beginPath();
    ctx.arc(x2, y2, radios, 0, 2 * Math.PI);
    ctx.stroke();
}

function findpoint(x) {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const scalaX = 100;
    const scalaY = 100;
    
    const y = calcolaPolinomio(recuperaValore(), x);
    const canvasX = centerX + x * scalaX;
    const canvasY = centerY - (y * scalaY);
    
    ctx.beginPath();
    ctx.arc(canvasX, canvasY, 3, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.fillStyle = "red";
    ctx.fill(); 
}

function disegnagriglia(){
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const scalaX = 100;
    const scalaY = 100;
    ctx.strokeStyle = "lightgray";
    ctx.lineWidth = 0.5;
    for (let i = -1000; i <= 1000; i+=10) {
        const canvasX = centerX + i * scalaX;
        const canvasY = centerY - i * scalaY;
        // Linee verticali
        ctx.beginPath();
        ctx.moveTo(canvasX, 0);
        ctx.lineTo(canvasX, canvas.height);
        ctx.stroke();   
        // Linee orizzontali
        ctx.beginPath();
        ctx.moveTo(0, canvasY);
        ctx.lineTo(canvas.width, canvasY);
        ctx.stroke();
    }
}

disegnagriglia();
disegnaAssi();

drawbtn.addEventListener('click', () => {
    disegnafunzione();
    recuperaValore();
});

clearbtn.addEventListener('click', () => {
    clearCanvas();
});