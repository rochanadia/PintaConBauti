const parametros = new URLSearchParams(window.location.search);

const archivo = parametros.get("dibujo");

const imagen = document.getElementById("dibujo");

if (archivo) {
    imagen.src = `dibujos/${archivo}`;
} else {
    imagen.alt = "No se encontró el dibujo";
}