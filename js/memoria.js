
/* ==========================================
   MEMORIA - JUGÁ CON BAUTI
========================================== */

// PERSONAJES DISPONIBLES

const personajesMemoria = [
    "bartolito",
    "bataraza",
    "beto",
    "juan",
    "lechuzas",
    "lola",
    "maria",
    "pajaron",
    "pancha",
    "pepe",
    "percheron",
    "pollito",
    "tito",
    "zenon"
];

// ELEMENTOS DE LA PANTALLA

const tableroMemoria = document.getElementById("tableroMemoria");
const botonesNivel = document.querySelectorAll(".nivelMemoria");

const parejasEncontradasTexto = document.getElementById("parejasEncontradas");
const totalParejasTexto = document.getElementById("totalParejas");

const botonReiniciar = document.getElementById("reiniciarMemoria");
const botonVolver = document.getElementById("volverInicioMemoria");

const mensajeMemoria = document.getElementById("mensajeMemoria");

// ESTADO DEL JUEGO

let cantidadParejas = 3;
let primeraCarta = null;
let segundaCarta = null;
let tableroBloqueado = false;
let parejasEncontradas = 0;
let temporizadorCartas = null;
let temporizadorMensaje = null;

// MEZCLAR ELEMENTOS

function mezclarMemoria(elementos) {
    const resultado = [...elementos];

    for (let i = resultado.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));

        [resultado[i], resultado[j]] = [resultado[j], resultado[i]];
    }

    return resultado;
}

// CREAR UNA PARTIDA

function iniciarMemoria() {

    clearTimeout(temporizadorCartas);
    clearTimeout(temporizadorMensaje);

    primeraCarta = null;
    segundaCarta = null;
    tableroBloqueado = false;
    parejasEncontradas = 0;

    mensajeMemoria.classList.remove("mostrar");

    parejasEncontradasTexto.textContent = "0";
    totalParejasTexto.textContent = cantidadParejas;

    // Elegimos personajes diferentes al azar
    const seleccionados = mezclarMemoria(personajesMemoria)
        .slice(0, cantidadParejas);

    // Duplicamos cada personaje para crear su pareja
    const cartas = mezclarMemoria([
        ...seleccionados,
        ...seleccionados
    ]);

    tableroMemoria.innerHTML = "";

    tableroMemoria.classList.remove("facil", "medio", "dificil");

    if (cantidadParejas === 3) {
        tableroMemoria.classList.add("facil");
    } else if (cantidadParejas === 6) {
        tableroMemoria.classList.add("medio");
    } else {
        tableroMemoria.classList.add("dificil");
    }

    // Creamos las cartas
    cartas.forEach((personaje, indice) => {

        const carta = document.createElement("button");

        carta.type = "button";
        carta.className = "cartaMemoria";
        carta.dataset.personaje = personaje;
        carta.setAttribute("aria-label", `Carta ${indice + 1}, boca abajo`);

        carta.innerHTML = `
            <span class="interiorCarta">

                <span class="caraCarta dorsoCarta">
                    <span class="simboloCarta">?</span>
                </span>

                <span class="caraCarta frenteCarta">
                    <img
                        src="imagenes/memoria/${personaje}.png"
                        alt="${personaje}"
                        draggable="false"
                    >
                </span>

            </span>
        `;

        carta.addEventListener("click", () => seleccionarCarta(carta));

        tableroMemoria.appendChild(carta);
    });
}

// SELECCIONAR UNA CARTA

function seleccionarCarta(carta) {

    if (tableroBloqueado) return;

    if (carta.classList.contains("descubierta")) return;
    if (carta.classList.contains("encontrada")) return;

    carta.classList.add("descubierta");
    carta.setAttribute(
        "aria-label",
        `Carta descubierta: ${carta.dataset.personaje}`
    );

    if (primeraCarta === null) {
        primeraCarta = carta;
        return;
    }

    segundaCarta = carta;
    tableroBloqueado = true;

    comprobarPareja();
}

// COMPROBAR SI SON IGUALES

function comprobarPareja() {

    const sonIguales =
        primeraCarta.dataset.personaje === segundaCarta.dataset.personaje;

    if (sonIguales) {

        primeraCarta.classList.add("encontrada");
        segundaCarta.classList.add("encontrada");

        primeraCarta.disabled = true;
        segundaCarta.disabled = true;

        parejasEncontradas++;

        parejasEncontradasTexto.textContent = parejasEncontradas;

        reiniciarSeleccion();

        if (parejasEncontradas === cantidadParejas) {
            finalizarMemoria();
        }

    } else {

        // Dejamos las cartas visibles un momento
        temporizadorCartas = setTimeout(() => {

            primeraCarta.classList.remove("descubierta");
            segundaCarta.classList.remove("descubierta");

            primeraCarta.setAttribute("aria-label", "Carta boca abajo");
            segundaCarta.setAttribute("aria-label", "Carta boca abajo");

            reiniciarSeleccion();

        }, 1100);
    }
}

// LIMPIAR LA SELECCIÓN

function reiniciarSeleccion() {
    primeraCarta = null;
    segundaCarta = null;
    tableroBloqueado = false;
}

// FINALIZAR PARTIDA

function finalizarMemoria() {

    temporizadorMensaje = setTimeout(() => {

        mensajeMemoria.classList.add("mostrar");

        temporizadorMensaje = setTimeout(() => {
            mensajeMemoria.classList.remove("mostrar");
        }, 2300);

    }, 500);
}

// CAMBIAR DIFICULTAD

botonesNivel.forEach(boton => {

    boton.addEventListener("click", () => {

        cantidadParejas = Number(boton.dataset.parejas);

        botonesNivel.forEach(b => b.classList.remove("activo"));

        boton.classList.add("activo");

        iniciarMemoria();
    });
});

// REINICIAR

botonReiniciar.addEventListener("click", iniciarMemoria);

// VOLVER AL INICIO

botonVolver.addEventListener("click", () => {
    window.location.href = "index.html";
});

// INICIAR AL ABRIR LA PÁGINA

iniciarMemoria();
