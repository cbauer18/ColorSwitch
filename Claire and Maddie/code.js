/*
==============
Final Breakout
==============
Objective:
-Survive
Character:
-Tim
Challenge
-The Squares
*/

//initial functionality for interacintg with html canvas tag
var painter = document.getElementById("c").getContext("2d");
//inlines score to the previous p element
document.getElementById("inline").style.display = "inline";
document.getElementById("score").style.display = "inline";
//event listener for user input
document.addEventListener('keydown', getKeyAndMove);

//set paramaters for Tim's characteristics
var TimSize = 10;
var TimX = 50;
var TimY = 100;
var TimSpeed = 2;
//parameters for the squares
var squareSize = 20;
var gap = 17;
//parameters for the powerups
var powerUpSize = 15;
powerUpScorePos = [];
powerUpSpeedPos = [];
//creates other misc var
var score = 0;
var scoreCounter = 0;
var scoreRate = 10;
var powerUpCounter = 0;
var powerUpRate = 150;
var squareSlowEffect = 0;
//dailogue related variables
var messageExpiration = 500;

//generate an array of square positions
squares = [];
var index = 0;
for (var i = 0; i < 13; ++i) {
    for( var j = 0; j < 13; ++j) {
        if ( i == j || i + j == 12) {
            squares[index] = [gap + i*squareSize, gap + j*squareSize];
            ++index;
        }
    }
}

//sets tick rate for game updates and starts interval
const gameInterval = setInterval (updateGame, 20);

//updates game and its functions
function updateGame() {
    updateSquares();
    drawBackground();
    drawPowerUps();
    drawTim();
    drawSquares();
    checkActions();
    counters();
    messaging();
    if(score >= 1000){
        gameEnd(1);
    }
}

//Draws tim and places him at initial pos according to variables created at the top
function drawTim () {
    painter.fillStyle = "#00FF00";
    painter.fillRect(TimX, TimY, TimSize, TimSize);
}

//Game background
function drawBackground(){
    painter.fillStyle = "#000000"
    painter.fillRect (0, 0, 290, 290)
}

//user input functionallity changes tim's position parameter
function getKeyAndMove(e) {
    var key_code = e.key;
    switch (key_code) {
        case 'ArrowLeft': //left arrow key
            TimX -= TimSpeed;
            break;
        case 'ArrowUp': //Up arrow key
            TimY += -TimSpeed;
            break;
        case 'ArrowRight': //right arrow key
            TimX += TimSpeed;
            break;
        case 'ArrowDown': //down arrow key
            TimY -= -TimSpeed;
            break;
    }
}

//moves squares
function updateSquares() {
    for (var i = 0; i < squares.length; ++i){
        var squarePos = squares[i];
        var cx = 137;
        var cy = 137;
        var px = squarePos[0];
        var py = squarePos[1];
        a = 0.003 + (score * .00003) - squareSlowEffect;
        squarePos[0] = (px - cx) * Math.cos(a) - (py - cy) * Math.sin(a) + cx;
        squarePos[1] = (py - cy) * Math.cos(a) + (px - cx) * Math.sin(a) + cy;
       
    }
}

//draws squares
function drawSquares() {
    painter.fillStyle = "#d36200";
    for (var i = 0; i < squares.length; ++i) {
        var squarePos = squares[i];
        painter.fillRect(squarePos[0], squarePos[1], squareSize, squareSize);
    }
}

//reusable function for detecting collision between 2 square-shaped sprites
function detectCollisions(x, y, h, w, colX, colY, colH, colW) {
    if(((x >= colX) || ((x + w) >= colX)) && ((x <= (colX + colW)) || ((x + w) <= (colX = colW)))){
        if(((y >= colY) || ((y + h) >= colY)) && ((y <= (colY + colH)) || ((y + h) <= (colY = colH)))){
            return true;
        }else{
            return false;
        }
    }else{
        return false;
    }
}

