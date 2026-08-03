const parametros = new URLSearchParams(window.location.search);
const archivo = parametros.get("imagen");

const imagenReferencia =
    document.getElementById("imagenReferencia");

const tablero =
    document.getElementById("tableroRompecabezas");

const contenedorPiezas =
    document.getElementById("piezasRompecabezas");

const botonVolver =
    document.getElementById("volverGaleriaRompecabezas");

const botonMezclar =
    document.getElementById("mezclarRompecabezas");

const mensajeRompecabezas =
    document.getElementById("mensajeRompecabezas");

const cantidadFilas = 2;
const cantidadColumnas = 2;
const cantidadPiezas = cantidadFilas * cantidadColumnas;

let piezasCorrectas = 0;
let piezaArrastrada = null;
let desplazamientoX = 0;
let desplazamientoY = 0;

if (!archivo) {

    alert("No se encontró la imagen.");

    window.location.href =
        "rompecabezas-galeria.html";

} else {

    imagenReferencia.src =
        `rompecabezas/${archivo}`;

    imagenReferencia.addEventListener(
        "load",
        crearRompecabezas
    );
}

function crearRompecabezas() {

    tablero.innerHTML = "";
    contenedorPiezas.innerHTML = "";

    piezasCorrectas = 0;
    
    const proporcionImagen =
        imagenReferencia.naturalWidth /
        imagenReferencia.naturalHeight;

    tablero.style.setProperty(
        "--proporcion-imagen",
        proporcionImagen
    );

    const proporcionPieza =
        proporcionImagen;

    document.documentElement.style.setProperty(
        "--proporcion-pieza",
        proporcionPieza
    );

    const posiciones = mezclarArray(
        Array.from(
            { length: cantidadPiezas },
            (_, indice) => indice
        )
    );

    for (let indice = 0; indice < cantidadPiezas; indice++) {

        crearCasillero(indice);

        crearPieza(
            posiciones[indice]
        );
    }
}

function crearCasillero(indice) {

    const casillero = document.createElement("div");

    casillero.className = "casilleroRompecabezas";
    casillero.dataset.posicion = indice;

    tablero.appendChild(casillero);
}

function crearPieza(indice) {

    const fila =
        Math.floor(indice / cantidadColumnas);

    const columna =
        indice % cantidadColumnas;

    const pieza = document.createElement("div");

    pieza.className = "piezaRompecabezas";
    pieza.dataset.posicionCorrecta = indice;

    pieza.style.backgroundImage =
        `url("rompecabezas/${archivo}")`;

    pieza.style.backgroundSize =
        `${cantidadColumnas * 100}% ${cantidadFilas * 100}%`;

    pieza.style.backgroundPosition =
        `${columna * 100}% ${fila * 100}%`;

    pieza.addEventListener(
        "pointerdown",
        comenzarArrastre
    );

    contenedorPiezas.appendChild(pieza);
}

function comenzarArrastre(evento) {

    const pieza = evento.currentTarget;

    if (pieza.classList.contains("correcta")) {
        return;
    }

    evento.preventDefault();

    piezaArrastrada = pieza;

    const rectangulo = pieza.getBoundingClientRect();

    desplazamientoX =
        evento.clientX - rectangulo.left;

    desplazamientoY =
        evento.clientY - rectangulo.top;

    pieza.classList.add("arrastrando");

    pieza.style.width =
        `${rectangulo.width}px`;

    pieza.style.height =
        `${rectangulo.height}px`;

    pieza.style.position = "fixed";
    pieza.style.zIndex = "1000";

    moverPieza(evento);

    pieza.setPointerCapture(evento.pointerId);

    pieza.addEventListener(
        "pointermove",
        moverPieza
    );

    pieza.addEventListener(
        "pointerup",
        terminarArrastre
    );

    pieza.addEventListener(
        "pointercancel",
        terminarArrastre
    );
}

function moverPieza(evento) {

    if (!piezaArrastrada) {
        return;
    }

    evento.preventDefault();

    piezaArrastrada.style.left =
        `${evento.clientX - desplazamientoX}px`;

    piezaArrastrada.style.top =
        `${evento.clientY - desplazamientoY}px`;
}

function terminarArrastre(evento) {

    if (!piezaArrastrada) {
        return;
    }

    evento.preventDefault();

    const pieza = piezaArrastrada;

    pieza.releasePointerCapture(evento.pointerId);

    pieza.removeEventListener(
        "pointermove",
        moverPieza
    );

    pieza.removeEventListener(
        "pointerup",
        terminarArrastre
    );

    pieza.removeEventListener(
        "pointercancel",
        terminarArrastre
    );

    const casillero =
        buscarCasilleroDebajo(
            evento.clientX,
            evento.clientY
        );

    if (
        casillero &&
        Number(casillero.dataset.posicion) ===
        Number(pieza.dataset.posicionCorrecta)
    ) {

        colocarPiezaCorrecta(
            pieza,
            casillero
        );

    } else {

        devolverPieza(
            pieza
        );
    }

    piezaArrastrada = null;
}

function buscarCasilleroDebajo(x, y) {

    piezaArrastrada.style.pointerEvents = "none";

    const elemento =
        document.elementFromPoint(x, y);

    piezaArrastrada.style.pointerEvents = "";

    if (!elemento) {
        return null;
    }

    return elemento.closest(
        ".casilleroRompecabezas"
    );
}

function colocarPiezaCorrecta(pieza, casillero) {

    pieza.classList.remove("arrastrando");
    pieza.classList.add("correcta");

    pieza.style.position = "absolute";
    pieza.style.left = "0";
    pieza.style.top = "0";
    pieza.style.width = "100%";
    pieza.style.height = "100%";
    pieza.style.zIndex = "2";

    casillero.appendChild(pieza);

    piezasCorrectas++;

    if (piezasCorrectas === cantidadPiezas) {
        mostrarFelicitacion();
    }
}

function devolverPieza(pieza) {

    pieza.classList.remove("arrastrando");

    pieza.style.position = "";
    pieza.style.left = "";
    pieza.style.top = "";
    pieza.style.width = "";
    pieza.style.height = "";
    pieza.style.zIndex = "";

    contenedorPiezas.appendChild(pieza);
}

function mostrarFelicitacion() {

    mensajeRompecabezas.classList.add("mostrar");

    setTimeout(() => {
        mensajeRompecabezas.classList.remove("mostrar");
    }, 2200);
}

function mezclarArray(array) {

    const copia = [...array];

    for (
        let indice = copia.length - 1;
        indice > 0;
        indice--
    ) {

        const posicionAleatoria =
            Math.floor(
                Math.random() * (indice + 1)
            );

        [
            copia[indice],
            copia[posicionAleatoria]
        ] = [
            copia[posicionAleatoria],
            copia[indice]
        ];
    }

    return copia;
}

botonMezclar.addEventListener(
    "click",
    crearRompecabezas
);

botonVolver.addEventListener("click", () => {

    window.location.href =
        "rompecabezas-galeria.html";
});