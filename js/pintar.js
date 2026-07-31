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
const botonBalde = document.getElementById("balde");
const botonGuardar = document.getElementById("guardar");
const mensajeGuardado = document.getElementById("mensajeGuardado");

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

function convertirColorARegistro(colorHexadecimal) {

    const color = colorHexadecimal.replace("#", "");

    return {
        r: parseInt(color.substring(0, 2), 16),
        g: parseInt(color.substring(2, 4), 16),
        b: parseInt(color.substring(4, 6), 16),
        a: 255
    };
}

function coloresParecidos(datos, indice, colorObjetivo, tolerancia) {

    return (
        Math.abs(datos[indice] - colorObjetivo.r) <= tolerancia &&
        Math.abs(datos[indice + 1] - colorObjetivo.g) <= tolerancia &&
        Math.abs(datos[indice + 2] - colorObjetivo.b) <= tolerancia &&
        Math.abs(datos[indice + 3] - colorObjetivo.a) <= tolerancia
    );
}

function usarBalde(posicion) {

    const ancho = canvas.width;
    const alto = canvas.height;

    const xInicial = Math.floor(posicion.x);
    const yInicial = Math.floor(posicion.y);

    if (
        xInicial < 0 ||
        yInicial < 0 ||
        xInicial >= ancho ||
        yInicial >= alto
    ) {
        return;
    }

    /*
     * Este canvas temporal junta:
     * 1. El dibujo original.
     * 2. Lo que ya pintamos.
     *
     * Así el balde puede reconocer tanto las líneas negras
     * como la pintura existente.
     */
    const canvasTemporal = document.createElement("canvas");
    canvasTemporal.width = ancho;
    canvasTemporal.height = alto;

    const contextoTemporal = canvasTemporal.getContext("2d", {
        willReadFrequently: true
    });

    contextoTemporal.drawImage(imagen, 0, 0, ancho, alto);
    contextoTemporal.drawImage(canvas, 0, 0);

    const imagenCompuesta = contextoTemporal.getImageData(
        0,
        0,
        ancho,
        alto
    );

    const datos = imagenCompuesta.data;
    const indiceInicial = (yInicial * ancho + xInicial) * 4;

    const colorObjetivo = {
        r: datos[indiceInicial],
        g: datos[indiceInicial + 1],
        b: datos[indiceInicial + 2],
        a: datos[indiceInicial + 3]
    };

    const colorNuevo = convertirColorARegistro(colorActual);

    /*
     * Si tocamos una zona que ya tiene prácticamente
     * el mismo color, no hacemos nada.
     */
    const diferenciaColor =
        Math.abs(colorObjetivo.r - colorNuevo.r) +
        Math.abs(colorObjetivo.g - colorNuevo.g) +
        Math.abs(colorObjetivo.b - colorNuevo.b);

    if (diferenciaColor < 15) {
        return;
    }

    const pinturaActual = contexto.getImageData(
        0,
        0,
        ancho,
        alto
    );

    const datosPintura = pinturaActual.data;

    const visitados = new Uint8Array(ancho * alto);
    const pendientes = [[xInicial, yInicial]];

    /*
     * Una tolerancia moderada permite incluir pequeñas
     * variaciones del fondo sin atravesar las líneas negras.
     */
    const tolerancia = 35;

    while (pendientes.length > 0) {

        const [x, y] = pendientes.pop();
        const posicionLineal = y * ancho + x;

        if (visitados[posicionLineal]) {
            continue;
        }

        visitados[posicionLineal] = 1;

        const indice = posicionLineal * 4;

        if (
            !coloresParecidos(
                datos,
                indice,
                colorObjetivo,
                tolerancia
            )
        ) {
            continue;
        }

        datosPintura[indice] = colorNuevo.r;
        datosPintura[indice + 1] = colorNuevo.g;
        datosPintura[indice + 2] = colorNuevo.b;
        datosPintura[indice + 3] = colorNuevo.a;

        if (x > 0) {
            pendientes.push([x - 1, y]);
        }

        if (x < ancho - 1) {
            pendientes.push([x + 1, y]);
        }

        if (y > 0) {
            pendientes.push([x, y - 1]);
        }

        if (y < alto - 1) {
            pendientes.push([x, y + 1]);
        }
    }

    contexto.globalCompositeOperation = "source-over";
    contexto.putImageData(pinturaActual, 0, 0);

    guardarEstado();
}

function comenzarDibujo(evento) {

    evento.preventDefault();

    const posicion = obtenerPosicion(evento);

    if (herramientaActual === "balde") {

        usarBalde(posicion);
        return;
    }

    dibujando = true;

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

    // Mostrar felicitación
    mensajeGuardado.classList.add("mostrar");

    clearTimeout(mensajeGuardado.temporizador);

    mensajeGuardado.temporizador = setTimeout(() => {
        mensajeGuardado.classList.remove("mostrar");
    }, 1800);
}

canvas.addEventListener("pointerdown", (evento) => {

    comenzarDibujo(evento);

    if (
        herramientaActual !== "balde" &&
        dibujando
    ) {
        canvas.setPointerCapture(evento.pointerId);
    }

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

botonPincel.addEventListener("click", () => {
    herramientaActual = "pincel";

    botonPincel.classList.add("activa");
    botonGoma.classList.remove("activa");
    botonBalde.classList.remove("activa");
});

botonGoma.addEventListener("click", () => {
    herramientaActual = "goma";

    botonGoma.classList.add("activa");
    botonPincel.classList.remove("activa");
    botonBalde.classList.remove("activa");
});

botonBalde.addEventListener("click", () => {

    herramientaActual = "balde";

    botonBalde.classList.add("activa");
    botonPincel.classList.remove("activa");
    botonGoma.classList.remove("activa");
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