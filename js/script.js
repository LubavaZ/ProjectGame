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
        container.style.width = '100%';
        container.style.height = 'unset';
        container.style.position = 'unset';
        container.style.margin = 0;
        canvas.style.transform = 'none';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.width = windowW;
        canvas.height = windowH;
    }
}

let startGame = document.getElementById('startGame');

startGame.addEventListener('touchstart', vibr(1000));
startGame.addEventListener('click', (e) => {

    let orient = window.screen.orientation;
    let mainPage = document.querySelector('.menu');
    let turn = document.getElementById('turnScreen');

    function fullScreen(element) {
        if (element.requestFullscreen) {
            element.requestFullscreen();
        } else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
        } else if (element.webkitRequestFullScreen) {
            element.webkitRequestFullScreen();
        }
    }

    if (/Android|webOS|iPhone|iPad|iPod|IEMobile|Windows Phone|Opera Mini/i.test(navigator.userAgent)) {


        if (orient.type === 'portrait-primary') {
            turn.style.display = 'flex';
        }

        if (orient.type === 'landscape-primary') {
            turn.style.display = 'none';
            mainPage.style.display = 'none';
            canvas.style.width = '100%';
            canvas.style.height = '100%';
            canvas.width = windowW;
            canvas.height = windowH;

            fullScreen(canvas);
        }
        window.addEventListener('orientationchange', () => {
            if (orient.type === 'landscape-primary') {
                turn.style.display = 'none';
                mainPage.style.display = 'none';
                canvas.style.width = '100%';
                canvas.style.height = '100%';
                canvas.width = windowW;
                canvas.height = windowH;

                fullScreen(canvas);

            }
            else if (orient.type === 'portrait-primary') {
                canvas.style.width = '100%';
                canvas.style.height = '100%';
                canvas.width = windowW;
                canvas.height = windowH;
            }
        });
    }
});

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

const soundOfGame = new Audio();
soundOfGame.src = '../sounds/forGame.mp3';
// soundOfGame.play();
const soundOfFood = new Audio();
soundOfFood.src = 'sounds/soundOfFood.mp3';
const soundOfBomb = new Audio();
soundOfBomb.src = 'sounds/soundOfBomb.mp3';

//кнопки для мини-меню
let playMini = document.querySelector('.PLAY');
let pauseMini = document.querySelector('.PAUSE');
let soundMini = document.querySelector('.SOUND');

placeMini(playMini, boxX, boxY);
placeMini(pauseMini, boxX, boxY);
placeMini(soundMini, boxX, boxY);

function placeMini(buttMini, w, h) {
    if (windowW >= 970) {
        buttMini.style.display = 'none';
    } else {
        buttMini.style.display = 'block';
        buttMini.style.position = 'absolute';
        buttMini.style.width = w * 2 + 'px';
        buttMini.style.height = h * 2 + 'px';
        buttMini.style.top = 0;
        buttMini.style.border = 'none';
        buttMini.style.background = 'transparent';
        if (buttMini === playMini) {
            buttMini.style.right = w / 2 + 'px';
        } else if (buttMini === pauseMini) {
            buttMini.style.right = w * 2.5 + 'px';
        } else if (buttMini === soundMini) {
            buttMini.style.right = w * 4.5 + 'px';
        }
    }
}

//позиционирование svg кнопок мини-меню
let soundONSVG = document.getElementById('sON');
let soundOFFSVG = document.getElementById('sOFF');
let playMiniSVG = document.getElementById('playMiniSVG');
let pauseMiniSVG = document.getElementById('pauseMiniSVG');

sizeSVG(soundONSVG);
sizeSVG(soundOFFSVG);
sizeSVG(playMiniSVG);
sizeSVG(pauseMiniSVG);

function sizeSVG(elem) {
    elem.style.width = boxX * 2;
    elem.style.height = boxY * 2;
    elem.style.position = 'absolute';
    elem.style.top = 0;
    elem.style.left = 0;
}
//кнопки бокового меню для больших экранов
let playSide = document.querySelector('.play');
let pauseSide = document.querySelector('.pause');
let soundSide = document.querySelector('.sound');
let shift = 7;