//sees if the tim is taking any actions and gives him consequences for those actions lol
function checkActions(){
    //check for score powerup action
    for(var i = 0; i < powerUpScorePos.length; i++){
        var powerUpScorePosCord = powerUpScorePos[i];
        if(detectCollisions(TimX, TimY, TimSize, TimSize, powerUpScorePosCord[0], powerUpScorePosCord[1], powerUpSize * 3, powerUpSize * 3)){
            powerUpScorePos.splice(i, 1);
            score += 50;
            squareSlowEffect += .001;
            if(scoreRate > 5){
                scoreRate--;
            }
        }
    }
    //check for speed powerup action
    for(var i = 0; i < powerUpSpeedPos.length; i++){
        var powerUpSpeedPosCord = powerUpSpeedPos[i];
        if(detectCollisions(TimX, TimY, TimSize, TimSize, powerUpSpeedPosCord[0], powerUpSpeedPosCord[1], powerUpSize, powerUpSize)){
            powerUpSpeedPos.splice(i, 1);
            TimSpeed++;
            score += 15;
        }
    }
    //check for crash action
    for(var i = 0; i < squares.length; i++){
        var squarePos = squares[i];
        if(detectCollisions(TimX, TimY, TimSize, TimSize, squarePos[0], squarePos[1], squareSize, squareSize)){
            gameEnd(0);
        }
    }
}

function placePowerUp(){
    var d2 = (Math.floor(Math.random() * 2));
    //place score power up
    if(d2 == 1){
        var index = powerUpSpeedPos.length;
        powerUpSpeedPos[index] = [Math.floor(Math.random() * (290 - powerUpSize)), Math.floor(Math.random() * (290 - powerUpSize))];
        var powerUpSpeedPosCord = powerUpSpeedPos[index];
        painter.fillStyle = "#3440EB";
        painter.fillRect(powerUpSpeedPosCord[0], powerUpSpeedPosCord[1], powerUpSize, powerUpSize);
    }
    if(d2 == 0){
        var index = powerUpScorePos.length;
        powerUpScorePos[index] = [Math.floor(Math.random() * (290 - (powerUpSize * 3))), Math.floor(Math.random() * (290 - (powerUpSize *3)))];
        var powerUpScorePosCord = powerUpScorePos[index];
        painter.fillStyle = "#34BAEB";
        painter.fillRect(powerUpScorePosCord[0], powerUpScorePosCord[1], (powerUpSize * 3), (powerUpSize * 3));
    }
    //place speed power up
}

//performs the final stuff for ending the game
function gameEnd(win){
    clearInterval(gameInterval);
    if(win == 1){
        document.getElementById("dialogue").innerHTML = "Good job, Tim! Everyone knows that evil squares don't bother chasing someone with 1000 score."
    }else{
        document.getElementById("dialogue").innerHTML = "Game Over!"
    }
}

function drawPowerUps(){
    for(var i = 0; i < powerUpScorePos.length; i++){
        var powerUpScorePosCord = powerUpScorePos[i];
        painter.fillStyle = "#34BAEB";
        painter.fillRect(powerUpScorePosCord[0], powerUpScorePosCord[1], powerUpSize * 3, powerUpSize * 3);
    }
    for(var i = 0; i < powerUpSpeedPos.length; i++){
        var powerUpSpeedPosCord = powerUpSpeedPos[i];
        painter.fillStyle = "#3440EB";
        painter.fillRect(powerUpSpeedPosCord[0], powerUpSpeedPosCord[1], powerUpSize, powerUpSize);
    }
}

function messaging(){
    if(messageExpiration > 0){
        messageExpiration--;
    }else{
        document.getElementById("dialogue").innerHTML = "Go, Tim! Go! You can do it!"
    }
    if(score > 80 && score < 90){
        messageExpiration = 500;
        document.getElementById("dialogue").innerHTML = "The friendly squares are power ups! Eat them for a boost to your speed and score!"
    }
    if(score > 500 && score < 550){
        messageExpiration = 500;
        document.getElementById("dialogue").innerHTML = "Don't give up, Tim! You're halfway there!"    
    }
    document.getElementById("score").innerHTML = score;
}

function counters(){
    if(scoreCounter >= scoreRate){
        score++;
        scoreCounter = 0;
    }
    scoreCounter++;
    if(powerUpCounter >= powerUpRate){
        powerUpRate += powerUpRate;
        powerUpCounter = 0;
        placePowerUp();
    }
    powerUpCounter++;
}