'use strict'
const container = document.getElementById('CONTAINER');
const canvas = document.getElementById('GAME');
const ctx = canvas.getContext('2d');

let widthOfCan = 800;
let heightOfCan = 640;
canvas.width = widthOfCan;
canvas.height = heightOfCan;

const appleImg = new Image();
appleImg.src = './images/apple.png';
const bananaImg = new Image();
bananaImg.src = './images/banana.png';
const bombImg = new Image();
bombImg.src = './images/bomb.png'

const soundOfFood = new Audio();
soundOfFood.src = '../sounds/soundOfFood.mp3';
const soundOfBomb = new Audio();
soundOfBomb.src = '../sounds/soundOfBomb.mp3';

// let stateOfGame = 0;
let box = widthOfCan / 25;
let score = 0;

//создаем еду для змейки
class Food {
    constructor() {
        this.xApple = randomDiap(2, 23) * box;
        this.yApple = randomDiap(2, 18) * box;
        this.xBanana = randomDiap(2, 23) * box;
        this.yBanana = randomDiap(2, 18) * box;
    }
    drawApple() {
        return appleImg;
    }
    drawBanana() {
        return bananaImg;
    }
}
let food = new Food();

//создаем бомбы
class Bomb {
    constructor() {
        this.xBomb = randomDiap(2, 23) * box;
        this.yBomb = randomDiap(2, 18) * box;
    }
    drawBomb() {
        return bombImg;
    }
}
let bomb = new Bomb();
//создаем змейку
class Snake {
    constructor() {
        this.head = [];
        this.head[0] = {
            x: 5 * box,
            y: 5 * box,
        }
        this.color = {
            first: '#ED237F',
            small: '#9AEF69',
            medium: '#FFF92B',
            big: '#F1879F',
            extra: '#2D472D',
        };
    }
    drawSnake() {
        for (let i = 0; i < (this.head).length; i++) {
            let c = function (body) {
                if (i == 0) {
                    return body.color.first;
                } else {
                    if (body.head.length >= 2 && body.head.length < 15) {
                        return body.color.small;
                    } else if (body.head.length >= 15 && body.head.length < 25) {
                        return body.color.medium;
                    } else if (body.head.length >= 25 && body.head.length < 35) {
                        return body.color.big;
                    } else if (body.head.length >= 35) {
                        return body.color.extra;
                    }
                }
            };
            console.log(this.head.length);
            ctx.beginPath();
            ctx.shadowOffsetY = 4;
            ctx.shadowBlur = 2;
            ctx.fillStyle = c(this);
            ctx.shadowColor = "rgba(0, 0, 0, .5)";
            // ctx.fillRect(this.head[i].x, this.head[i].y, box, box);
            ctx.arc(this.head[i].x, this.head[i].y, box / 2, 0, Math.PI * 2, false);
            ctx.fill();
            ctx.closePath();
        }
    }
}
let snake = new Snake();

//область счета
function scoreBlock() {
    ctx.beginPath();
    ctx.lineWidth = box * 2;
    ctx.strokeStyle = '#202020';
    ctx.moveTo(0, box);
    ctx.lineTo(widthOfCan, box);
    ctx.stroke();
    ctx.closePath();

    ctx.beginPath();
    ctx.fillStyle = snake.color.first;
    ctx.font = `${widthOfCan / 16}px Arial`;
    ctx.fillText(score, box, box * 1.5);
    ctx.closePath();
}
//стены
function wall() {
    ctx.beginPath(); //правая стена
    ctx.lineWidth = box;
    ctx.strokeStyle = 'rgba(32, 32, 32, .7)';
    ctx.moveTo(widthOfCan - box / 2, box * 2);
    ctx.lineTo(widthOfCan - box / 2, heightOfCan);
    ctx.stroke();
    ctx.closePath();

    ctx.beginPath(); //левая стена
    ctx.lineWidth = box;
    ctx.strokeStyle = 'rgba(32, 32, 32, .7)';
    ctx.moveTo(box / 2, box * 2);
    ctx.lineTo(box / 2, heightOfCan);
    ctx.stroke();
    ctx.closePath();

    ctx.beginPath(); //левая стена
    ctx.lineWidth = box;
    ctx.strokeStyle = 'rgba(32, 32, 32, .7)';
    ctx.moveTo(0, heightOfCan - box / 2);
    ctx.lineTo(widthOfCan, heightOfCan - box / 2);
    ctx.stroke();
    ctx.closePath();
}
//если змейка сталкивается с собственным телом
function eatTail(head, body) {
    for (let elem of body) {
        if (head.x == elem.x && head.y == elem.y) {
            alert('game over');
        }
    }
}

