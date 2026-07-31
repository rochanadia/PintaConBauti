const categoriasDisponibles =
document.querySelectorAll(".tarjetaCategoria.disponible");

categoriasDisponibles.forEach((tarjeta) => {

    tarjeta.addEventListener("click", () => {

        const categoria = tarjeta.dataset.categoria;

        window.location.href =
            `galeria.html?categoria=${encodeURIComponent(categoria)}`;

    });

});