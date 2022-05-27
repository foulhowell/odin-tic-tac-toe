const container = document.querySelector('.container');
const gameBoardDiv = document.querySelector('.game-board');
const squares = gameBoardDiv.querySelectorAll('.square');

const gameBoard = (() => {
    let board = ["","","","","","","","",""];

    const checkForWin = (marker) => {
        const winConditions = [
            [0,1,2],
            [3,4,5],
            [6,7,8],
            [0,3,6],
            [1,4,7],
            [2,5,8],
            [0,4,8],
            [2,4,6]
        ];
        for (let i = 0; i <= winConditions.length - 1; i++) {
            if (board[winConditions[i][0]] == marker && board[winConditions[i][1]] == marker && board[winConditions[i][2]] == marker ) {
                displayController.makeSquaresGreen(winConditions[i]);
                return true;
            }
        }
    }

    const checkForTie = () => {
        if (board.includes("")) {
            return false;
        }
        else {
            return true;
        }
    }

    const setCell = (index, value) => {
        if (board[index] == "") {
            board[index] = value;
            updateBoard();
        }
    }

    const getBoard = () => {
        return [...board];
    }

    const updateBoard = () => {
        let placeholderBoard = getBoard();
        for (let i = 0; i <= squares.length - 1; i++) {
            squares[i].textContent = placeholderBoard[i];
        }
    }

    const resetBoard = () => {
        board = ["","","","","","","","",""];
        for (let i = 0; i <= squares.length - 1; i++) {
            if (squares[i].classList.contains('winning-square')) {
                squares[i].classList.remove('winning-square');
            }
        }
        updateBoard();
    }

    return {
        setCell, getBoard, updateBoard, resetBoard, checkForWin, checkForTie
    };
})();

const Player = (marker, name) => {
    const getMarker = () => marker;
    const getName = () => name;

    return {
        getMarker, getName
    }
};

const displayController = (() => {
    const playerOneDisplay = document.querySelector('.player-one');
    const playerTwoDisplay = document.querySelector('.player-two');
    const makeSquaresGreen = (winningSquares) => {
        for (let i = 0; i <= winningSquares.length - 1; i++) {
            squares[winningSquares[i]].classList.add('winning-square');
        }
    }

    const displayWinner = (winnersName) => {
        let winnerDisplay = document.createElement('h3');
        winnerDisplay.textContent = (winnersName + ' wins!');
        winnerDisplay.classList.add('outcome-display');
        container.appendChild(winnerDisplay);
    }

    const displayTie = () => {
        let tieDisplay = document.createElement('h3');
        tieDisplay.textContent = ("It's a tie!");
        tieDisplay.classList.add('outcome-display');
        container.appendChild(tieDisplay);
    }

    const displayPlayers = (playerOneName, playerTwoName) => {
        playerOneDisplay.textContent = (playerOneName + " - X");
        playerTwoDisplay.textContent = (playerTwoName + " - O");
    }

    return {
        makeSquaresGreen, displayWinner, displayTie, displayPlayers
    }
})();

const game = (() => {
    const playerOne = Player('X', 'Player 1');
    const playerTwo = Player('O', 'Player 2');
    let gameOver = false;
    displayController.displayPlayers(playerOne.getName(), playerTwo.getName());
    let currentPlayer = playerOne;
    gameBoardDiv.addEventListener('click', event => {
        if (gameOver) return;
        let index = Array.prototype.indexOf.call(gameBoardDiv.children, event.target);
        gameBoard.setCell(index, currentPlayer.getMarker());
        if (gameBoard.checkForWin(currentPlayer.getMarker())) {
            displayController.displayWinner(currentPlayer.getName());
            gameOver = true;
        }
        else if (gameBoard.checkForTie()) {
            displayController.displayTie();
            gameOver = true;
        }
        switchPlayers();
    })

    const switchPlayers = () => {
        if (currentPlayer == playerOne) {
            currentPlayer = playerTwo;
        }
        else if (currentPlayer == playerTwo) {
            currentPlayer = playerOne;
        }
    }

    const resetGame = () => {
        currentPlayer = playerOne;
        gameBoard.resetBoard();
        if (container.querySelector('.outcome-display') != null) {
            const winnerDisplay = container.querySelector('.outcome-display');
            container.removeChild(winnerDisplay);
        }
        gameOver = false;
    }

    const resetButton = document.querySelector('.reset-btn');
    resetButton.addEventListener('click', resetGame);

    return {
        switchPlayers, resetGame
    }
})();