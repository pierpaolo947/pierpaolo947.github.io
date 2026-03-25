let canvas = document.querySelector("#canvas");
let hot = document.querySelector("#hot");
let cold = document.querySelector("#cold");
let idk = document.querySelector("#idk");

function cotttonpicker(){
    let r = Math.floor(Math.random()*256);
    let g = Math.floor(Math.random()*100);
    let b = Math.floor(Math.random()*100);
    let color  = `rgb(${r},${g},${b})`;
    return color;
}

function refreshcolor(){
    canvas.style.backgroundColor = cotttonpicker();
}


hot.addEventListener("click", function(){
    refreshcolor();
});

cold.addEventListener("click", function(){
    refreshcolor();
});

idk.addEventListener("click"    , function(){
    refreshcolor();
});


refreshcolor();