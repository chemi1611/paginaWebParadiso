const imagenItinerario = document.querySelector(".boton-ampliar-folleto img");
const botonAmpliarItinerario = document.querySelector(".boton-ampliar-folleto");
const dialogoItinerario = document.querySelector(".dialogo-vista-previa");
const imagenVistaPrevia = dialogoItinerario.querySelector(".imagen-vista-previa");
const botonCerrarVistaPrevia = dialogoItinerario.querySelector(".boton-cerrar-vista-previa");

botonAmpliarItinerario.addEventListener("click", () => {
	imagenVistaPrevia.src = imagenItinerario.src;
	imagenVistaPrevia.alt = imagenItinerario.alt;
	dialogoItinerario.showModal();
	botonCerrarVistaPrevia.focus();
});

botonCerrarVistaPrevia.addEventListener("click", () => dialogoItinerario.close());

dialogoItinerario.addEventListener("click", (event) => {
	if (event.target === dialogoItinerario) dialogoItinerario.close();
});