const CELL_SIZE = 20;
const CANVAS_SIZE = 500;
const REDRAW_INTERVAL = 50;
const WIDTH = CANVAS_SIZE / CELL_SIZE;
const HEIGHT = CANVAS_SIZE / CELL_SIZE;
const DIRECTION = {
    LEFT: 0,
    RIGHT: 1,
    UP: 2,
    DOWN: 3,
}
const MOVE_INTERVAL = 120;
let life = 3;
// initialize count eat apple for level
let countEatApple = 0;
let level = 1;

function initPosition() {
    return {
        x: Math.floor(Math.random() * WIDTH),
        y: Math.floor(Math.random() * HEIGHT),
    }
}

function initHeadAndBody() {
    let head = initPosition();
    let body = [{x: head.x, y: head.y}];
    return {
        head: head,
        body: body,
    }
}

function initDirection() {
    return Math.floor(Math.random() * 4);
}

function initSnake(color) {
    return {
        color: color,
        ...initHeadAndBody(),
        direction: initDirection(),
        // score: 0,
    }
}

function initSnakeReturn() {
    return {
        score: 0
    }
}

// initialize snake2 and snake3 for test
let snake1 = initSnake("green", "snake");
let snake2
let snake3
let snakeReturn = initSnakeReturn();

let apples = [{
    position: initPosition(),
},
{
    position: initPosition(),
}]

function drawCell(ctx, x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
}

