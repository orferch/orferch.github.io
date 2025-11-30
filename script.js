document.addEventListener('DOMContentLoaded', () => {
    const boardWidth = 20;
    const boardHeight = 12;

    const gameBoard = document.getElementById('game-board');
    const scoreElement = document.getElementById('score');
    const colorPicker = document.getElementById('color-picker');
    const restartButton = document.getElementById('restart-button');

    let snake;
    let food;
    let direction;
    let newDirection;
    let score;
    let gameOver;
    let gameLoop;

    function startGame() {
        snake = [{ x: 10, y: 6 }];
        food = {};
        direction = 'right';
        newDirection = 'right';
        score = 0;
        gameOver = false;
        
        scoreElement.textContent = `Score: 0`;
        if (gameLoop) {
            clearInterval(gameLoop);
        }

        generateFood();
        gameLoop = setInterval(update, 200);
    }

    function generateFood() {
        food = {
            x: Math.floor(Math.random() * boardWidth),
            y: Math.floor(Math.random() * boardHeight)
        };
        // Ensure food doesn't spawn on the snake
        while (snake.some(segment => segment.x === food.x && segment.y === food.y)) {
            food = {
                x: Math.floor(Math.random() * boardWidth),
                y: Math.floor(Math.random() * boardHeight)
            };
        }
    }

    function draw() {
        let boardContent = '';
        for (let y = 0; y < boardHeight; y++) {
            for (let x = 0; x < boardWidth; x++) {
                if (snake.some(segment => segment.x === x && segment.y === y)) {
                    boardContent += '■';
                } else if (food.x === x && food.y === y) {
                    boardContent += '●';
                } else {
                    boardContent += ' ';
                }
            }
            boardContent += '\n';
        }
        gameBoard.textContent = boardContent;
    }

    function update() {
        if (gameOver) return;

        direction = newDirection;
        const head = { x: snake[0].x, y: snake[0].y };

        switch (direction) {
            case 'up': head.y--; break;
            case 'down': head.y++; break;
            case 'left': head.x--; break;
            case 'right': head.x++; break;
        }

        if (checkCollision(head)) {
            endGame();
            return;
        }

        snake.unshift(head);

        if (head.x === food.x && head.y === food.y) {
            score++;
            scoreElement.textContent = `Score: ${score}`;
            generateFood();
        } else {
            snake.pop();
        }

        draw();
    }

    function checkCollision(head) {
        return (
            head.x < 0 || head.x >= boardWidth ||
            head.y < 0 || head.y >= boardHeight ||
            snake.some(segment => segment.x === head.x && segment.y === head.y)
        );
    }

    function changeDirection(event) {
        const key = event.key;
        if (key === 'ArrowUp' && direction !== 'down') newDirection = 'up';
        if (key === 'ArrowDown' && direction !== 'up') newDirection = 'down';
        if (key === 'ArrowLeft' && direction !== 'right') newDirection = 'left';
        if (key === 'ArrowRight' && direction !== 'left') newDirection = 'right';
    }

    function handleButton(id) {
        if (id === 'up' && direction !== 'down') newDirection = 'up';
        if (id === 'down' && direction !== 'up') newDirection = 'down';
        if (id === 'left' && direction !== 'right') newDirection = 'left';
        if (id === 'right' && direction !== 'left') newDirection = 'right';
    }
    
    function endGame() {
        gameOver = true;
        clearInterval(gameLoop);
        // Display Game Over message on the board
        const boardArray = gameBoard.textContent.split('\n');
        const gameOverText = 'GAME OVER';
        const startX = Math.floor((boardWidth - gameOverText.length) / 2);
        const startY = Math.floor(boardHeight / 2);
        boardArray[startY] = boardArray[startY].substring(0, startX) + gameOverText + boardArray[startY].substring(startX + gameOverText.length);
        gameBoard.textContent = boardArray.join('\n');
    }

    // Event Listeners
    document.addEventListener('keydown', changeDirection);
    document.getElementById('up').addEventListener('click', () => handleButton('up'));
    document.getElementById('down').addEventListener('click', () => handleButton('down'));
    document.getElementById('left').addEventListener('click', () => handleButton('left'));
    document.getElementById('right').addEventListener('click', () => handleButton('right'));
    restartButton.addEventListener('click', startGame);

    colorPicker.addEventListener('change', (e) => {
        gameBoard.className = `color-${e.target.value}`;
    });

    // Start Game
    startGame();
});
