const rompecabezas = [
    {
        nombre: "Bartolito",
        archivo: "bartolito.png"
    },
    {
        nombre: "Pepe",
        archivo: "pepe.png"
    },
    {
        nombre: "La Granja",
        archivo: "granja1.png"
    },
    {
        nombre: "Huevos Sorpresa 1",
        archivo: "huevos1.png"
    },
    {
        nombre: "Huevos Sorpresa 2",
        archivo: "huevos2.png"
    },
    {
        nombre: "Huevos Sorpresa 3",
        archivo: "huevos3.png"
    }
];

const galeria = document.getElementById("galeriaRompecabezas");
const botonVolver = document.getElementById("volverInicio");

rompecabezas.forEach((rompecabezasActual) => {

    const tarjeta = document.createElement("div");
    tarjeta.className = "tarjeta";

    tarjeta.innerHTML = `
        <img
            src="rompecabezas/${rompecabezasActual.archivo}"
            alt="${rompecabezasActual.nombre}"
        >

        <p>${rompecabezasActual.nombre}</p>
    `;

    tarjeta.addEventListener("click", () => {

        window.location.href =
            `rompecabezas.html?imagen=${encodeURIComponent(
                rompecabezasActual.archivo
            )}`;
    });

    galeria.appendChild(tarjeta);
});

botonVolver.addEventListener("click", () => {
    window.location.href = "index.html";
});