const seccionesFolleto = {
	cartel: {
		src: "imagenes/cartel-el-jardin.jpeg",
		alt: "Cartel de la exposición colectiva Paradiso, sábado 14 de noviembre de 2026",
		pie: "Cartel de la exposición",
	},
	informacion: {
		src: "imagenes/informacion-exposicion.jpeg",
		alt: "Información sobre la exposición colectiva y sus actividades",
		pie: "Información sobre la exposición",
	},
	contacto: {
		src: "imagenes/contacto-exposicion.jpeg",
		alt: "Contacto de la exposición: @Magicalgoblin.photography y @Sandrasanchezz_",
		pie: "Contacto de la exposición",
	},
};

const imagenFolleto = document.querySelector("#imagen-folleto");
const pieImagen = document.querySelector("#pie-imagen");
const botonesSeccion = document.querySelectorAll(".boton-seccion");
const botonAmpliar = document.querySelector(".boton-ampliar-folleto");
const dialogoVistaPrevia = document.querySelector(".dialogo-vista-previa");
const imagenVistaPrevia = document.querySelector(".imagen-vista-previa");
const botonCerrarVistaPrevia = document.querySelector(".boton-cerrar-vista-previa");

botonAmpliar.addEventListener("click", () => {
	imagenVistaPrevia.src = imagenFolleto.src;
	imagenVistaPrevia.alt = imagenFolleto.alt;
	dialogoVistaPrevia.showModal();
	botonCerrarVistaPrevia.focus();
});

botonCerrarVistaPrevia.addEventListener("click", () => {
	dialogoVistaPrevia.close();
});

dialogoVistaPrevia.addEventListener("click", (event) => {
	if (event.target === dialogoVistaPrevia) dialogoVistaPrevia.close();
});

botonesSeccion.forEach((boton) => {
	boton.addEventListener("click", () => {
		const seccionSeleccionada = seccionesFolleto[boton.dataset.seccionFolleto];

		if (!seccionSeleccionada) return;

		botonesSeccion.forEach((elemento) => {
			const estaSeleccionado = elemento === boton;
			elemento.classList.toggle("activo", estaSeleccionado);
			elemento.setAttribute("aria-pressed", String(estaSeleccionado));
		});

		imagenFolleto.classList.add("cambiando");
		imagenFolleto.src = seccionSeleccionada.src;
		imagenFolleto.alt = seccionSeleccionada.alt;
		pieImagen.textContent = seccionSeleccionada.pie;
	});
});

imagenFolleto.addEventListener("load", () => {
	imagenFolleto.classList.remove("cambiando");
});

imagenFolleto.addEventListener("error", () => {
	imagenFolleto.classList.remove("cambiando");
});
