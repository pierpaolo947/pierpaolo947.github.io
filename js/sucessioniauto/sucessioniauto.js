const canvas = document.getElementById('turtleCanvas');
const ctx = canvas.getContext('2d');


// 1. Funzione per generare la sequenza di bit
function generaSuccessione(iterazioni) {
    let seq = "0";
    for (let i = 0; i < iterazioni; i++) {
        let nuovaSeq = "";
        for (let char of seq) {
            // Sostituisce ogni 0 con 01 e ogni 1 con 10
            nuovaSeq += (char === '0') ? "01" : "10";
        }
        seq = nuovaSeq;
    }
    return seq;
}

// 2. Funzione per disegnare sul Canvas
function disegna(iterazioni, lunghezzaPasso) {
    const sequenza = generaSuccessione(iterazioni);

    // Pulisce il canvas prima di disegnare
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#050805";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Posizione iniziale (centrata) e direzione
    let x = canvas.width / 2;
    let y = canvas.height / 2;
    let angolo = 0;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = "#35d26b"; // Colore della linea
    ctx.lineWidth = 2;

    for (let bit of sequenza) {
        if (bit === '0') {
            // Muove in avanti con penna giù
            x += lunghezzaPasso * Math.cos(angolo);
            y += lunghezzaPasso * Math.sin(angolo);
            ctx.lineTo(x, y);
        } else if (bit === '1') {
            // Ruota di 60 gradi in senso antiorario
            // (In JS i radianti negativi ruotano in senso antiorario visivamente)
            angolo -= Math.PI / 3;
        }
    }

    ctx.stroke();
}
const recursionSlider = document.querySelector('#recursionInput');
const lengthSlider = document.querySelector('#lengthInput');
let n = lengthSlider.value;
let l = recursionSlider.value;

// Esegue il disegno con 10 iterazioni e un passo di 5 pixel
disegna(l, n);


recursionSlider.addEventListener('input', (e) => {
    n = e.target.value;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    angolo = 0;
    x = canvas.width / 2;
    y = canvas.height / 2;
    disegna(n, l);
});


lengthSlider.addEventListener('input', (e) => {
    l = e.target.value;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    angolo = 0;
    x = canvas.width / 2;
    y = canvas.height / 2;
    disegna(n, l);
});