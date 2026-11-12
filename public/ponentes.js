const listaPonentes = document.querySelector("#lista-ponentes");
const dialogoObra = document.querySelector(".dialogo-obra");
const imagenAmpliada = dialogoObra.querySelector(".imagen-vista-previa");
const tituloAmpliado = dialogoObra.querySelector("#titulo-obra-ampliada");
const descripcionAmpliada = dialogoObra.querySelector("#descripcion-obra-ampliada");
const botonCerrar = dialogoObra.querySelector(".boton-cerrar-vista-previa");
let posicionDesplazamiento = 0;

function crearTarjetaObra(obra) {
	const tarjeta = document.createElement("article");
	tarjeta.className = "tarjeta-obra";

	const botonAmpliar = document.createElement("button");
	botonAmpliar.className = "boton-ampliar-obra";
	botonAmpliar.type = "button";
	botonAmpliar.setAttribute("aria-label", `Ampliar ${obra.titulo}`);

	const imagen = document.createElement("img");
	imagen.className = "imagen-obra";
	imagen.src = obra.imagen;
	imagen.alt = obra.titulo;
	imagen.loading = "lazy";
	botonAmpliar.append(imagen);

	const texto = document.createElement("div");
	texto.className = "texto-obra";

	const titulo = document.createElement("h3");
	titulo.textContent = obra.titulo;

	texto.append(titulo);
	tarjeta.append(botonAmpliar, texto);

	botonAmpliar.addEventListener("click", () => {
		imagenAmpliada.src = obra.imagen;
		imagenAmpliada.alt = obra.titulo;
		tituloAmpliado.textContent = obra.titulo;
		descripcionAmpliada.textContent = obra.descripcion;
		posicionDesplazamiento = window.scrollY;
		dialogoObra.showModal();
		botonCerrar.focus({ preventScroll: true });
		window.scrollTo(0, posicionDesplazamiento);
	});

	return tarjeta;
}

function crearPonente(ponente) {
	const seccion = document.createElement("section");
	seccion.className = "ponente";
	seccion.setAttribute("aria-labelledby", `nombre-${ponente.id}`);

	const datos = document.createElement("div");
	datos.className = "datos-ponente";

	if (ponente.retrato) {
		const retrato = document.createElement("img");
		retrato.className = "retrato-ponente";
		retrato.src = ponente.retrato;
		retrato.alt = `Retrato de ${ponente.nombre}`;
		datos.append(retrato);
	} else {
		const retrato = document.createElement("div");
		retrato.className = "retrato-ponente retrato-placeholder";
		retrato.setAttribute("aria-hidden", "true");
		retrato.textContent = "?";
		datos.append(retrato);
	}

	const identidad = document.createElement("div");
	identidad.className = "identidad-ponente";

	const nombre = document.createElement("h2");
	nombre.id = `nombre-${ponente.id}`;
	nombre.textContent = ponente.nombre;

	const subtitulo = document.createElement("p");
	subtitulo.className = "subtitulo-ponente";
	subtitulo.textContent = ponente.subtitulo;

	identidad.append(nombre, subtitulo);
	datos.append(identidad);

	const desplegable = document.createElement("details");
	desplegable.className = "desplegable-obras";

	const boton = document.createElement("summary");
	boton.className = "boton-ver-obras";
	boton.textContent = "Ver obras";

	const obras = document.createElement("div");
	obras.className = "obras-ponente";
	obras.setAttribute("aria-label", `Obras de ${ponente.nombre}`);

	if (ponente.obras.length > 0) {
		obras.replaceChildren(...ponente.obras.map(crearTarjetaObra));
	} else {
		const mensaje = document.createElement("p");
		mensaje.className = "sin-obras";
		mensaje.textContent = "Pon aquí las obras de este ponente en obras.json.";
		obras.append(mensaje);
	}

	desplegable.append(boton, obras);
	seccion.append(datos, desplegable);
	return seccion;
}

function ponenteValido(ponente) {
	return ponente
		&& typeof ponente.id === "string"
		&& typeof ponente.nombre === "string"
		&& typeof ponente.subtitulo === "string"
		&& typeof ponente.retrato === "string"
		&& Array.isArray(ponente.obras)
		&& ponente.obras.every((obra) => (
			obra
			&& typeof obra.titulo === "string"
			&& typeof obra.imagen === "string"
			&& typeof obra.descripcion === "string"
		));
}

async function cargarPonentes() {
	try {
		const respuesta = await fetch("obras.json");
		if (!respuesta.ok) {
			throw new Error(`No se pudo cargar obras.json (${respuesta.status}).`);
		}

		const datos = await respuesta.json();
		if (!Array.isArray(datos.ponentes) || !datos.ponentes.every(ponenteValido)) {
			throw new Error("El formato de obras.json no contiene ponentes válidos.");
		}

		listaPonentes.replaceChildren(...datos.ponentes.map(crearPonente));
	} catch (error) {
		const mensaje = document.createElement("p");
		mensaje.setAttribute("role", "alert");
		mensaje.textContent = `No se pudieron cargar las obras. ${error.message}`;
		listaPonentes.replaceChildren(mensaje);
	}
}

botonCerrar.addEventListener("click", () => dialogoObra.close());

dialogoObra.addEventListener("close", () => {
	window.scrollTo(0, posicionDesplazamiento);
});

dialogoObra.addEventListener("click", (evento) => {
	if (evento.target === dialogoObra) dialogoObra.close();
});

cargarPonentes();
