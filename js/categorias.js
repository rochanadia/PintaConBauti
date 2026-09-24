const categorias =
    document.querySelectorAll(
        ".tarjetaCategoria.disponible"
    );

const botonVolver =
    document.getElementById("volverInicio");

categorias.forEach((tarjeta) => {

    tarjeta.addEventListener("click", () => {

        const categoria =
            tarjeta.dataset.categoria;

        window.location.href =
            `galeria.html?categoria=${encodeURIComponent(categoria)}`;
    });
});

botonVolver.addEventListener("click", () => {
    window.location.href = "index.html";
});