'use strict'

export { score };
import StorageRecords from "./storage.js";

let AJAXStor = new StorageRecords('ZHYHALKA_RECORDS');
//КНОПКИ
let startGame = document.getElementById('startGame');//кнопка с главной страницы
startGame.addEventListener('touchstart', vibr(500));
let rulesButton = document.getElementById('rulesButton');
let recordsButton = document.getElementById('recordsButton');
let recordsButton2 = document.getElementById('recordsButton2');
let rulesCloseButton = document.getElementById('rulesClose'); //кнопка для закрытия страницы с правилами игры
let recordsCloseButton = document.getElementById('recordsClose'); //кнопка для закрытия страницы с таблицей рекордов
let backToMainPageButton = document.getElementById('backToMain');//кнопка выхода из игры и возврата на главную страницу
let buttonRemember = document.getElementById('REMEMBER'); //кнопка запомнить для страницы запроса имени игрока
let playMini = document.querySelector('.PLAY'); //кнопки для мини-меню
let pauseMini = document.querySelector('.PAUSE');
let soundMini = document.querySelector('.SOUND');
let playSide = document.querySelector('.play'); //кнопки верхнего меню для больших экранов
let pauseSide = document.querySelector('.pause');
let soundSide = document.querySelector('.sound');
//SVG
let sONSVGside = document.getElementById('sONside');
let sOFFSVGside = document.getElementById('sOFFside');
let soundONSVG = document.getElementById('sON');
let soundOFFSVG = document.getElementById('sOFF');
let playMiniSVG = document.getElementById('playMiniSVG');
let pauseMiniSVG = document.getElementById('pauseMiniSVG');
//СТРАНИЦЫ
let mainPage = document.getElementById('menu');//главная страница
let gamePage = document.getElementById('backgr');
let nameGamerPage = document.getElementById('nameGamer');//страница запроса имени игрока
let recordsPage = document.getElementById('records');//страница таблицы рекордов
let rulesPage = document.getElementById('rules');//страница правил игры
let additionalMenuPage = document.getElementById('additional-menu'); //страница дополнительного меню во время игровой паузы
//БЛОКИ
let thanks = document.getElementById('thanks');
let hiddenNameGamer = document.getElementById('hiddenNameGamer');

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
        canvas.width = windowW;
        canvas.height = windowH;
    }
}


let widthOfCan = canvas.width;
let heightOfCan = canvas.height;
let boxX = widthOfCan / 25;
let boxY = heightOfCan / 25;
let speedX = widthOfCan / 25;
let speedY = heightOfCan / 25;
let sizeImg = 32;
let score = 0;
let stateOfGame;
let musicOn = false;

const appleImg = new Image();
appleImg.src = 'images/apple.png';
const bananaImg = new Image();
bananaImg.src = 'images/banana.png';
const bombImg = new Image();
bombImg.src = 'images/bomb.png'

const soundOfGame = new Audio();
soundOfGame.src = '../sounds/forGame.mp3';
const soundOfFood = new Audio();
soundOfFood.src = 'sounds/soundOfFood.mp3';
const soundOfBomb = new Audio();
soundOfBomb.src = 'sounds/soundOfBomb.mp3';

//кнопки для мини-меню
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
        buttMini.style.outline = 'none';
        buttMini.style.background = 'transparent';
        if (buttMini === playMini) {
            buttMini.style.right = w / 2 + 'px';
        } else if (buttMini === pauseMini) {
            buttMini.style.right = w * 3 + 'px';
        } else if (buttMini === soundMini) {
            buttMini.style.right = w * 5.5 + 'px';
        }
    }
}

//позиционирование svg кнопок мини-меню
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
//кнопки верхнего меню для больших экранов
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
        buttSide.style.outline = 'none';
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

