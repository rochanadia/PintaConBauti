const parametros = new URLSearchParams(window.location.search);
const archivo = parametros.get("dibujo");

const imagen = document.getElementById("dibujo");
const canvas = document.getElementById("lienzoPintura");
const contexto = canvas.getContext("2d");

const botonLimpiar = document.getElementById("limpiar");
const botonDeshacer = document.getElementById("deshacer");
const botonVolver = document.getElementById("volver");

const botonPincel = document.getElementById("pincel");
const botonGoma = document.getElementById("goma");
const botonGuardar = document.getElementById("guardar");

let dibujando = false;
let colorActual = "#ff3b30";
let grosorActual = 18;
let herramientaActual = "pincel";
let historial = [];
const limiteHistorial = 20;

if (!archivo) {
    alert("No se encontró el dibujo.");
    window.location.href = "index.html";
} else {
    imagen.src = `dibujos/${archivo}`;
}

imagen.addEventListener("load", prepararLienzo);

function prepararLienzo() {

    canvas.width = imagen.naturalWidth;
    canvas.height = imagen.naturalHeight;

    contexto.lineCap = "round";
    contexto.lineJoin = "round";

    limpiarLienzo();

    historial = [];
    guardarEstado();
}

function limpiarLienzo() {

    contexto.clearRect(0, 0, canvas.width, canvas.height);
}

function guardarEstado() {

    if (historial.length >= limiteHistorial) {
        historial.shift();
    }

    historial.push(canvas.toDataURL());

    actualizarBotonDeshacer();
}

function actualizarBotonDeshacer() {
    botonDeshacer.disabled = historial.length <= 1;
}

function deshacer() {

    if (historial.length <= 1) {
        return;
    }

    historial.pop();

    const estadoAnterior = historial[historial.length - 1];
    const imagenEstado = new Image();

    imagenEstado.onload = () => {

        contexto.clearRect(0, 0, canvas.width, canvas.height);
        contexto.drawImage(imagenEstado, 0, 0);

        actualizarBotonDeshacer();
    };

    imagenEstado.src = estadoAnterior;
}

function obtenerPosicion(evento) {

    const rectangulo = canvas.getBoundingClientRect();

    const escalaX = canvas.width / rectangulo.width;
    const escalaY = canvas.height / rectangulo.height;

    return {
        x: (evento.clientX - rectangulo.left) * escalaX,
        y: (evento.clientY - rectangulo.top) * escalaY
    };
}

function comenzarDibujo(evento) {

    evento.preventDefault();

    dibujando = true;

    const posicion = obtenerPosicion(evento);

    contexto.beginPath();

    if (herramientaActual === "goma") {

        contexto.globalCompositeOperation = "destination-out";
        contexto.fillStyle = "#000000";

        contexto.arc(
            posicion.x,
            posicion.y,
            grosorActual,
            0,
            Math.PI * 2
        );

    } else {

        contexto.globalCompositeOperation = "source-over";
        contexto.fillStyle = colorActual;

        contexto.arc(
            posicion.x,
            posicion.y,
            grosorActual / 2,
            0,
            Math.PI * 2
        );
    }

    contexto.fill();

    contexto.beginPath();
    contexto.moveTo(posicion.x, posicion.y);
}

function dibujar(evento) {

    if (!dibujando) {
        return;
    }

    evento.preventDefault();

    const posicion = obtenerPosicion(evento);

    if (herramientaActual === "goma") {
        contexto.globalCompositeOperation = "destination-out";
        contexto.lineWidth = grosorActual * 2;
    } else {
        contexto.globalCompositeOperation = "source-over";
        contexto.strokeStyle = colorActual;
        contexto.lineWidth = grosorActual;
    }

    contexto.lineTo(posicion.x, posicion.y);
    contexto.stroke();

    contexto.beginPath();
    contexto.moveTo(posicion.x, posicion.y);
}

function terminarDibujo(evento) {

    if (!dibujando) {
        return;
    }

    evento.preventDefault();

    dibujando = false;
    contexto.beginPath();

    guardarEstado();

    if (canvas.hasPointerCapture(evento.pointerId)) {
        canvas.releasePointerCapture(evento.pointerId);
    }
}

function guardarDibujo() {

    // Crear un canvas temporal
    const canvasFinal = document.createElement("canvas");
    canvasFinal.width = imagen.naturalWidth;
    canvasFinal.height = imagen.naturalHeight;

    const contextoFinal = canvasFinal.getContext("2d");

    // Primero el dibujo
    contextoFinal.drawImage(imagen, 0, 0);

    // Después la pintura
    contextoFinal.drawImage(canvas, 0, 0);

    // Descargar
    const enlace = document.createElement("a");

    const nombre = archivo.replace(/\.[^/.]+$/, "");

    enlace.download = `${nombre}-pintado.png`;
    enlace.href = canvasFinal.toDataURL("image/png");

    enlace.click();
}

canvas.addEventListener("pointerdown", (evento) => {

    canvas.setPointerCapture(evento.pointerId);
    comenzarDibujo(evento);

});

canvas.addEventListener("pointermove", dibujar);
canvas.addEventListener("pointerup", terminarDibujo);
canvas.addEventListener("pointercancel", terminarDibujo);

document.querySelectorAll(".color").forEach((boton) => {

    boton.addEventListener("click", () => {

        colorActual = boton.dataset.color;

        herramientaActual = "pincel";

        botonPincel.classList.add("activa");
        botonGoma.classList.remove("activa");

        document.querySelectorAll(".color").forEach((color) => {
            color.classList.remove("activo");
        });

        boton.classList.add("activo");
    });

});

document.querySelectorAll(".grosor").forEach((boton) => {

    boton.addEventListener("click", () => {

        grosorActual = Number(boton.dataset.grosor);

        document.querySelectorAll(".grosor").forEach((grosor) => {
            grosor.classList.remove("activo");
        });

        boton.classList.add("activo");
    });

});

botonPincel.addEventListener("click", () => {
    herramientaActual = "pincel";

    botonPincel.classList.add("activa");
    botonGoma.classList.remove("activa");
});

botonGoma.addEventListener("click", () => {
    herramientaActual = "goma";

    botonGoma.classList.add("activa");
    botonPincel.classList.remove("activa");
});

botonDeshacer.addEventListener("click", deshacer);

botonGuardar.addEventListener("click", guardarDibujo);

botonLimpiar.addEventListener("click", () => {

    const confirmar = confirm("¿Querés borrar todo lo pintado?");

    if (confirmar) {
        limpiarLienzo();
        guardarEstado();
    }

});

botonVolver.addEventListener("click", () => {
    window.location.href = "index.html";
});