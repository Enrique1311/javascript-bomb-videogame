const canvas = document.querySelector("#game");
const gameContext = canvas.getContext("2d");
const buttonUp = document.querySelector("#up");
const buttonDown = document.querySelector("#down");
const buttonRight = document.querySelector("#right");
const buttonLeft = document.querySelector("#left");
const livesSpan = document.querySelector("#lives");
const timeSpan = document.querySelector("#time");
const spanRecord = document.querySelector("#record");
const pResult = document.querySelector("#result");

let canvasSize;
let elementsSize;
let level = 0;
let lives = 3;
let timeStart;
let timePlayer;
let timeInterval;

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

	bombsPosition = [];

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
				bombsPosition.push({ x: xPos, y: yPos });
			}

			gameContext.fillText(emoji, xPos, yPos);
		});
	});

	movePlayer();
}
function movePlayer() {
	const xGiftCrash = playerPosition.x.toFixed(2) == giftPosition.x.toFixed(2);
	const yGiftCrash = playerPosition.y.toFixed(2) == giftPosition.y.toFixed(2);
	const giftCrash = xGiftCrash && yGiftCrash;

	console.log(playerPosition.x, giftPosition.x);
	console.log(playerPosition.y, giftPosition.y);

	if (giftCrash) {
		levelWinner();
	}

	const bombCrash = bombsPosition.find((bomb) => {
		const xBombCrash = bomb.x.toFixed(2) == playerPosition.x.toFixed(2);
		const yBombCrash = bomb.y.toFixed(2) == playerPosition.y.toFixed(2);
		return xBombCrash && yBombCrash;
	});

	if (bombCrash) {
		levelFailed();
	}

	gameContext.fillText(emojis["PLAYER"], playerPosition.x, playerPosition.y);
}

function levelWinner() {
	console.log("Subiste de nivel");
	level++;
	startGame();
}

function levelFailed() {
	lives--;
	console.log(lives);

	if (lives <= 0) {
		level = 0;
		lives = 3;
		timeStart = undefined;
	}
	playerPosition.x = undefined;
	playerPosition.y = undefined;
	startGame();
}

function showLives() {
	const heartsArray = Array(lives).fill(emojis["HEART"]);
	console.log(heartsArray);
	livesSpan.innerHTML = "";
	heartsArray.forEach((heart) => livesSpan.append(heart));
}

function showTimer() {
	timeSpan.innerHTML = Date.now() - timeStart;
}

function showRecord() {
	spanRecord.innerHTML = localStorage.getItem("record_time");
}

function gameWinner() {
	console.log("GANASTEEEEE!!!!!!");
	clearInterval(timeInterval);

	const recordTime = localStorage.getItem("record_time");
	const playerTime = Date.now() - timeStart;

	if (recordTime) {
		if (playerTime <= recordTime) {
			localStorage.setItem("record_time", playerTime);
			pResult.innerHTML = "¡Felicidades! ¡Superáste el record!";
		} else {
			pResult.innerHTML = "Lo siento😔... No superáste el record...";
		}
	} else {
		localStorage.setItem("record_time", playerTime);
		pResult.innerHTML =
			"Como es la primera vez que juegas, tienes el record...👍";
	}
	console.log({ recordTime, playerTime });
}

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