function randomDiap(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
//УПРАВЛЕНИЕ НА КЛАВИАТУРЕ
let direction;
document.addEventListener('keydown', function (e) {
    if (e.keyCode == 37 && direction != 'right') {
        direction = 'left';
    } else if (e.keyCode == 38 && direction != 'down') {
        direction = 'up';
    } else if (e.keyCode == 39 && direction != 'left') {
        direction = 'right';
    } else if (e.keyCode == 40 && direction != 'up') {
        direction = 'down';
    }
})

//РЕНДЕРИНГ ИГРЫ
function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    window.onload = function () {
        ctx.drawImage(food.drawApple(), food.xApple, food.yApple);
        ctx.drawImage(food.drawBanana(), food.xBanana, food.yBanana);
        ctx.drawImage(bomb.drawBomb(), bomb.xBomb, bomb.yBomb);
    }
    scoreBlock();
    wall();
    snake.drawSnake();

    let snakeX = snake.head[0].x; //координаты нахождения головы змейки
    let snakeY = snake.head[0].y;

    if (((snakeX == food.xApple || snakeX == food.xApple + box) && snakeY >= (food.yApple - box / 4) && snakeY <= (food.yApple + box + box / 4)) || ((snakeY == food.yApple || snakeY == food.yApple + box) && snakeX >= (food.xApple - box / 4) && snakeX <= (food.xApple + box + box / 4))) {
        score++;
        soundOfFood.play();
        do {
            food.xApple = randomDiap(2, 23) * box;
            food.yApple = randomDiap(2, 18) * box;
        } while ((food.xApple === food.xBanana && food.yApple === food.yBanana) || (food.xApple === bomb.xBomb && food.yApple === bomb.yBomb) || (food.xApple === snakeX - box / 2, food.yApple === snakeY - box / 2));
        ctx.drawImage(food.drawApple(), food.xApple, food.yApple);
    } else if (((snakeX == food.xBanana || snakeX == food.xBanana + box) && snakeY >= (food.yBanana - box / 4) && snakeY <= (food.yBanana + box + box / 4)) || ((snakeY == food.yBanana || snakeY == food.yBanana + box) && snakeX >= (food.xBanana - box / 4) && snakeX <= (food.xBanana + box + box / 4))) {
        score++;
        soundOfFood.play();
        do {
            food.xBanana = randomDiap(2, 23) * box;
            food.yBanana = randomDiap(2, 18) * box;
        } while ((food.xBanana === food.xApple && food.yBanana === food.yApple) || (food.xBanana === bomb.xBomb && food.yBanana === bomb.yBomb) || (food.xBanana === snakeX - box / 2, food.yBanana === snakeY - box / 2));
        ctx.drawImage(food.drawBanana(), food.xBanana, food.yBanana);
    }
    else if (((snakeX == bomb.xBobm || snakeX == bomb.xBomb + box) && snakeY >= (bomb.yBomb - box / 4) && snakeY <= (bomb.yBomb + box + box / 4)) || ((snakeY == bomb.yBomb || snakeY == bomb.yBomb + box) && snakeX >= (bomb.xBomb - box / 4) && snakeX <= (bomb.xBomb + box + box / 4))) {
        score--;
        soundOfBomb.play();
        do {
            bomb.xBomb = randomDiap(2, 23) * box;
            bomb.yBomb = randomDiap(2, 18) * box;
        } while ((bomb.xBomb === food.xApple && bomb.yBomb === food.yApple) || (bomb.xBomb === food.xBanana && bomb.yBomb === food.yBanana) || (bomb.xBomb === snakeX - box / 2, bomb.yBomb === snakeY - box / 2));
        if (snake.head.length > 1) {
            snake.head.splice(snake.head.length - 2, 2);
        } else {
            // stateOfGame  = 'game over';
            alert('game over');
        }
    }
    else {
        snake.head.pop();
    }

    //столкновение с основными стенами
    if (snakeX < box * 1.5 || snakeX > box * 23.5 || snakeY < box * 2.5 || snakeY > box * 18.5) {
        alert('game over');
    }

    if (direction == 'left') { snakeX -= box / 2 };
    if (direction == 'right') { snakeX += box / 2 };
    if (direction == 'up') { snakeY -= box / 2 };
    if (direction == 'down') { snakeY += box / 2 };

    let newHead = {
        x: snakeX,
        y: snakeY,
    }

    eatTail(newHead, snake.head);
    snake.head.unshift(newHead);
    console.log(food.xApple, food.yApple, food.xBanana, food.yBanana, bomb.xBomb, bomb.yBomb);

}

setInterval(drawGame, 80);

window.onload = function () {
    document.body.classList.add('loaded_hiding');
    window.setTimeout(function () {
        document.body.classList.add('loaded');
        document.body.classList.remove('loaded_hiding');
    }, 1000);
}