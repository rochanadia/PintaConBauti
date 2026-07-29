const dibujos = [
    {
        nombre: "Bartolito",
        archivo: "huevo_bartolito.png"
    }
];

const galeria = document.getElementById("galeria");

dibujos.forEach((dibujo) => {

    const tarjeta = document.createElement("div");
    tarjeta.className = "tarjeta";

    tarjeta.innerHTML = `
        <img src="dibujos/${dibujo.archivo}" alt="${dibujo.nombre}">
        <p>${dibujo.nombre}</p>
    `;

    tarjeta.addEventListener("click", () => {
        window.location.href =
            `pintar.html?dibujo=${encodeURIComponent(dibujo.archivo)}`;
    });

    galeria.appendChild(tarjeta);
});