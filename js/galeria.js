const categorias = [
    {
        id: "huevos-sorpresa",
        nombre: "Huevos Sorpresa",
        icono: "imagenes/iconos/huevos-sorpresa.png",
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
                nombre: "Bataraza",
                archivo: "huevo_bataraza.png"
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
    },

    {
        id: "la-granja",
        nombre: "La Granja",
        icono: "imagenes/iconos/la-granja.png",
        carpeta: "la-granja",

        dibujos: [
        {
            nombre: "Bartolito",
            archivo: "bartolito.png"
        },
        {
            nombre: "Pepe",
            archivo: "pepe.png"
        },
        {
            nombre: "Percherón",
            archivo: "percheron.png"
        },
        {
            nombre: "La Granja 1",
            archivo: "granja1.png"
        },
        {
            nombre: "La Granja 2",
            archivo: "granja2.png"
        }
    ]
}
];

const parametros =
new URLSearchParams(window.location.search);

const categoriaId =
parametros.get("categoria");

const categoria =
categorias.find((item) => item.id === categoriaId);

const tituloCategoria =
document.getElementById("tituloCategoria");

const galeria =
document.getElementById("galeria");

const botonVolver =
document.getElementById("volverCategorias");

if (!categoria) {

    tituloCategoria.textContent =
        "Categoría no encontrada";

} else {

    tituloCategoria.innerHTML = `
        <img
            src="${categoria.icono}"
            alt=""
            class="iconoTituloGaleria"
        >
        <span>${categoria.nombre}</span>
    `;

    categoria.dibujos.forEach((dibujo) => {

        const tarjeta =
        document.createElement("div");

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

}

botonVolver.addEventListener("click", () => {
    window.location.href = "categorias.html";
});