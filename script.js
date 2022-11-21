function minimax(table, joueur) {
	var availSpots = emptySquares();

	if (checkWin(table, huPlayer)) {
		return {score: -10};
	} else if (checkWin(table, aiPlayer)) {
		return {score: 10};
	} else if (availSpots.length === 0) {
		return {score: 0};
	}
	var moves = [];
	for (var i = 0; i < availSpots.length; i++) {
		var move = {};
		move.index = table[availSpots[i]];
		table[availSpots[i]] = joueur;

		if (joueur == aiPlayer) {
			var result = minimax(table, huPlayer);
			move.score = result.score;
		} else {
			var result = minimax(table, aiPlayer);
			move.score = result.score;
		}

		table[availSpots[i]] = move.index;

		moves.push(move);
	}

	var bestMove;
	if(joueur === aiPlayer) {
		var bestScore = -10000;
		for(var i = 0; i < moves.length; i++) {
			if (moves[i].score > bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	} else {
		var bestScore = 10000;
		for(var i = 0; i < moves.length; i++) {
			if (moves[i].score < bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	}

	return moves[bestMove];
}

var tableOrg;
const huPlayer = 'X';
const aiPlayer = '0';

const Combinaisons = [
	[0, 1, 2],
	[3, 4, 5],
	[6, 7, 8],
	[0, 3, 6],
	[1, 4, 7],
	[2, 5, 8],
	[0, 4, 8],
	[6, 4, 2]
]

function start() {
	document.querySelector(".endgame").style.display = "none";
	tableOrg = Array.from(Array(9).keys());
	for (var i = 0; i < cells.length; i++) {
		cells[i].innerText = '';
		cells[i].style.removeProperty('background-color');
		cells[i].addEventListener('click', turnClick, false);
	}

}

const cells = document.querySelectorAll('.cell');
start();


function turnClick(square) {
	if (typeof tableOrg[square.target.id] == 'number') {
		turn(square.target.id, huPlayer)
		if (!checkWin(tableOrg, huPlayer) && !checkTie()) turn(bestSpot(), aiPlayer);
	}
} 

function turn(squareId, player) {
	tableOrg[squareId] = player;
	document.getElementById(squareId).innerText = player;
	let gameWon = checkWin(tableOrg, player)
	if (gameWon) gameOver(gameWon)
}

function checkWin(table, player) {
	let plays = table.reduce((a, e, i) =>
		(e === player) ? a.concat(i) : a, []);
	let gameWon = null;
	for (let [index, win] of Combinaisons.entries()) {
		if (win.every(elem => plays.indexOf(elem) > -1)) {
			gameWon = {index: index, player: player};
			break;
		}
	}
	return gameWon;
}

function gameOver(gameWon) {
	for (let index of Combinaisons[gameWon.index]) {
		document.getElementById(index).style.backgroundColor =
			gameWon.player == huPlayer ? "blue" : "red";
	}
	for (var i = 0; i < cells.length; i++) {
		cells[i].removeEventListener('click', turnClick, false);
	}
	declareWinner(gameWon.player == huPlayer ? "Tu as gagné!" : "Tu as perdu.");
}

function declareWinner(who) {
	document.querySelector(".endgame").style.display = "block";
	document.querySelector(".endgame .text").innerText = who;
}

function emptySquares() {
	return tableOrg.filter(s => typeof s == 'number');
}

function bestSpot() {
	return minimax(tableOrg, aiPlayer).index;
}

function checkTie() {
	if (emptySquares().length == 0) {
		for (var i = 0; i < cells.length; i++) {
			cells[i].style.backgroundColor = "green";
			cells[i].removeEventListener('click', turnClick, false);
		}
		declareWinner("match nul!")
		return true;
	}
	return false;
}

