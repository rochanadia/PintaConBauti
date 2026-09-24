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