function drawImg(ctx, img, x, y) {
    ctx.drawImage(img, x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
}

function drawScore(snake) {
    let scoreCanvas;
    if (snake.color == snake1.color) {
        scoreCanvas = document.getElementById("scoreBoard");
    }
    let scoreCtx = scoreCanvas.getContext("2d");

    scoreCtx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    scoreCtx.font = "30px Arial";
    scoreCtx.fillStyle = "green";
    scoreCtx.fillText(snakeReturn.score, 10, scoreCanvas.scrollHeight / 2);
}

function draw() {
    setInterval(function() {
        let snakeCanvas = document.getElementById("snakeBoard");
        let ctx = snakeCanvas.getContext("2d");
        let snakeHead = document.getElementById("snake-head");
        let lifes = document.getElementById("life");

        ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
        
        drawImg(ctx,snakeHead, snake1.head.x, snake1.head.y);
        for (let i = 1; i < snake1.body.length; i++) {
            drawCell(ctx, snake1.body[i].x, snake1.body[i].y, snake1.color);
        }

        for(let i = 0; i < life; i++){
            drawImg(ctx, lifes, i, 0);
        }

        for (let i = 0; i < apples.length; i++) {
            let apple = apples[i];
            var img = document.getElementById("apple");
            ctx.drawImage(img, apple.position.x * CELL_SIZE, apple.position.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
        }

        if (level > 1) {
            let snakeCanvas = document.getElementById("snakeBoard");
            let ctx = snakeCanvas.getContext("2d");

            drawCell(ctx, snake2.head.x, snake2.head.y, snake2.color, "block");
            for (let i = 1; i < snake2.body.length; i++) {
                drawCell(ctx, snake2.body[i].x, snake2.body[i].y, snake2.color, "block");
            }
        }    
        drawScore(snake1);
        document.getElementById("snake-level").innerHTML = level;
        document.getElementById("snake-speed").innerHTML = "Speed: " + MOVE_INTERVAL + "ms";
    }, REDRAW_INTERVAL);
}

function teleport(snake) {
    if (snake.head.x < 0) {
        snake.head.x = CANVAS_SIZE / CELL_SIZE - 1;
    }
    if (snake.head.x >= WIDTH) {
        snake.head.x = 0;
    }
    if (snake.head.y < 0) {
        snake.head.y = CANVAS_SIZE / CELL_SIZE - 1;
    }
    if (snake.head.y >= HEIGHT) {
        snake.head.y = 0;
    }
}

function eat(snake, apples) {
    for (let i = 0; i < apples.length; i++) {
        let apple = apples[i];
        if (snake.head.x == apple.position.x && snake.head.y == apple.position.y) {
            apple.position = initPosition();
            snakeReturn.score++;
            countEatApple++;
            snake.body.push({x: snake.head.x, y: snake.head.y});
            if (countEatApple === 5) {
                countEatApple = 0
                level++;
                var audio = new Audio('assets/level-up.mp3');
                audio.play();
                setTimeout(() => {
                    alert(`Yeayyy!! Berhasil naik level ${level}, lanjutkan!`);
                }, 300)
            }
            if (level === 5) {
                // final game
                level = 1;
                countEatApple = 0
                setTimeout(() => {
                    alert("GAME OVER!");
                }, 300)
                countEatApple = 0
                level = 1
                snake1 = initSnake("green", "snake");
            }
            // test for create walls
            if (level > 1) {
                snake2 = initSnake("black", "block");
                snake3 = initSnake("black", "block");
            }
        }
    }
}

function moveLeft(snake) {
    snake.head.x--;
    teleport(snake);
    eat(snake, apples);
}

function moveRight(snake) {
    snake.head.x++;
    teleport(snake);
    eat(snake, apples);
}

function moveDown(snake) {
    snake.head.y++;
    teleport(snake);
    eat(snake, apples);
}

function moveUp(snake) {
    snake.head.y--;
    teleport(snake);
    eat(snake, apples);
}

function checkCollision(snakes) {
    let isCollide = false;
    //this
    for (let i = 0; i < snakes?.length; i++) {
        for (let j = 0; j < snakes?.length; j++) {
            for (let k = 1; k < snakes[j]?.body.length; k++) {
                if (snakes[i]?.head.x == snakes[j]?.body[k].x && snakes[i]?.head.y == snakes[j]?.body[k].y) {
                    isCollide = true;
                }
            }
        }
    }
    if (isCollide) {
        life--;
        if(life === 0) {
            var audio = new Audio('assets/game-over.mp3');
            audio.play();
            alert("GAME OVER!!");
            setTimeout(() => {
                alert("GAME OVER!!");
            }, 300)
            life = 3
            level = 1
            snakeReturn = initSnakeReturn();
        } 
        countEatApple = 0
        snake1 = initSnake("green", "snake");
        snake2 = initSnake("black", "block");
        snake3 = initSnake("black", "block");
    }
    return isCollide;
}


function move(snake) {
    switch (snake.direction) {
        case DIRECTION.LEFT:
            moveLeft(snake);
            break;
        case DIRECTION.RIGHT:
            moveRight(snake);
            break;
        case DIRECTION.DOWN:
            moveDown(snake);
            break;
        case DIRECTION.UP:
            moveUp(snake);
            break;
    }
    moveBody(snake);
    if (!checkCollision([snake])) {
        setTimeout(function() {
            move(snake);
        }, MOVE_INTERVAL);
    } else {
        initGame();
    }
}

function moveBody(snake) {
    snake.body.unshift({ x: snake.head.x, y: snake.head.y });
    snake.body.pop();
}

function turn(snake, direction) {
    const oppositeDirections = {
        [DIRECTION.LEFT]: DIRECTION.RIGHT,
        [DIRECTION.RIGHT]: DIRECTION.LEFT,
        [DIRECTION.DOWN]: DIRECTION.UP,
        [DIRECTION.UP]: DIRECTION.DOWN,
    }

    if (direction !== oppositeDirections[snake.direction]) {
        snake.direction = direction;
    }
}

document.addEventListener("keydown", function (event) {
    if (event.key === "a") {
        turn(snake1, DIRECTION.LEFT);
    } else if (event.key === "d") {
        turn(snake1, DIRECTION.RIGHT);
    } else if (event.key === "w") {
        turn(snake1, DIRECTION.UP);
    } else if (event.key === "s") {
        turn(snake1, DIRECTION.DOWN);
    }
})

function initGame() {
    move(snake1);
}

initGame();
