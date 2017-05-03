/* jshint browser: true */
/* jshint devel: true */
/* jshint esversion: 6 */


(function () {

	"use strict";

	window.onload = function () {
		Game.screen.newGame();
		addEventsListeners();
	};

	function addEventsListeners() {
		/*jshint loopfunc: true */


		for (var i = 0; i < Game.screen.state.blocks.length; i++) {

			Game.screen.state.blocks[i].addEventListener("click", function () {
				Game.screen.blockClicked(this);
			}, false);

		}

		Game.screen.state.imgX.addEventListener("click", function () {
			Game.screen.optionSelected(this);
		});
		Game.screen.state.imgO.addEventListener("click", function () {
			Game.screen.optionSelected(this);
		});

	}


	const Game = {
		screen: {
			state: {
				modal: document.getElementById("modal"),
				isPlayerTurn: true,
				isGameFinished: false,
				imgX: document.getElementById("image-x"),
				imgO: document.getElementById("image-o"),
				whoGoesFirstScreen: false,
				modalContent: document.getElementsByClassName("modal-content")[0],
				blocks: document.getElementsByClassName("block"),
				stateLbl: document.getElementById("state-label"),


			},
			postMove: function (id, token) {
				var imgStr = token === "X" ? "url('img/x.png')" : "url('img/O.png')";
				var block = document.getElementById(id);
				block.style.background = imgStr;
				block.style.backgroundSize = "cover";
			},
			clear: function () {
				Game.screen.state.stateLbl.innerHTML = "";

				for (var i = 0; i < Game.screen.state.blocks.length; i++) {

					Game.screen.state.blocks[i].style.background = "white";

				}


			},
			reset: function () {

				Game.screen.state.isPlayerTurn = true;
				Game.screen.state.isGameFinished = false;
				Game.screen.state.whoGoesFirstScreen = false;

			},

			gameSetup: function () {
				Game.screen.chooseToken();
				Game.screen.showModal();
			},
			newGame: function () {
				Game.board.reset();
				Game.screen.reset();
				Game.screen.clear();
				Game.screen.gameSetup();

			},
			gameEnds: function (str) {
				Game.screen.state.isGameFinished = true;
				Game.screen.state.stateLbl.innerHTML = str;
				
				setTimeout(function () {
					Game.screen.state.stateLbl.innerHTML = "Restarting the game...";
					
				}, 4000);
				
				setTimeout(function () {
					Game.screen.newGame();
				}, 6000);
			},
			chooseToken: function () {
				var modalPar = document.getElementsByClassName("modal-par")[0];

				modalPar.innerHTML = "Which one do you want to be?";
				Game.screen.state.imgO.src = "img/O.png";
				Game.screen.state.imgX.src = "img/X.png";

			},
			whoFirst: function () {
				var modalPar = document.getElementsByClassName("modal-par")[0];

				modalPar.innerHTML = "Who goes first?";
				Game.screen.state.imgX.src = "img/human.png";
				Game.screen.state.imgO.src = "img/cpu.png";
			},
			showModal: function () {

				Game.screen.state.modal.style.display = "block";
			},

			showModalContent: function () {
				Game.screen.state.modalContent.style.opacity = "1";
			},

			hideModalContent: function () {
				Game.screen.state.modalContent.style.opacity = "0";
			},
			blockClicked: function (ob) {
				if (Game.screen.state.isPlayerTurn) {
					var str = ob.id[ob.id.length - 1];

					var index = (parseInt(str) - 1);

					if (Game.gameplay.humanMove(index)) {
						Game.screen.postMove(ob.id, Game.gameplay.state.humanToken);
						Game.gameplay.postMoveManager();

						Game.screen.state.isPlayerTurn = false;
						if (!Game.screen.state.isGameFinished && !Game.screen.state.isPlayerTurn) {
							Game.gameplay.cpuMove();
						}

					}

				}
			},
			optionSelected: function (ob) {
				var option = ob.dataset.option;

				if (!Game.screen.state.whoGoesFirstScreen) {

					Game.gameplay.state.humanToken = option;
					Game.gameplay.state.cpuToken = Game.gameplay.state.humanToken === "X" ? "O" : "X";


					Game.screen.hideModalContent();


					setTimeout(function () {
						Game.screen.whoFirst();
						Game.screen.showModalContent();
						Game.screen.state.whoGoesFirstScreen = true;
					}, 1000);

				} else {
					Game.screen.state.isPlayerTurn = option === "X" ? true : false;
					Game.screen.hideModal();
					Game.gameplay.state.movesLeft = 9;


					if (!Game.screen.state.isPlayerTurn) {
						Game.screen.state.stateLbl.innerHTML = "Machine's turn";
						
						
						Game.gameplay.cpuMove();
					
						
						

					} else {
						Game.screen.state.stateLbl.innerHTML = "Human's turn";
					}



				}

			},

			hideModal: function () {
				Game.screen.state.modal.style.display = "none";
			}
		},
		board: {
			current: [
			null, null, null,
	 		null, null, null,
			null, null, null,
			],
			reset: function () {
				Game.board.current = [
					null, null, null,
					null, null, null,
					null, null, null,
				];
			},
			move: function (token, index) {
				if (Game.board.isValid(index)) {
					Game.board.current[index] = token;
					return true;
				}
				return false;
			},
			isValid: function (index) {
				if (Game.board.current[index] === null) {
					return true;
				}
				return false;
			},
			hasWon: function (board) {

				const winStates = [
                    [0, 1, 2],
    				[3, 4, 5],
    				[6, 7, 8],
    				[0, 3, 6],
    			 	[1, 4, 7],
    			 	[2, 5, 8],
    				[0, 4, 8],
    			  	[2, 4, 6]
                ];

				board = board || Game.board.current;

				const check = function (board, loc1, loc2, loc3) {
					if (![board[loc1], board[loc2], board[loc3]].includes(null) && board[loc1] === board[loc2] && board[loc1] === board[loc3]) {
						return true;
					}
					return false;
				};

				// loop through combo list and check for the winner
				for (let i = 0; i < winStates.length; i++) {
					if (check(board, winStates[i][0], winStates[i][1], winStates[i][2])) {
						return {
							result: true,
							who: board[winStates[i][0]],
							how: winStates[i]
						};
					}
				}
				// or return false;
				return {
					result: false,
					who: null
				};
			},
			isDraw: function () {
				// are there any empty spaces and have we exhausted all available moves?
				if (!Game.board.current.includes(null) && Game.gameplay.state.movesLeft === 0) {
					return true;
				}
				return false;
			}
		},
		gameplay: {
			state: {
				movesLeft: null,
				humanToken: null,
				cpuToken: null,
				currentPlayer: null,
				whoFirst: null,
				firstGame: true,
				win: false,
				draw: false
			},
			humanMove: function (index) {
				Game.screen.state.stateLbl.innerHTML = "Human's turn";
				if (Game.board.move(Game.gameplay.state.humanToken, index)) {
					return true;
				}
				return false;
			},
			cpuMove: function () {
				Game.screen.state.stateLbl.innerHTML = "Machine's turn";
				setTimeout(function () {
						Game.screen.state.stateLbl.innerHTML = "Machine is thinking...";
						}, 1000);
						
				
				setTimeout(function () {
					Game.gameplay.ai.minimax(Game.gameplay.state.cpuToken, Game.gameplay.state.humanToken);
				Game.gameplay.postMoveManager();
				}, 2000);

				
				

			},
			postMoveManager: function () {
				// reduce number of available moves
				Game.gameplay.state.movesLeft--;


				// check if someone won
				let winCheck = Game.board.hasWon();
				if (winCheck.result) {
					//					Screen.game.winFlash(winCheck.how);
					if (winCheck.who === Game.gameplay.state.humanToken) {
						Game.gameplay.humanWin();
						return;
					}
					Game.gameplay.cpuWin();
					return;
				}
				// or check for the draw
				if (Game.board.isDraw()) {
					Game.gameplay.nobodyWin();
					return;
				}
				// otherwise swap the players
				Game.gameplay.swapActivePlayer();
				// play computer move or wait for player

			},
			ai: {
				minimax: function (maxMe, minMe) {
					let nextMove = null;

					// recursive minimax tree search and scoring function
					const mmRecursiveSearch = function (board, lastPlayer, depth) {

						if (Game.board.hasWon(board).who === maxMe) {

							return (10 - depth);
						} else if (Game.board.hasWon(board).who === minMe) {

							return (depth - 10);
						}

						let nextPlayer = lastPlayer === "X" ? "O" : "X";
						let moves = [],
							scores = [];

						for (let i = 0; i < board.length; i++) {
							// copy our board
							let nextBoard = board.slice();

							if (nextBoard[i] === null) {
								nextBoard[i] = nextPlayer;

								moves.push(i);
								scores.push(mmRecursiveSearch(nextBoard, nextPlayer, depth + 1));
							}
						}

						if (depth === 0) {

							nextMove = moves[scores.indexOf(Math.max.apply(null, scores))];

							console.log("Moves were possible at: " + moves);
							console.log("Scores came out at: " + scores);
							console.log("Make your next move at: " + nextMove);

						} else { // any other depth
							if (moves.length === 0) { // no more moves could be made,
								return 0;
							}

							if (nextPlayer === maxMe) { // which scores do we want? depends if it's a min or max turn!
								return Math.max.apply(Math, scores); // for the max turns, pass back max scores.
							} else {
								return Math.min.apply(Math, scores); // for the min turns, pass back min scores.
							}
						}

					};

					// find our next move
					mmRecursiveSearch(Game.board.current, minMe, 0);
					// play it!
					console.log("OK, making move at: " + nextMove);
					if (Game.board.move(maxMe, nextMove)) {
						var idNum = nextMove + 1;
						var id = "block-" + idNum;
						Game.screen.postMove(id, maxMe);
						Game.screen.state.stateLbl.innerHTML = "Human's turn";



						console.log("Move successful");
					} else {
						console.log("Move failed");
					}
				},
			},
			swapActivePlayer: function () {
				Game.screen.state.isPlayerTurn = !Game.screen.state.isPlayerTurn;
			},
			humanWin: function () {


				Game.screen.gameEnds("No way! ....Human Wins....");
			},
			nobodyWin: function () {

				Game.screen.gameEnds("It's a tie.... I was not even trying....");


			},
			cpuWin: function () {

				Game.screen.gameEnds("Machine beats the pathetic human!");



			},

		}
	};


})();