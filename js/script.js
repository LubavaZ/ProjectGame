'use strict'
const container = document.getElementById('CONTAINER');
const canvas = document.getElementById('GAME');
const ctx = canvas.getContext('2d');

let windowW = window.innerWidth;
let windowH = window.innerHeight;

InitApp();
window.addEventListener("resize", InitApp);

function InitApp() {
    if (windowW >= 970) {
        canvas.width = 800;
        canvas.height = 640;
    } else {
        canvas.style.transform = 'none';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.width = windowW;
        canvas.height = windowH;
    }
}

let widthOfCan = canvas.width;
let heightOfCan = canvas.height;

// let stateOfGame = 0;
let boxX = widthOfCan / 25;
let boxY = heightOfCan / 25;
let sizeImg = 32;
let score = 0;

const appleImg = new Image();
appleImg.src = 'images/apple.png';
const bananaImg = new Image();
bananaImg.src = 'images/banana.png';
const bombImg = new Image();
bombImg.src = 'images/bomb.png'

const soundOfFood = new Audio();
soundOfFood.src = 'sounds/soundOfFood.mp3';
const soundOfBomb = new Audio();
soundOfBomb.src = 'sounds/soundOfBomb.mp3';

//иконки для мини-меню
let playSVG = document.getElementById('PLAY');
let pauseSVG = document.getElementById('PAUSE');
let soundON = document.getElementById('sON');
let soundOFF = document.getElementById('sOFF');

placeSVG(playSVG, boxX, boxY);
placeSVG(pauseSVG, boxX, boxY);
placeSVG(soundON, boxX, boxY);
placeSVG(soundOFF, boxX, boxY);
//кнопки бокового меню для больших экранов
let playSide = document.querySelector('.play');
let pauseSide = document.querySelector('.pause');
let soundSide = document.querySelector('.sound');
let leftSide = 50;
let topSide = 50;

placeSVGSide(playSide, leftSide, topSide);
placeSVGSide(pauseSide, leftSide, topSide);
placeSVGSide(soundSide, leftSide, topSide);

function placeSVG(pSVG, w, h) {
    if (windowW >= 970) {
        pSVG.style.display = 'none';
    } else {
        pSVG.style.display = 'block';
        pSVG.style.position = 'absolute';
        pSVG.style.zIndex = '10';
        pSVG.style.width = w * 2;
        pSVG.style.height = h * 2;
        pSVG.style.top = 0;
        if (pSVG === playSVG) {
            pSVG.style.right = 0;
        } else if (pSVG === pauseSVG) {
            pSVG.style.right = w * 2.5;
        } else if (pSVG === soundON || pSVG === soundOFF) {
            pSVG.style.right = w * 5;
        }
    }
}
function placeSVGSide(pSVGs, w, h) {
    if (windowW < 970) {
        pSVGs.style.display = 'none';
    } else {
        pSVGs.style.display = 'block';
        pSVGs.style.position = 'absolute';
        pSVGs.style.width = w * 2 + 'px';
        pSVGs.style.height = h * 2 + 'px';
        pSVGs.style.left = '900px';
        pSVGs.style.border = 'none';
        pSVGs.style.background = 'transparent'
        if (pSVGs === playSide) {
            pSVGs.style.top = h * 3 + 'px';
        } else if (pSVGs === pauseSide) {
            pSVGs.style.top = h * 5 + 'px';
        } else if (pSVGs === soundSide) {
            pSVGs.style.top = h * 7 + 'px';
        }
    }
}


//создаем еду для змейки
class Food {
    constructor() {
        this.xApple = randomDiap(2, 22) * boxX;
        this.yApple = randomDiap(2, 21) * boxY;
        this.xBanana = randomDiap(2, 22) * boxX;
        this.yBanana = randomDiap(2, 21) * boxY;
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
        this.xBomb = randomDiap(2, 22) * boxX;
        this.yBomb = randomDiap(2, 21) * boxY;
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
            x: 5 * boxX,
            y: 5 * boxY,
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
                    if (body.head.length >= 2 && body.head.length < 20) {
                        return body.color.small;
                    } else if (body.head.length >= 20 && body.head.length < 35) {
                        return body.color.medium;
                    } else if (body.head.length >= 35 && body.head.length < 50) {
                        return body.color.big;
                    } else if (body.head.length >= 75) {
                        return body.color.extra;
                    }
                }
            };
            ctx.beginPath();
            ctx.shadowOffsetY = 4;
            ctx.shadowBlur = 2;
            ctx.fillStyle = c(this);
            ctx.shadowColor = "rgba(0, 0, 0, .5)";
            // ctx.fillRect(this.head[i].x, this.head[i].y, box, box);
            ctx.arc(this.head[i].x, this.head[i].y, sizeImg / 2, 0, Math.PI * 2, false);
            ctx.fill();
            ctx.closePath();
        }
    }

    collision(objX, objY, x, y) {
        if (x >= objX - sizeImg / 2 && x <= objX + sizeImg + sizeImg / 4 && y >= objY - sizeImg / 2 && y <= objY + sizeImg + sizeImg / 4) {
            return true;
        }
    }
}
let snake = new Snake();

