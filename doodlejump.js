//board
let board;
let boardWidth = 360;
let boardHeight = 576;
let context;

let jumpSound = new Audio("./jump.mp3");

let startPopup, restartPopup, startBtn, restartBtn;
let gameRunning = false;

//doodler
let doodlerWidth = 46;
let doodlerHeight = 46;
let doodlerX = boardWidth/2 - doodlerWidth/2;
let doodlerY = boardHeight*7/8 - doodlerHeight;
let doodlerRightImg;
let doodlerLeftImg;

let doodler = {
    img : null,
    x : doodlerX,
    y : doodlerY,
    width : doodlerWidth,
    height : doodlerHeight
}

//movement
let velocityX = 0;
let velocityY = 0;
let initialVelocityY = -8;
let gravity = 0.4;

//platforms
let platformArray = [];
let platformWidth = 60;
let platformHeight = 18;
let platformImg;

let score = 0;
let maxScore = 0;
let gameOver = false;

window.onload = function(){
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d");


    startPopup = document.getElementById("startPopup");
    restartPopup = document.getElementById("restartPopup");
    startBtn = document.getElementById("startBtn");
    restartBtn = document.getElementById("restartBtn");

    startPopup.style.display = "block"; 

    startBtn.onclick = startGame;
    restartBtn.onclick = restartGame;


    doodlerLeftImg = new Image();
    doodlerLeftImg.src = "./doodler-left.png";
    doodler.img = doodlerLeftImg;

    doodlerRightImg = new Image();
    doodlerRightImg.src = "./doodler-right.png";

    platformImg = new Image();
    platformImg.src = "./platform.png";

    document.addEventListener("keydown", moveDoodler);


    doodlerLeftImg.onload = () => {
        context.drawImage(doodler.img, doodler.x, doodler.y, doodler.width, doodler.height);
    };

    requestAnimationFrame(update);
};

function startGame() {
    startPopup.style.display = "none";

    score = 0;
    maxScore = 0;
    gameOver = false;

    velocityY = initialVelocityY;
    placePlatforms();
    gameRunning = true;
}

function restartGame() {
    restartPopup.style.display = "none";

    doodler = {
        img: doodlerRightImg,
        x: doodlerX,
        y: doodlerY,
        width: doodlerWidth,
        height: doodlerHeight
    };

    velocityX = 0;
    velocityY = initialVelocityY;

    score = 0;
    maxScore = 0;
    gameOver = false;

    placePlatforms();
    gameRunning = true;
}

function update() {
    requestAnimationFrame(update);

    if (!gameRunning) return;
    if (gameOver) return;

    context.clearRect(0, 0, board.width, board.height);


    doodler.x += velocityX;
    if(doodler.x > boardWidth) doodler.x = 0;
    if(doodler.x + doodler.width < 0) doodler.x = boardWidth;

    velocityY += gravity;
    doodler.y += velocityY;


    if(doodler.y > board.height){
        gameOver = true;
        gameRunning = false;

        document.getElementById("finalScore").textContent = "Score: " + score;
        restartPopup.style.display = "block";
    }

    context.drawImage(doodler.img, doodler.x, doodler.y, doodler.width, doodler.height);


    for(let platform of platformArray){
        if(velocityY < 0 && doodler.y < boardHeight * 3/4){
            platform.y -= initialVelocityY;
        }


        if(detectCollision(doodler, platform) && velocityY >= 0){
            velocityY = initialVelocityY;

            jumpSound.currentTime = 0;
            jumpSound.play();
        }

        context.drawImage(platform.img, platform.x, platform.y, platform.width, platform.height);
    }


    while(platformArray.length > 0 && platformArray[0].y >= boardHeight){
        platformArray.shift();
        newPlatform();
    }

    updateScore();

    context.fillStyle = "black";
    context.font = "16px sans-serif";
    context.fillText(score, 5, 20);
}

function moveDoodler(e) {
    if(e.code == "ArrowRight" || e.code == "KeyD"){
        velocityX = 4;
        doodler.img = doodlerRightImg;
    }
    else if(e.code == "ArrowLeft" || e.code == "KeyA"){
        velocityX = -4;
        doodler.img = doodlerLeftImg;
    }
}

function placePlatforms(){
    platformArray = [];

    platformArray.push({
        img: platformImg,
        x: boardWidth/2,
        y: boardHeight - 50,
        width: platformWidth,
        height: platformHeight
    });

    for(let i = 0; i < 6; i++){
        let randomX = Math.floor(Math.random() * boardWidth * 3/4);
        platformArray.push({
            img: platformImg,
            x: randomX,
            y: boardHeight - 75*i - 150,
            width: platformWidth,
            height: platformHeight
        });
    }
}

function newPlatform() {
    let randomX = Math.floor(Math.random() * boardWidth * 3/4);
    platformArray.push({
        img: platformImg,
        x: randomX,
        y: -platformHeight,
        width: platformWidth,
        height: platformHeight
    });
}

function detectCollision(a, b){
    return a.x < b.x + b.width &&
           a.x + a.width > b.x &&
           a.y < b.y + b.height &&
           a.y + a.height > b.y;
}

function updateScore() {
    let points = Math.floor(50 * Math.random());
    if(velocityY < 0){
        maxScore += points;
        score = Math.max(score, maxScore);
    } else {
        maxScore -= points;
    }
}
