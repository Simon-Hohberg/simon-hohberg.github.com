var running = false;
var canvas;
var ballX = 200;
var ballY = 150;
var speedX = 10;
var speedY = Math.round(2 + Math.random()*5);
var radius = 8;
var playerYold = 150;
var playerY = 150;
var pcY = 150;
var batWidth = 10;
var batHeight = 80;
var score = 0;
var mouseX, mouseY;
var streak = 0;
var turn = 0;
var startButton;
var countdown = 3;
var countdownDiv;
var optionsDiv;
var upgradesDiv;
var upgrades;

function getMousePosition(event) {      
  var context = canvas.getContext("2d");
  if (event.offsetY) {
    mouseX = event.offsetX;
    mouseY = event.offsetY;
  } else if (event.layerY) {
    mouseX = event.layerX;
    mouseY = event.layerY;
  }
  
  playerYold = playerY;
  playerY = mouseY;      
}

function animate() {
  var context = canvas.getContext("2d");
  ballX += speedX;
  ballY += speedY;
  var speed = Math.sqrt(speedX * speedX + speedY * speedY);
  var playerBatSpeed = playerY - playerYold;
  
  //border collision
  
  //left
  if (ballX - radius <= 0) {
    speedX = -speedX;
    ballX = 0 + radius;
    score = score > 0 ? score - 1 : 0;
    streak = streak > 0 ? -1 : streak - 1;
    document.getElementById("humanScore").innerHTML = score;
    turn++;
    startButton.style.visibility = "visible";
    canvas.style.cursor = "default";
    return;
  }
  
  //right
  if (ballX + radius >= 400) {
    speedX = -speedX;
    ballX = 400 - radius;
    score++;
    streak = streak < 0 ? 1 : streak + 1;
    document.getElementById("humanScore").innerHTML = score;
    turn++;
    startButton.style.visibility = "visible";
    canvas.style.cursor = "default";
    return;
  }
  
  //top
  if (ballY - radius <= 0) {
    speedY = -speedY;
    ballY = 0 + radius;
  }
  
  //bottom
  if (ballY + radius >= 300) {
    speedY = -speedY;
    ballY = 300 - radius;
  }
  
  if (ballY > pcY) {
    if (ballY >= pcY + turn + 4) {
      pcY += turn + 4;
    } else {
      pcY = ballY;
    }
  } else {
    if (ballY <= pcY - (turn + 4)) {
      pcY -= (turn + 4);
    } else {
      pcY = ballY;
    }
  }
  
  context.clearRect(0,0,400,300);
  context.fillStyle = "rgb(0, 0, 0)";
  
  //move bats
  if (playerY - batHeight/2 <= 0) {
    context.fillRect(40 - batWidth, 0, batWidth, batHeight);
  } else if (playerY + batHeight/2 >= 300) {
    context.fillRect(40 - batWidth, 300 - batHeight, batWidth, batHeight);
  } else {
    context.fillRect(40 - batWidth, playerY - batHeight/2, batWidth, batHeight);
  }
  
  if (pcY - batHeight/2 <= 0) {
    context.fillRect(360, 0, batWidth, batHeight);
  } else if (pcY + batHeight/2 >= 300) {
    context.fillRect(360, 300 - batHeight, batWidth, batHeight);
  } else {
    context.fillRect(360, pcY - batHeight/2, batWidth, batHeight);
  }
  
  //collision with bats
  if (ballX + radius >= 360 && ballY + radius >= pcY - batHeight/2 && ballY <= pcY + batHeight/2) {
    speedX = -speedX;
    ballX = 360 - radius;
  }
  
  if (ballX - radius <= 40 && ballY + radius >= playerY - batHeight/2 && ballY <= playerY + batHeight/2) {
    speedX = -speedX;
    speedY += playerBatSpeed;
    ballX = 40 + radius;
  } 
  
  context.beginPath();
  context.arc(ballX, ballY, radius, 0, Math.PI*2, true);
  context.fill();
  
  setTimeout(animate, 50);
}

function reset() {
  var context = canvas.getContext("2d");
  context.clearRect(0,0,400,300);
  ballX = 200;
  ballY = 150;
  speedX = 10 + turn;
  speedY = Math.round(2 + Math.random()*7);
  radius = 8;
  playerY = 150;
  playerYold = 150;
  pcY = 150;
  context.fillStyle = "rgb(0, 0, 0)";
  context.fillRect( 40 - batWidth, 110, batWidth, batHeight);
  context.fillRect(360, 110, batWidth, batHeight);
  context.beginPath();
  context.arc(ballX, ballY, radius, 0, Math.PI*2, true);
  context.fill();
}

function setCountdown() {
  if (countdown == 0) {
    countdown = 3;
    countdownDiv.style.visibility = "hidden";
    setTimeout(animate, 50);
  } else {
    countdownDiv.style.visibility = "visible";
    countdownDiv.innerHTML = countdown;
    countdown--;
    setTimeout(setCountdown, 1000);
  }
}

function init(canvasId, bodyId) {
  canvas = document.getElementById(canvasId);
  canvas.onmousemove = getMousePosition;
  if (canvas.getContext) {
    var context = canvas.getContext("2d");
    context.fillStyle = "rgb(0, 0, 0)";
    context.fillRect( 40 - batWidth, 110, batWidth, batHeight);
    context.fillRect(360, 110, batWidth, batHeight);
    context.beginPath();
    context.arc(ballX, ballY, radius, 0, Math.PI*2, true);
    context.fill();
    
    optionsDiv = document.createElement("div");
    document.getElementById(bodyId).appendChild(optionsDiv);
    optionsDiv.className = "overlayDiv";
    
    countdownDiv = document.createElement("div");
    document.getElementById(bodyId).appendChild(countdownDiv);
    countdownDiv.style.color = "black";
    countdownDiv.style.fontSize = "80px";
    countdownDiv.style.fontWeight = "bold";
    countdownDiv.style.fontFamily = "Monospace, Arial";
    countdownDiv.style.position = "absolute";
    countdownDiv.style.left = "190px";
    countdownDiv.style.top = "90px";
    countdownDiv.style.zIndex = 2;
    
    startButton = document.createElement("div");
    document.getElementById(bodyId).appendChild(startButton);
    startButton.className = "button";
    startButton.innerHTML = "Start";
    startButton.style.position = "absolute";
    startButton.style.left = "165px";
    startButton.style.top = "250px";
    startButton.style.width = "80px";
    startButton.style.zIndex = 2;
    startButton.onmouseover = function (event) {
      this.style.color = "white";
      this.style.backgroundColor = "black";
    }
    startButton.onmouseout = function (event) {
      this.style.color = "black";
      this.style.backgroundColor = "white";
    }
    startButton.onclick = function (event) {
      reset();
      this.style.visibility = "hidden";
      canvas.style.cursor = "none";
      setCountdown();
    }
  }
}

function showOptions() {
  if (optionsDiv.style.visibility == "hidden") {
    optionsDiv.style.visibility = "visible";
  } else {
    optionsDiv.style.visibility = "hidden";
  }
}
