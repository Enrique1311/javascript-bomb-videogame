const canvas = document.querySelector("#game");
const gameContext = canvas.getContext("2d");
const buttonUp = document.querySelector("#up");
const buttonDown = document.querySelector("#down");
const buttonRight = document.querySelector("#right");
const buttonLeft = document.querySelector("#left");
const livesSpan = document.querySelector("#lives");
const timeSpan = document.querySelector("#time");
const levelSpan = document.querySelector("#level");
const spanRecord = document.querySelector("#record");
const explossion = document.querySelector("#explossion");
const modal = document.querySelector("#modal");
const pFinalResult = document.querySelector("#finalResult");
const pTimeResult = document.querySelector("#timeResult");
const yesButton = document.querySelector("#yesButton");
const noButton = document.querySelector("#noButton");
const divModalButtons = document.querySelector("#modalButtons");
const thanksEndMessage = document.querySelector("#thanksEndMessage");

let canvasSize;
let elementsSize;
let level = 0;
let lives = 3;
let timeStart;
let timePlayer;
let timeInterval;
let myWindow;

const playerPosition = {
	x: undefined,
	y: undefined,
};

const giftPosition = {
	x: undefined,
	y: undefined,
};

let bombsPosition = [];

window.addEventListener("load", setCanvasSize);
window.addEventListener("resize", setCanvasSize);

// Hace que el canvas sea responsivo
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

	playerPosition.x = undefined;
	playerPosition.y;

	startGame();
}

// Comienza el juego desplegando el canvas
function startGame() {
	gameContext.font = elementsSize + "px sans-serif";
	gameContext.textAlign = "end";

	const map = maps[level]; // representa el mapa a jugar

	if (!map) {
		gameWinner();
		return;
	}

	if (!timeStart) {
		timeStart = Date.now();
		timeInterval = setInterval(showTimer, 1000);
		showRecord();
	}

	const mapRows = map.trim().split("\n"); // con trim()con split() crea un array a partir de un strig separado por los espacios vacíos(\n)
	const mapRowColumns = mapRows.map((row) => row.trim().split("")); // creamos un array de arrays(filas) con arrays de las columnas
	console.log({ map, mapRows, mapRowColumns });

	showLives();

	showLevel();

	aliensPosition = [];

	gameContext.clearRect(0, 0, canvasSize, canvasSize);

	mapRowColumns.forEach((row, rowIndex) => {
		row.forEach((col, colIndex) => {
			const emoji = emojis[col];
			const xPos = elementsSize * (colIndex + 1) + elementsSize / 5;
			const yPos = elementsSize * (rowIndex + 1) - elementsSize / 7;

			if (col == "O") {
				if (!playerPosition.x && !playerPosition.y) {
					playerPosition.x = xPos;
					playerPosition.y = yPos;
					console.log({ playerPosition });
				}
			} else if (col == "I") {
				giftPosition.x = xPos;
				giftPosition.y = yPos;
			} else if (col == "X") {
				aliensPosition.push({ x: xPos, y: yPos });
			}

			gameContext.fillText(emoji, xPos, yPos);
		});
	});

	movePlayer();
}

// Movimientos del jugador
function movePlayer() {
	const xGiftCrash = playerPosition.x.toFixed(2) == giftPosition.x.toFixed(2);
	const yGiftCrash = playerPosition.y.toFixed(2) == giftPosition.y.toFixed(2);
	const giftCrash = xGiftCrash && yGiftCrash;

	console.log(playerPosition.x, giftPosition.x);
	console.log(playerPosition.y, giftPosition.y);

	if (giftCrash) {
		levelWinner();
	}

	const alienCrash = aliensPosition.find((alien) => {
		const xAlienCrash = alien.x.toFixed(2) == playerPosition.x.toFixed(2);
		const yAlienCrash = alien.y.toFixed(2) == playerPosition.y.toFixed(2);
		return xAlienCrash && yAlienCrash;
	});

	if (alienCrash) {
		setInterval(showExplossion(), 1000);
		levelFailed();
	}

	gameContext.fillText(emojis["PLAYER"], playerPosition.x, playerPosition.y);
}

