const audioFondo = document.createElement("audio");
audioFondo.src = new URL("audio/bgmusic.mp3", document.currentScript.src);
audioFondo.loop = true;
audioFondo.preload = "auto";
audioFondo.volume = 0.10;
audioFondo.hidden = true;
audioFondo.setAttribute("aria-hidden", "true");
document.body.append(audioFondo);

function iniciarMusica() {
	audioFondo.play()
		.then(() => {
			document.removeEventListener("pointerdown", iniciarMusica);
			document.removeEventListener("keydown", iniciarMusica);
		})
		.catch((error) => {
			if (error.name !== "NotAllowedError") {
				console.error("No se pudo reproducir la música de fondo.", error);
			}
		});
}

document.addEventListener("pointerdown", iniciarMusica);
document.addEventListener("keydown", iniciarMusica);
iniciarMusica();