//область счета
function scoreBlock() {
    ctx.beginPath();
    ctx.lineWidth = boxY * 2;
    ctx.strokeStyle = '#202020';
    ctx.moveTo(0, boxY);
    ctx.lineTo(widthOfCan, boxY);
    ctx.stroke();
    ctx.closePath();

    ctx.beginPath();
    ctx.fillStyle = snake.color.first;
    ctx.font = `${heightOfCan / 12}px Arial`;
    ctx.fillText(score, boxX, boxY * 1.7);
    ctx.closePath();
}
//стены
function wall() {
    ctx.beginPath(); //правая стена
    ctx.lineWidth = boxX;
    ctx.strokeStyle = 'rgba(32, 32, 32, .7)';
    ctx.moveTo(widthOfCan - boxX / 2, boxY * 2);
    ctx.lineTo(widthOfCan - boxX / 2, heightOfCan);
    ctx.stroke();
    ctx.closePath();

    ctx.beginPath(); //левая стена
    ctx.lineWidth = boxX;
    ctx.strokeStyle = 'rgba(32, 32, 32, .7)';
    ctx.moveTo(boxX / 2, boxY * 2);
    ctx.lineTo(boxX / 2, heightOfCan);
    ctx.stroke();
    ctx.closePath();

    ctx.beginPath(); //нижняя стена
    ctx.lineWidth = boxX;
    ctx.strokeStyle = 'rgba(32, 32, 32, .7)';
    ctx.moveTo(0, heightOfCan - boxY / 2);
    ctx.lineTo(widthOfCan, heightOfCan - boxY / 2);
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
    ctx.drawImage(food.drawApple(), food.xApple, food.yApple);
    ctx.drawImage(food.drawBanana(), food.xBanana, food.yBanana);
    ctx.drawImage(bomb.drawBomb(), bomb.xBomb, bomb.yBomb);

    scoreBlock();
    wall();
    snake.drawSnake();

    let snakeX = snake.head[0].x; //координаты нахождения головы змейки
    let snakeY = snake.head[0].y;

    if (snake.collision(food.xApple, food.yApple, snakeX, snakeY) === true) {
        score++;
        soundOfFood.play();
        do {
            food.xApple = randomDiap(2, 22) * boxX;
            food.yApple = randomDiap(2, 21) * boxY;
        } while ((food.xApple === food.xBanana && food.yApple === food.yBanana) || (food.xApple === bomb.xBomb && food.yApple === bomb.yBomb) || (food.xApple >= snakeX - sizeImg / 2 && food.xApple <= snakeX + sizeImg / 2 && food.yApple >= snakeY - sizeImg / 2 && food.yApple <= snakeY + sizeImg / 2));
        ctx.drawImage(food.drawApple(), food.xApple, food.yApple);
    } else if (snake.collision(food.xBanana, food.yBanana, snakeX, snakeY) === true) {
        score++;
        soundOfFood.play();
        do {
            food.xBanana = randomDiap(2, 22) * boxX;
            food.yBanana = randomDiap(2, 21) * boxY;
        } while ((food.xBanana === food.xApple && food.yBanana === food.yApple) || (food.xBanana === bomb.xBomb && food.yBanana === bomb.yBomb) || (food.xBanana >= snakeX - sizeImg / 2 && food.xBanana <= snakeX + sizeImg / 2 && food.yBanana >= snakeY - sizeImg / 2 && food.yBanana <= snakeY + sizeImg / 2));
        ctx.drawImage(food.drawBanana(), food.xBanana, food.yBanana);
    }
    else if (snake.collision(bomb.xBomb, bomb.yBomb, snakeX, snakeY) === true) {
        score--;
        soundOfBomb.play();
        do {
            bomb.xBomb = randomDiap(2, 22) * boxX;
            bomb.yBomb = randomDiap(2, 21) * boxY;
        } while ((bomb.xBomb === food.xApple && bomb.yBomb === food.yApple) || (bomb.xBomb === food.xBanana && bomb.yBomb === food.yBanana) || (bomb.xBomb >= snakeX - sizeImg && bomb.xBomb <= snakeX + sizeImg && bomb.yBomb >= snakeY - sizeImg && bomb.yBomb <= snakeY + sizeImg));
        if (snake.head.length > 1) {
            snake.head.splice(snake.head.length - 2, 2);
        } else {
            // stateOfGame  = 'game over';
            // alert('game over');
            clearInterval(timer);
        }
    }
    else {
        snake.head.pop();
    }

    //столкновение с основными стенами
    if (snakeX < boxX * 1.5 || snakeX > boxX * 23.5 || snakeY < boxY * 2.5 || snakeY > boxY * 23.5) {
        // alert('game over');
        clearInterval(timer);
    }

    if (direction == 'left') { snakeX -= boxX / 2 };
    if (direction == 'right') { snakeX += boxX / 2 };
    if (direction == 'up') { snakeY -= boxY / 2 };
    if (direction == 'down') { snakeY += boxY / 2 };

    let newHead = {
        x: snakeX,
        y: snakeY,
    }

    eatTail(newHead, snake.head);
    snake.head.unshift(newHead);
}

let timer = setInterval(drawGame, 80);

window.onload = function () {
    document.body.classList.add('loaded_hiding');
    window.setTimeout(function () {
        document.body.classList.add('loaded');
        document.body.classList.remove('loaded_hiding');
    }, 2000);
}