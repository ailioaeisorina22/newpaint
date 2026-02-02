const myCanvas=document.getElementsByTagName("canvas")[0];
const ctx = myCanvas.getContext("2d");
const toolSelector = document.getElementById("instrumente");
let currentTool = "elipsa"; //instrumentul cu care desenam initial
let desenare = false;
let startX, startY;

const culoare = document.getElementById("color");
const grosime = document.getElementById("grosime");
const culoareContur = document.getElementById("colorContur");
// valori initiale
let culoareCurenta = "#000000";
let grosimeCurenta = 2;
let culoareConturCurenta = "#000000";
// actualizare la selectarea unei noi culori si grosimi
culoare.addEventListener("change", function(){
    culoareCurenta = culoare.value;
});
grosime.addEventListener("input", function(){
    grosimeCurenta = parseInt(grosime.value, 10);//converteste valoarea la un numar intreg in baza 10
});
culoareContur.addEventListener("change", function(){
    culoareConturCurenta = culoareContur.value;
});
// culoare pentru fundal
const culoareFundal = document.getElementById("colorBKG");
let culoareFundalCurenta = "#FFFFFF";
// actualizare culoare fundal
culoareFundal.addEventListener("change", function () {
    culoareFundalCurenta = culoareFundal.value;
    drawShapes(); // redesenam canvasul cu noua culoare de fundal
});


//stocam formele desenate in vector
const shapes = [];
toolSelector.addEventListener("change", function onToolChange() {
    currentTool = toolSelector.value;
});

//functii de desenare
function drawElipsa(shape) {
    ctx.strokeStyle = shape.culoareContur; 
    ctx.lineWidth = shape.grosime; 
    ctx.fillStyle = shape.culoare;
    ctx.ellipse(
        shape.centerX,
        shape.centerY,
        shape.radiusX,
        shape.radiusY,
        0,
        0,
        Math.PI * 2
    );
    ctx.fill(); 
}

function drawDreptunghi(shape) {
    ctx.strokeStyle = shape.culoareContur;
    ctx.lineWidth = shape.grosime; 
    ctx.fillStyle=shape.culoare;
    ctx.rect(shape.x, shape.y, shape.width, shape.height);
    ctx.fill();
}

function drawLinie(shape) {
    ctx.strokeStyle = shape.culoareContur;
    ctx.lineWidth = shape.grosime; 
    ctx.moveTo(shape.startX, shape.startY);
    ctx.lineTo(shape.endX, shape.endY);
}

function drawShapes() {
        ctx.fillStyle = culoareFundalCurenta;
        ctx.fillRect(0,0, myCanvas.width, myCanvas.height);

        for (let i = 0; i < shapes.length; i++) {
            const shape = shapes[i];
            ctx.beginPath();

            if (shape.tool === "elipsa") {
                drawElipsa(shape);
            } else if (shape.tool === "dreptunghi") {
                drawDreptunghi(shape);
            } else if (shape.tool === "linie") {
                drawLinie(shape);
            }

            ctx.stroke();
        }
}
//functii de preview
function previewElipsa(x, y) {
    ctx.ellipse(
    (startX + x) / 2,
    (startY + y) / 2,
    Math.abs(x - startX) / 2,
    Math.abs(y - startY) / 2,
    0,
    0,
    Math.PI * 2);
}
function previewDreptunghi(x, y) {
    ctx.rect(
        Math.min(startX, x),
        Math.min(startY, y),
        Math.abs(x - startX),
        Math.abs(y - startY)
    );
}
function previewLinie(x, y) {
    ctx.moveTo(startX, startY);
    ctx.lineTo(x, y);
}

function drawPreview(x, y) {
        drawShapes(); // redesenam toate formele deja finalizate
        ctx.beginPath();
        ctx.strokeStyle = culoareConturCurenta;
        ctx.lineWidth = grosimeCurenta;
        if (currentTool === "elipsa") {
            previewElipsa(x, y);
        } else if (currentTool === "dreptunghi") {
            previewDreptunghi(x, y);
        } else if (currentTool === "linie") {
            previewLinie(x, y);
        }
        ctx.stroke();
}

