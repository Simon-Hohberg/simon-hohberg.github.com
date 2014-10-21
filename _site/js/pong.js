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
var width;
var height;
var options = new Object();

function getMousePosition(event) {
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
  if (ballX + radius >= width) {
    speedX = -speedX;
    ballX = width - radius;
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
  if (ballY + radius >= height) {
    speedY = -speedY;
    ballY = height - radius;
  }
  
  //four is the basic movement speed of the pc
  if (ballY > pcY) {
    if (ballY >= pcY + score/2 + 4) {
      pcY += score/2 + 4;
    } else {
      pcY = ballY;
    }
  } else {
    if (ballY <= pcY - (score/2 + 4)) {
      pcY -= (score/2 + 4);
    } else {
      pcY = ballY;
    }
  }
  
  context.clearRect(0, 0, width, height);
  context.fillStyle = "rgb(0, 0, 0)";
  
  //move bats
  if (playerY - batHeight/2 <= 0) {
    context.fillRect(20, 0, batWidth, batHeight);
  } else if (playerY + batHeight/2 >= height) {
    context.fillRect(20, height - batHeight, batWidth, batHeight);
  } else {
    context.fillRect(20, playerY - batHeight/2, batWidth, batHeight);
  }
  
  if (pcY - batHeight/2 <= 0) {
    context.fillRect(width - 20 - batWidth, 0, batWidth, batHeight);
  } else if (pcY + batHeight/2 >= height) {
    context.fillRect(width - 20 - batWidth, height - batHeight, batWidth, batHeight);
  } else {
    context.fillRect(width - 20 - batWidth, pcY - batHeight/2, batWidth, batHeight);
  }
  
  //collision with bats
  if (ballX + radius >= width - 20 - batWidth && ballY + radius >= pcY - batHeight/2 && ballY <= pcY + batHeight/2) {
    speedX = -speedX;
    ballX = width - 20 - batWidth - radius;
  }
  
  if (ballX - radius <= 20 + batWidth && ballY + radius >= playerY - batHeight/2 && ballY <= playerY + batHeight/2) {
    speedX = -speedX;
    speedY += playerBatSpeed;
    ballX = 20 + batWidth + radius;
  } 
  
  context.beginPath();
  context.arc(ballX, ballY, radius, 0, Math.PI*2, true);
  context.fill();
  
  setTimeout(animate, 50);
}

function reset() {
  var context = canvas.getContext("2d");
  context.clearRect(0, 0, width, height);
  ballX = width/2 - radius;
  ballY = height/2 - radius;
  speedX = 10 + turn;
  speedY = Math.round(2 + Math.random()*7);
  playerY = height/2;
  playerYold = height/2;
  pcY = height/2;
  context.fillStyle = "rgb(0, 0, 0)";
  context.fillRect(20, height/2 - batHeight/2, batWidth, batHeight);
  context.fillRect(width - batWidth - 20, height/2 - batHeight/2, batWidth, batHeight);
  context.beginPath();
  context.arc(width/2, height/2, radius, 0, Math.PI*2, true);
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

function createOptions(bodyId, width, height) {
  var optionsDiv = document.createElement("div");
  document.getElementById(bodyId).appendChild(optionsDiv);
  optionsDiv.id = "optionsDiv";
  optionsDiv.className = "overlayDiv";
  optionsDiv.style.visibility = "hidden";
  optionsDiv.style.position = "absolute";
  optionsDiv.style.width = (width - 10) + "px";
  optionsDiv.style.height = (height - 10) + "px";
  optionsDiv.style.top = 35 + "px";
  optionsDiv.style.left = 9 + "px";
  optionsDiv.style.zIndex = 3;
  
  var form = document.createElement("form");
  optionsDiv.appendChild(form);
  form.name = "options";
  form.className = "normalText";
  form.style.position = "absolute";
  form.style.left = 10 + "px";
  form.style.top = 10 + "px";
  
  form.innerHTML = "<input type='checkbox' id='countdownOption'/> Disable countdown before start<br />";
}

function init(canvasId, bodyId) {
  canvas = document.getElementById(canvasId);
  width = parseInt(pongWindow.width) - 5*3 - 8;
  height = parseInt(pongWindow.height) - 3*3 - 23;
  canvas.width = width;
  canvas.height = height;
  
  canvas.onmousemove = getMousePosition;
  if (canvas.getContext) {
    var context = canvas.getContext("2d");
    context.fillStyle = "rgb(0, 0, 0)";
    context.fillRect(20, height/2 - batHeight/2, batWidth, batHeight);
    context.fillRect(width - batWidth - 20, height/2 - batHeight/2, batWidth, batHeight);
    context.beginPath();
    context.arc(width/2, height/2, radius, 0, Math.PI*2, true);
    context.fill();
    
    createOptions(bodyId, width, height);
    
    countdownDiv = document.createElement("div");
    document.getElementById(bodyId).appendChild(countdownDiv);
    countdownDiv.style.color = "black";
    countdownDiv.style.fontSize = "80px";
    countdownDiv.style.align = "center";
    countdownDiv.style.fontWeight = "bold";
    countdownDiv.style.fontFamily = "Monospace, Courier New";
    countdownDiv.style.position = "absolute";
    countdownDiv.style.width = 80 + "px";
    countdownDiv.style.left = 168 + "px";
    countdownDiv.style.top = 80 + "px";
    countdownDiv.style.zIndex = 2;
    
    var buttonWidth = 100;
    startButton = document.createElement("div");
    document.getElementById(bodyId).appendChild(startButton);
    startButton.className = "button";
    startButton.innerHTML = "Start";
    startButton.style.position = "absolute";
    startButton.style.left = (width/2 - buttonWidth/2) + "px";
    startButton.style.top = "250px";
    startButton.style.width = buttonWidth + "px";
    startButton.style.zIndex = 2;
    startButton.onmouseover = function (event) {
      this.style.color = "white";
      this.style.backgroundColor = "black";
    };
    startButton.onmouseout = function (event) {
      this.style.color = "black";
      this.style.backgroundColor = "white";
    };
    startButton.onclick = function (event) {
      reset();
      this.style.visibility = "hidden";
      canvas.style.cursor = "none";
      if (!document.options.elements[0].checked) {
        setCountdown();
      } else {
        setTimeout(animate, 50);
      }
    };
  }
}

function toggleDivVisibility(divId) {
  var div = document.getElementById(divId);
  if (div.style.visibility == "hidden") {
    div.style.visibility = "visible";
  } else {
    div.style.visibility = "hidden";
  }
}
