const listaObras = document.querySelector("#obras-catalogo");
const busquedaObra = document.querySelector("#busqueda-obra");
const filtroPonente = document.querySelector("#filtro-ponente");
const resultadoCatalogo = document.querySelector("#resultado-catalogo");
const dialogoObra = document.querySelector(".dialogo-obra");
const imagenAmpliada = dialogoObra.querySelector(".imagen-vista-previa");
const tituloAmpliado = dialogoObra.querySelector("#titulo-obra-ampliada");
const descripcionAmpliada = dialogoObra.querySelector("#descripcion-obra-ampliada");
const botonCerrar = dialogoObra.querySelector(".boton-cerrar-vista-previa");
let todasLasObras = [];
let posicionDesplazamiento = 0;

function normalizarTexto(texto) {
	return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("es");
}

function crearTarjetaObra({ obra, nombrePonente }) {
	const tarjeta = document.createElement("article");
	tarjeta.className = "tarjeta-obra";

	const botonAmpliar = document.createElement("button");
	botonAmpliar.className = "boton-ampliar-obra";
	botonAmpliar.type = "button";
	botonAmpliar.setAttribute("aria-label", `Ampliar ${obra.titulo}, obra de ${nombrePonente}`);

	const imagen = document.createElement("img");
	imagen.className = "imagen-obra";
	imagen.src = obra.imagen;
	imagen.alt = obra.titulo;
	imagen.loading = "lazy";
	botonAmpliar.append(imagen);

	const texto = document.createElement("div");
	texto.className = "texto-obra";

	const titulo = document.createElement("h2");
	titulo.textContent = obra.titulo;

	const artista = document.createElement("p");
	artista.className = "artista-obra-catalogo";
	artista.textContent = nombrePonente;

	texto.append(titulo, artista);
	tarjeta.append(botonAmpliar, texto);

	botonAmpliar.addEventListener("click", () => {
		imagenAmpliada.src = obra.imagen;
		imagenAmpliada.alt = obra.titulo;
		tituloAmpliado.textContent = obra.titulo;
		descripcionAmpliada.textContent = `${nombrePonente} — ${obra.descripcion}`;
		posicionDesplazamiento = window.scrollY;
		dialogoObra.showModal();
		botonCerrar.focus({ preventScroll: true });
		window.scrollTo(0, posicionDesplazamiento);
	});

	return tarjeta;
}

function filtrarObras() {
	const textoBuscado = normalizarTexto(busquedaObra.value.trim());
	const idPonente = filtroPonente.value;
	const obrasFiltradas = todasLasObras.filter(({ ponente, obra }) => (
		(!idPonente || ponente.id === idPonente)
		&& normalizarTexto(obra.titulo).includes(textoBuscado)
	));

	if (obrasFiltradas.length === 0) {
		const mensaje = document.createElement("p");
		mensaje.className = "sin-resultados-catalogo";
		mensaje.textContent = "No se encontraron obras con esos filtros.";
		listaObras.replaceChildren(mensaje);
	} else {
		listaObras.replaceChildren(...obrasFiltradas.map(({ ponente, obra }) => (
			crearTarjetaObra({ obra, nombrePonente: ponente.nombre })
		)));
	}

	resultadoCatalogo.textContent = `${obrasFiltradas.length} ${obrasFiltradas.length === 1 ? "obra" : "obras"}`;
}

function datosValidos(ponentes) {
	return Array.isArray(ponentes) && ponentes.every((ponente) => (
		ponente
		&& typeof ponente.id === "string"
		&& typeof ponente.nombre === "string"
		&& Array.isArray(ponente.obras)
		&& ponente.obras.every((obra) => (
			obra
			&& typeof obra.titulo === "string"
			&& typeof obra.imagen === "string"
			&& typeof obra.descripcion === "string"
		))
	));
}

async function cargarCatalogo() {
	try {
		const respuesta = await fetch("obras.json");
		if (!respuesta.ok) {
			throw new Error(`No se pudo cargar obras.json (${respuesta.status}).`);
		}

		const datos = await respuesta.json();
		if (!datosValidos(datos.ponentes)) {
			throw new Error("El formato de obras.json no contiene ponentes válidos.");
		}

		const ponentesConObras = datos.ponentes.filter((ponente) => ponente.obras.length > 0);
		filtroPonente.replaceChildren(
			new Option("Todos los ponentes", ""),
			...ponentesConObras.map((ponente) => new Option(ponente.nombre, ponente.id))
		);
		todasLasObras = ponentesConObras.flatMap((ponente) => (
			ponente.obras.map((obra) => ({ ponente, obra }))
		));
		filtrarObras();
	} catch (error) {
		const mensaje = document.createElement("p");
		mensaje.setAttribute("role", "alert");
		mensaje.textContent = `No se pudo cargar el catálogo. ${error.message}`;
		listaObras.replaceChildren(mensaje);
		resultadoCatalogo.textContent = "";
	}
}

busquedaObra.addEventListener("input", filtrarObras);
filtroPonente.addEventListener("change", filtrarObras);
botonCerrar.addEventListener("click", () => dialogoObra.close());

dialogoObra.addEventListener("close", () => {
	window.scrollTo(0, posicionDesplazamiento);
});

dialogoObra.addEventListener("click", (evento) => {
	if (evento.target === dialogoObra) dialogoObra.close();
});

cargarCatalogo();
