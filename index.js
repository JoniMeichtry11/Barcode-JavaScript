document.addEventListener("DOMContentLoaded", () => {
	const $resultados = document.querySelector("#resultado");
	Quagga.init({
		inputStream: {
			constraints: {
				width: 1280,
				height: 720,
			},
			name: "Live",
			type: "LiveStream",
			target: document.querySelector('#contenedor'), // Donde se va a colocar el video de la "Cam"
		},
		decoder: {
			readers: [
				"code_128_reader",
				"ean_reader",
				"ean_8_reader",
				"code_39_reader",
				"code_39_vin_reader",
				"codabar_reader",
				"upc_reader",
				"upc_e_reader",
				"i2of5_reader"
			],
			halfSample: true,
  			patchSize: "x-large", // x-small, small, medium, large, x-large		
			debug: {
				showCanvas: false,
				showPatches: false,
				showFoundPatches: false,
				showSkeleton: false,
				showLabels: false,
				showPatchLabels: false,
				showRemainingPatchLabels: false,
				boxFromPatches: {
					showTransformed: false,
					showTransformedBox: false,
					showBB: false
				}
			},
			multiple: false
		}
	}, function (err) {
		if (err) {
			console.log(err);
			return
		}
		console.log("Iniciado correctamente");
		Quagga.start();
	});

	Quagga.onDetected((data) => {
		// Se ejecuta cuando detecta el código de barras :D
		$resultados.textContent = data.codeResult.code;
		console.log(data);
	});

	Quagga.onProcessed(function (result) {
        // Agregar un poco de estilo cuando detecte el código de barras.
		var drawingCtx = Quagga.canvas.ctx.overlay,
			drawingCanvas = Quagga.canvas.dom.overlay;

		if (result) {
			if (result.boxes) {
				drawingCtx.clearRect(0, 0, parseInt(drawingCanvas.getAttribute("width")), parseInt(drawingCanvas.getAttribute("height")));
				result.boxes.filter(function (box) {
					return box !== result.box;
				}).forEach(function (box) {
					Quagga.ImageDebug.drawPath(box, { x: 0, y: 1 }, drawingCtx, { color: "green", lineWidth: 2 });
				});
			}

			if (result.box) {
				Quagga.ImageDebug.drawPath(result.box, { x: 0, y: 1 }, drawingCtx, { color: "#00F", lineWidth: 2 });
			}

			if (result.codeResult && result.codeResult.code) {
				Quagga.ImageDebug.drawPath(result.line, { x: 'x', y: 'y' }, drawingCtx, { color: 'red', lineWidth: 3 });
			}
		}
	});
});