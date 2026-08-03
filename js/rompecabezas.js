const parametros = new URLSearchParams(window.location.search);
const archivo = parametros.get("imagen");

const imagen = document.getElementById("imagenRompecabezas");
const botonVolver = document.getElementById(
    "volverGaleriaRompecabezas"
);

if (!archivo) {

    alert("No se encontró la imagen.");

    window.location.href =
        "rompecabezas-galeria.html";

} else {

    imagen.src = `rompecabezas/${archivo}`;
}

botonVolver.addEventListener("click", () => {
    window.location.href =
        "rompecabezas-galeria.html";
});