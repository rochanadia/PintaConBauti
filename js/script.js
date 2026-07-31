const categorias = [
    {
        id: "huevos-sorpresa",
        nombre: "Huevos Sorpresa",
        carpeta: "huevos-sorpresa",

        dibujos: [
            {
                nombre: "Bartolito",
                archivo: "huevo_bartolito.png"
            },
            {
                nombre: "Lola",
                archivo: "huevo_lola.png"
            },
            {
                nombre: "Mamá",
                archivo: "huevo_mama.png"
            },
            {
                nombre: "Margarita",
                archivo: "huevo_margarita.png"
            },
            {
                nombre: "Pajarón",
                archivo: "huevo_pajaron.png"
            },
            {
                nombre: "Pancha",
                archivo: "huevo_pancha.png"
            },
            {
                nombre: "Papá",
                archivo: "huevo_papa.png"
            },
            {
                nombre: "Pepe",
                archivo: "huevo_pepe.png"
            },
            {
                nombre: "Percherón",
                archivo: "huevo_percheron.png"
            }
        ]
    }
];

const galeria = document.getElementById("galeria");

const categoria = categorias[0];

categoria.dibujos.forEach((dibujo) => {

    const tarjeta = document.createElement("div");
    tarjeta.className = "tarjeta";

    tarjeta.innerHTML = `
        <img
            src="dibujos/${categoria.carpeta}/${dibujo.archivo}"
            alt="${dibujo.nombre}"
        >
        <p>${dibujo.nombre}</p>
    `;

    tarjeta.addEventListener("click", () => {
        const rutaDibujo =
            `${categoria.carpeta}/${dibujo.archivo}`;

        window.location.href =
            `pintar.html?dibujo=${encodeURIComponent(rutaDibujo)}`;
    });

    galeria.appendChild(tarjeta);
});