//СОСТОЯНИЕ ИГРЫ
function state() {
    if (stateOfGame === 0) {
        boxX = widthOfCan / 25;
        boxY = heightOfCan / 25;
        snake.head = [];
        snake.head[0] = {
            x: 5 * boxX,
            y: 5 * boxY,
        }
        score = 0;
    } else if (stateOfGame === 1) { //змейка может двигаться
        speedX = widthOfCan / 25;
        speedY = heightOfCan / 25;
    } else if (stateOfGame === 2) { //конец игры
        speedX = 0;
        speedY = 0;
    } else if (stateOfGame === 3) { //пауза в игре
        speedX = 0;
        speedY = 0;
    }
}
//УПРАВЛЕНИЕ НА КЛАВИАТУРЕ
let direction;
document.addEventListener('keydown', function (e) {
    stateOfGame = 1;
    state();
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


canvas.addEventListener("touchstart", function (e) {
    stateOfGame = 1;
    state();
    TouchStart(e);
});
canvas.addEventListener("touchmove", function (e) {
    stateOfGame = 1;
    state();
    TouchMove(e);
});
canvas.addEventListener("touchend", function (e) {
    stateOfGame = 1;
    state();
    TouchEnd(e);
});
canvas.addEventListener("touchcancel", function (e) {
    stateOfGame = 1;
    state();
    TouchEnd(e);
});

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
        vibr(300);
        do {
            bomb.xBomb = randomDiap(2, 22) * boxX;
            bomb.yBomb = randomDiap(2, 21) * boxY;
        } while ((bomb.xBomb === food.xApple && bomb.yBomb === food.yApple) || (bomb.xBomb === food.xBanana && bomb.yBomb === food.yBanana) || (bomb.xBomb >= snakeX - sizeImg && bomb.xBomb <= snakeX + sizeImg && bomb.yBomb >= snakeY - sizeImg && bomb.yBomb <= snakeY + sizeImg));
        if (snake.head.length > 1) {
            snake.head.splice(snake.head.length - 2, 2);
        } else {
            stateOfGame = 2;
            state();
            switchToState({ pagename: 'GAMEOVER' });
        }
    }
    else {
        snake.head.pop();
    }

    //столкновение с основными стенами
    if (snakeX < boxX * 1.5 || snakeX > boxX * 23.5 || snakeY < boxY * 2.5 || snakeY > boxY * 23.5) {
        stateOfGame = 2;
        state();
        switchToState({ pagename: 'GAMEOVER' });
    }


    if (direction == 'left' || direction == "Swipe Left") { snakeX -= speedX / 2 };
    if (direction == 'right' || direction == "Swipe Right") { snakeX += speedX / 2 };
    if (direction == 'up' || direction == "Swipe Up") { snakeY -= speedY / 2 };
    if (direction == 'down' || direction == "Swipe Down") { snakeY += speedY / 2 };

    let newHead = {
        x: snakeX,
        y: snakeY,
    }

    eatTail(newHead, snake.head);
    snake.head.unshift(newHead);
}
//если змейка сталкивается с собственным телом
function eatTail(head, body) {
    for (let elem of body) {
        if (head.x == elem.x && head.y == elem.y) {
            vibr(500);
            stateOfGame = 2;
            state();
            switchToState({ pagename: 'GAMEOVER' });
        }
    }
}

let timer = setInterval(drawGame, 80);

// SPA
window.onhashchange = switchToStateFromURLHash;

let SPAState = {};

function switchToStateFromURLHash() {
    let URLHash = window.location.hash;
    var stateStr = URLHash.substr(1);

    if (stateStr != "") {
        var parts = stateStr.split("_")
        SPAState = { pagename: parts[0] };
    } else {
        SPAState = { pagename: 'MAIN' };
    }

    switch (SPAState.pagename) {
        case 'MAIN':
            mainPage.style.display = 'flex';
            gamePage.style.display = 'none';
            rulesPage.style.opacity = '0';
            rulesPage.style.top = '-105vh';
            recordsPage.style.opacity = '0';
            recordsPage.style.top = '-105vh';
            additionalMenuPage.style.opacity = '0';
            additionalMenuPage.style.left = '-105vw';
            break;
        case 'GAME':
            mainPage.style.display = 'none';
            gamePage.style.display = 'block';
            break;
        case 'RULES':
            mainPage.style.display = 'flex';
            gamePage.style.display = 'none';
            recordsPage.style.opacity = '0';
            recordsPage.style.top = '-105vh';
            rulesPage.style.opacity = '1';
            rulesPage.style.top = '0';
            break;
        case 'RECORDS':
            mainPage.style.display = 'flex';
            gamePage.style.display = 'block';
            rulesPage.style.opacity = '0';
            rulesPage.style.top = '-105vh';
            recordsPage.style.opacity = '1';
            recordsPage.style.top = '0';
            nameGamerPage.style.opacity = '0';
            nameGamerPage.style.top = '-105vh';
            hiddenNameGamer.style.display = 'block';
            thanks.style.display = 'none';
            AJAXStor.getInfo();
            break;
        case 'PAUSE':
            mainPage.style.display = 'none';
            gamePage.style.display = 'block';
            additionalMenuPage.style.opacity = '1';
            additionalMenuPage.style.left = '0';
            break;
        case 'CONTINUE':
            gamePage.style.display = 'block';
            additionalMenuPage.style.opacity = '0';
            additionalMenuPage.style.left = '-105vw';
            break;
        case 'GAMEOVER':
            gamePage.style.display = 'block';
            nameGamerPage.style.top = '0';
            nameGamerPage.style.opacity = '1';
            hiddenNameGamer.style.display = 'block';
            thanks.style.display = 'none';
            soundOfGame.pause();
            musicOn = false;
            break;
    }
}


