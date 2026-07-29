const parametros = new URLSearchParams(window.location.search);
const archivo = parametros.get("dibujo");

const imagen = document.getElementById("dibujo");
const canvas = document.getElementById("lienzoPintura");
const contexto = canvas.getContext("2d");

const botonLimpiar = document.getElementById("limpiar");
const botonVolver = document.getElementById("volver");

let dibujando = false;
let colorActual = "#ff3b30";
let grosorActual = 18;

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
}

function limpiarLienzo() {

    contexto.clearRect(0, 0, canvas.width, canvas.height);

    contexto.fillStyle = "#ffffff";
    contexto.fillRect(0, 0, canvas.width, canvas.height);
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
    contexto.moveTo(posicion.x, posicion.y);

    // Permite hacer puntos con un solo toque.
    contexto.fillStyle = colorActual;

    contexto.beginPath();
    contexto.arc(
        posicion.x,
        posicion.y,
        grosorActual / 2,
        0,
        Math.PI * 2
    );

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

    contexto.strokeStyle = colorActual;
    contexto.lineWidth = grosorActual;

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

    if (canvas.hasPointerCapture(evento.pointerId)) {
        canvas.releasePointerCapture(evento.pointerId);
    }
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

botonLimpiar.addEventListener("click", () => {

    const confirmar = confirm("¿Querés borrar todo lo pintado?");

    if (confirmar) {
        limpiarLienzo();
    }

});

botonVolver.addEventListener("click", () => {
    window.location.href = "index.html";
});