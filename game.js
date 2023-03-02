console.log(maps);
const canvas = document.querySelector("#game");
const gameContext = canvas.getContext("2d");

let canvasSize;
let elementsSize;

window.addEventListener("load", setCanvasSize);
window.addEventListener("resize", setCanvasSize);

function setCanvasSize() {
	// innerWidth calcula el ancho de la ventana del html y innerHeight calcula el ancho de la ventana del html
	if (window.innerWidth > window.innerHeight) {
		canvasSize = window.innerHeight * 0.8;
	} else {
		canvasSize = window.innerWidth * 0.8;
	}

	canvas.setAttribute("width", canvasSize);
	canvas.setAttribute("height", canvasSize);

	elementsSize = canvasSize / 10;

	startGame();
}

function startGame() {
	gameContext.font = elementsSize + "px sans-serif";
	gameContext.textAlign = "end";

	const map = maps[0]; // representa el mapa a jugar
	const mapRows = map.trim().split("\n"); // con trim()con split() crea un array a partir de un strig separado por los espacios vacíos(\n)
	const mapRowColumns = mapRows.map((row) => row.trim().split("")); // creamos un array de arrays(filas) con arrays de las columnas
	console.log({ map, mapRows, mapRowColumns });

	mapRowColumns.forEach((row, rowIndex) => {
		row.forEach((col, colIndex) => {
			const emoji = emojis[col];
			const xPos = elementsSize * (colIndex + 1) + elementsSize / 6;
			const yPos = elementsSize * (rowIndex + 1) - elementsSize / 6;
			gameContext.fillText(emoji, xPos, yPos);
			console.log(col, colIndex, row, rowIndex);
		});
	});

	// for (let row = 1; row <= 10; row++) {
	// 	for (let col = 1; col <= 10; col++) {
	// 		gameContext.fillText(
	// 			emojis[mapRowColumns[row - 1][col - 1]],
	// 			elementsSize * col,
	// 			elementsSize * row
	// 		);
	// 	}
	// }

	// gameContext.fillStyle = "blue"; // Define el color de lo que se va a dibujar de acá en más
	// gameContext.fillRect(0, 0, 100, 100); // Crea un rectángulo (eje x, eje y, ancho, altura)
	// gameContext.clearRect(0, 0, 50, 50); // Borra un rectángulo
	// //
	// gameContext.font = "30px serif";
	// gameContext.fillStyle = "gray"; // Define el color
	// gameContext.textAlign = "center";
	// gameContext.fillText("Hello!", 30, 30); // El texto debe ir después de las características
}