function switchToState(newState) {
    var stateStr = newState.pagename;
    location.hash = stateStr;
}

startGame.onclick = function () {
    switchToState({ pagename: 'GAME' });
    stateOfGame = 0;
    state();
    soundOfGame.play();
    soundOfGame.currentTime = 0;
    musicOn = true;
}

rulesButton.onclick = function () {
    switchToState({ pagename: 'RULES' });
}
rulesCloseButton.onclick = function () {
    switchToState({ pagename: 'MAIN' });
}

recordsButton.onclick = function () {
    switchToState({ pagename: 'RECORDS' });
}
recordsCloseButton.onclick = function () {
    switchToState({ pagename: 'MAIN' });
}

backToMainPageButton.onclick = function () {
    switchToState({ pagename: 'MAIN' });
    stateOfGame = 2;
    state();
    soundOfGame.pause();
    musicOn = false;
}

pauseSide.onclick = function () {
    switchToState({ pagename: 'PAUSE' });
    stateOfGame = 3;
    state();
}

playSide.onclick = function () {
    switchToState({ pagename: 'CONTINUE' });
}

soundSide.onclick = function () {
    if (musicOn) {
        soundOfGame.pause();
        musicOn = false;
        sONSVGside.style.opacity = '0';
        sOFFSVGside.style.opacity = '1';
    } else {
        soundOfGame.currentTime = 0;
        soundOfGame.play();
        musicOn = true;
        sONSVGside.style.opacity = '1';
        sOFFSVGside.style.opacity = '0';
    }
}

pauseMini.onclick = function () {
    switchToState({ pagename: 'PAUSE' })
}

playMini.onclick = function () {
    switchToState({ pagename: 'CONTINUE' });
}
soundMini.onclick = function () {
    if (musicOn) {
        soundOfGame.pause();
        musicOn = false;
        soundONSVG.style.opacity = '0';
        soundOFFSVG.style.opacity = '1';
    } else {
        soundOfGame.currentTime = 0;
        soundOfGame.play();
        musicOn = true;
        soundONSVG.style.opacity = '1';
        soundOFFSVG.style.opacity = '0';
    }
}
buttonRemember.onclick = function () {
    let bestName = document.getElementById('NAME').value;
    AJAXStor.updateStorage(bestName, score);
    hiddenNameGamer.style.display = 'none';
    thanks.style.display = 'block';
}
recordsButton2.onclick = function () {
    document.getElementById('NAME').value = '';
    stateOfGame = 0;
    state();
    switchToState({ pagename: 'RECORDS' });
}

switchToStateFromURLHash();

//ПРЕДУПРЕЖДЕНИЕ ПРИ ПОКИДАНИИ САЙТА
window.onbeforeunload = exit;

function exit(e) {
    if (stateOfGame === 1 || stateOfGame === 3)
        e.returnValue = 'А у вас есть несохранённые изменения!';
};

//ДОПОЛНИТЕЛЬНЫЕ ФУНКЦИИ
function vibr(s) {
    navigator.vibrate(s);
}
function randomDiap(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}