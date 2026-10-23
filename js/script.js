const botonColorear =
    document.getElementById("abrirColorear");

const botonRompecabezas =
    document.getElementById("abrirRompecabezas");

botonColorear.addEventListener("click", () => {
    window.location.href = "categorias.html";
});

botonRompecabezas.addEventListener("click", () => {
    window.location.href = "rompecabezas-galeria.html";
});

const abrirMemoria = document.getElementById("abrirMemoria");

if (abrirMemoria) {
    abrirMemoria.addEventListener("click", () => {
        window.location.href = "memoria.html";
    });
}
