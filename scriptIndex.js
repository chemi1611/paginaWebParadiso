const flyerOptions = {
	cover: {
		src: "Imagenes/bf62e737-97cb-4d42-a641-f6b5519dcd39.jpeg",
		alt: "Folleto de la exposición colectiva Paradiso, sábado 14 de noviembre de 2026",
	},
	info: {
		src: "Imagenes/cd0c105c-6ac5-4184-80db-aa5794908690.jpeg",
		alt: "Información sobre la exposición colectiva y sus actividades",
	},
	contact: {
		src: "Imagenes/c82d0d90-c330-4710-b01f-a0343eaa77af.jpeg",
		alt: "Contacto de la exposición: @Magicalgoblin.photography y @Sandrasanchezz_",
	}
};

const flyerImage = document.querySelector("#flyer-image");
const imageCaption = document.querySelector("#image-caption");
const selectorButtons = document.querySelectorAll(".selector-button");

selectorButtons.forEach((button) => {
	button.addEventListener("click", () => {
		const selectedFlyer = flyerOptions[button.dataset.flyer];

		if (!selectedFlyer) return;

		selectorButtons.forEach((item) => {
			const isSelected = item === button;
			item.classList.toggle("is-active", isSelected);
			item.setAttribute("aria-pressed", String(isSelected));
		});

		flyerImage.classList.add("is-changing");
		flyerImage.src = selectedFlyer.src;
		flyerImage.alt = selectedFlyer.alt;
		imageCaption.textContent = selectedFlyer.label;
	});
});

flyerImage.addEventListener("load", () => {
	flyerImage.classList.remove("is-changing");
});

flyerImage.addEventListener("error", () => {
	flyerImage.classList.remove("is-changing");
});
