const dibujos = [

    {
        nombre: "Bartolito",
        archivo: "huevo_bartolito.png"
    }

];

const galeria = document.getElementById("galeria");

dibujos.forEach(dibujo => {

    galeria.innerHTML += `

        <div class="tarjeta">

            <img src="dibujos/${dibujo.archivo}" alt="${dibujo.nombre}">

            <p>${dibujo.nombre}</p>

        </div>

    `;

});