// Cuando hay colisión con un alien
function showExplossion() {
	explossion.classList.toggle("inactive");
}

// Cada vez que se pasa un nivel, pasa al siguiente
function levelWinner() {
	console.log("Subiste de nivel");
	level++;
	startGame();
}

// Muestra mensaje con resultados
function showModal() {
	modal.classList.toggle("inactive");
}

// Cada vez que falla un nivel
function levelFailed() {
	lives--;
	console.log(lives);

	if (lives <= 0) {
		lossGame();
	}
	playerPosition.x = undefined;
	playerPosition.y = undefined;
	startGame();
}

// Cuando se pierden todas las vidas
function lossGame() {
	showModal();
	pFinalResult.innerHTML = "¡Upss!. Perdíste todas tus vidas...";
	level = 0;
	lives = 3;
	timeStart = undefined;
}

// Muestra las vidas
function showLives() {
	const heartsArray = Array(lives).fill(emojis["HEART"]);
	console.log(heartsArray);
	livesSpan.innerHTML = "";
	heartsArray.forEach((heart) => livesSpan.append(heart));
}

// Muestra el timer
function showTimer() {
	timeSpan.innerHTML = Date.now() - timeStart;
}

// Muestra el nivel
function showLevel() {
	levelSpan.innerHTML = level;
}
1;

// Muestra el record
function showRecord() {
	spanRecord.innerHTML = localStorage.getItem("record_time");
}

// Recomenzar el juego
function restartGame() {
	level = 0;
	lives = 3;
	timeStart = undefined;
	playerPosition.x = undefined;
	playerPosition.y = undefined;
	showModal();
	startGame();
}

// Terminar el juego
function stopGame() {
	showModal();
	thanksEndMessage.classList.toggle("inactive");
}

// Cuando completas todos los niveles
yesButton.addEventListener("click", restartGame);
noButton.addEventListener("click", stopGame);

function gameWinner() {
	clearInterval(timeInterval);

	const recordTime = localStorage.getItem("record_time");
	const playerTime = Date.now() - timeStart;

	showModal();

	pTimeResult.innerHTML = `Tu tiempo fue ${playerTime}`;
	if (recordTime) {
		if (playerTime <= recordTime) {
			localStorage.setItem("record_time", playerTime);
			pFinalResult.innerHTML = "¡Felicidades! ¡Superáste el record!";
		} else {
			pFinalResult.innerHTML =
				"No superáste el record... ¡Buena suerte para la próxima!";
		}
	} else {
		localStorage.setItem("record_time", playerTime);
		pFinalResult.innerHTML =
			"Como es la primera vez que juegas, tienes el record...👍";
	}

	console.log({ recordTime, playerTime });
}

// Le da los eventos a los botones
window.addEventListener("keydown", moveByKeys);

buttonUp.addEventListener("click", moveUp);
buttonDown.addEventListener("click", moveDown);
buttonRight.addEventListener("click", moveRight);
buttonLeft.addEventListener("click", moveLeft);

function moveByKeys(event) {
	if (event.key === "ArrowUp") moveUp();
	else if (event.key === "ArrowDown") moveDown();
	else if (event.key === "ArrowRight") moveRight();
	else if (event.key === "ArrowLeft") moveLeft();
}

function moveUp() {
	if (playerPosition.y - elementsSize > elementsSize / 2) {
		// verifica que el jugador no se salga de la pantalla
		playerPosition.y -= elementsSize;
		startGame();
	}
}

function moveRight() {
	if (playerPosition.x + elementsSize < canvasSize + elementsSize / 2) {
		playerPosition.x += elementsSize;
		startGame();
	}
}

function moveDown() {
	if (playerPosition.y + elementsSize < canvasSize) {
		playerPosition.y += elementsSize;
		startGame();
	}
}

function moveLeft() {
	if (playerPosition.x - elementsSize > elementsSize) {
		playerPosition.x -= elementsSize;
		startGame();
	}
}