placeSide(playSide, shift);
placeSide(pauseSide, shift);
placeSide(soundSide, shift);

function placeSide(buttSide, s) {
    if (windowW < 970) {
        buttSide.style.display = 'none';
    } else {
        buttSide.style.display = 'block';
        buttSide.style.position = 'absolute';
        buttSide.style.width = s + 'vw';
        buttSide.style.height = s + 'vw';
        buttSide.style.top = '0.5vw';
        buttSide.style.border = 'none';
        buttSide.style.background = 'transparent';
        if (buttSide === playSide) {
            buttSide.style.left = s * 4.7 + 'vw';
        } else if (buttSide === pauseSide) {
            buttSide.style.left = s * 6.7 + 'vw';
        } else if (buttSide === soundSide) {
            buttSide.style.left = s * 8.7 + 'vw';
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
    ctx.lineWidth = boxY;
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

//УПРАВЛЕНИЕ ЖЕСТАМИ НА ТАЧСКРИНЕ
let touchStart = null;
let touchPosition = null;
const sensitivity = 10;


canvas.addEventListener("touchstart", function (e) { TouchStart(e); });
canvas.addEventListener("touchmove", function (e) { TouchMove(e); });
canvas.addEventListener("touchend", function (e) { TouchEnd(e); });
canvas.addEventListener("touchcancel", function (e) { TouchEnd(e); });

function TouchStart(e) {
    //Получаем текущую позицию касания
    touchStart = {
        x: e.changedTouches[0].clientX,
        y: e.changedTouches[0].clientY,
    };
    touchPosition = {
        x: touchStart.x,
        y: touchStart.y,
    };
}

function TouchMove(e) {
    //Получаем новую позицию
    touchPosition = {
        x: e.changedTouches[0].clientX,
        y: e.changedTouches[0].clientY,
    };
}

function TouchEnd(e) {
    CheckAction();
    touchStart = null;
    touchPosition = null;
}

function CheckAction() {
    var d = //Получаем расстояния от начальной до конечной точек по обеим осям
    {
        x: touchStart.x - touchPosition.x,
        y: touchStart.y - touchPosition.y,
    };


    if (Math.abs(d.x) > Math.abs(d.y)) //Проверяем, движение по какой оси было длиннее
    {
        if (Math.abs(d.x) > sensitivity) //Проверяем, было ли движение достаточно длинным
        {
            if (d.x > 0 && direction !== "Swipe Right") //Если значение больше нуля, значит пользователь двигал пальцем справа налево
            {
                direction = "Swipe Left";
            }
            else if (d.x < 0 && direction !== "Swipe Left") //Иначе он двигал им слева направо
            {
                direction = "Swipe Right";
            }
        }
    }
    else //Аналогичные проверки для вертикальной оси
    {
        if (Math.abs(d.y) > sensitivity) {
            if (d.y > 0 && direction !== "Swipe Down") //Свайп вверх
            {
                direction = "Swipe Up";
            }
            else if (d.y < 0 && direction !== "Swipe Up") //Свайп вниз
            {
                direction = "Swipe Down";
            }
        }
    }
}

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
        vibr(1000);
        clearInterval(timer);
    }


    if (direction == 'left' || direction == "Swipe Left") { snakeX -= boxX / 2 };
    if (direction == 'right' || direction == "Swipe Right") { snakeX += boxX / 2 };
    if (direction == 'up' || direction == "Swipe Up") { snakeY -= boxY / 2 };
    if (direction == 'down' || direction == "Swipe Down") { snakeY += boxY / 2 };

    let newHead = {
        x: snakeX,
        y: snakeY,
    }

    eatTail(newHead, snake.head);
    snake.head.unshift(newHead);
}

function vibr(s) {
    navigator.vibrate(s);
}

let timer = setInterval(drawGame, 80);

window.onload = function () {
    document.body.classList.add('loaded_hiding');
    window.setTimeout(function () {
        document.body.classList.add('loaded');
        document.body.classList.remove('loaded_hiding');
    }, 2000);
}