myCanvas.addEventListener("mousedown", function(evt){
    desenare=true;
    startX = evt.offsetX; //pozitia mouseului pe axa X
    startY = evt.offsetY;//--- pe axa Y
});

myCanvas.addEventListener("mousemove", function(evt){
    if(desenare)
    {
        drawPreview(evt.offsetX, evt.offsetY);
    }
});

canvas.addEventListener("mouseup", function(evt){
    if (desenare) {
        desenare = false;

        // salvam forma desenata in arrayul shapes
        const endX = evt.offsetX;
        const endY = evt.offsetY;

        if(currentTool=== "elipsa"){
                shapes.push({
                    tool: "elipsa",
                    centerX: (startX + endX) / 2,
                    centerY: (startY + endY) / 2,
                    radiusX: Math.abs(endX - startX) / 2,
                    radiusY: Math.abs(endY - startY) / 2,
                    culoare: culoareCurenta,
                    grosime: grosimeCurenta,
                    culoareContur: culoareConturCurenta
                });
            }
        else if(currentTool==="dreptunghi"){
                shapes.push({
                    tool: "dreptunghi",
                    x: Math.min(startX, endX),
                    y: Math.min(startY, endY),
                    width: Math.abs(endX - startX),
                    height: Math.abs(endY - startY),
                    culoare: culoareCurenta,
                    grosime: grosimeCurenta,
                    culoareContur: culoareConturCurenta
                });}
        else if(currentTool==="linie"){
                shapes.push({
                    tool: "linie",
                    startX: startX,
                    startY: startY,
                    endX: endX,
                    endY: endY,
                    culoare: culoareCurenta,
                    grosime: grosimeCurenta,
                    culoareContur: culoareConturCurenta
                });}
    }
    drawShapes();
    actualizareListaForme();
});

//salvare canvas - PNG
document.getElementById("salvare").addEventListener("click", function(){
        const imgURL = myCanvas.toDataURL("image/png"); //convertește conținutul canvas-ului într-un URL care reprezintă imaginea în format PNG.
        //imgURL - Data URL care poate fi utilizat pentru a crea o imagine din ceea ce este desenat pe canvas
        //creem un elem <a> pt descarcare
        const linkDescarcare = document.createElement("a");//creeaza un link html
        linkDescarcare.href=imgURL;//URL-ul imaginii generat anterior (acesta va fi sursa pentru fișierul de descărcat).//linkul spre fisierul care contine imaginea csv
        linkDescarcare.download = "desenCanvas.png";//atribut - numele fis desc

        //click pe link pentru a initia descarcarea
        linkDescarcare.click();
});

function actualizareListaForme(){ // afisare lista de forme
    const lista = document.getElementById('lista');
    lista.innerHTML=''; //golim lista

    //parcurgem elementele si le adaugam in lista
    for(let i=0;i<shapes.length;i++){
        const item = document.createElement("li");
        item.textContent =`${i+1}. ${shapes[i].tool} - culoare: ${shapes[i].culoare}`;
        //creem un btn de stergere pentru fiecare elem din lsita
        const stergereBtn = document.createElement("button");
        stergereBtn.textContent="Sterge element";
        //creem evenimentul de stergere
        stergereBtn.addEventListener("click", function(){
            stergereFigura(i);
        });

        item.appendChild(stergereBtn);//adaug btn in lista
        lista.appendChild(item);
    }
}

//stergere elem din lista
function stergereFigura(index){
    
    if(index>=0 && index<shapes.length){
        shapes.splice(index,1);
        drawShapes();
        actualizareListaForme();
    }
    else{
        console.log("Index", index, " invalid!");
    }
}