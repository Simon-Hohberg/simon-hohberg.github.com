
var registeredWindows = new Object();
var dragged = new Object();

function Window (id, bodyId, src, top, left, width, height, zIndex) {

  this.bodyId = bodyId;

  //create windows only once
  if (registeredWindows[id]) {
    return;
  }
  
  registeredWindows[id] = id;
  
  var windowDiv = document.createElement("div");
  document.getElementById(bodyId).appendChild(windowDiv);
  windowDiv.style.zIndex = zIndex;
  windowDiv.style.position = "absolute";
  windowDiv.style.top = top + "px";
  windowDiv.style.left = left + "px";
  windowDiv.style.fontFamily = "Monospace, Arial";
  windowDiv.style.fontSize = "16px";
  windowDiv.id = id;
  var frame = document.createElement("table");
  windowDiv.appendChild(frame);
  frame.cellPadding = "0px";
  frame.cellSpacing = "0px";
  frame.style.border = "solid 3px"; //this is important for the width of the window on the whole
  
  var row1 = document.createElement("tr");
  frame.appendChild(row1);
  var cell1 = document.createElement("td");
  row1.appendChild(cell1);
  cell1.width = (width - 20 - 5*3) + "px";
  cell1.style.backgroundColor = "black";
  cell1.onmousedown = function (event) {
    var mouse = getMousePos(event);
    dragged.object = this.parentNode.parentNode.parentNode;
    dragged.mouseLastX = mouse.x;
    dragged.mouseLastY = mouse.y;
  };
  
  function dropWindow (event) {
    dragged.object = null;
  };
  
  function moveWindow (event) {
    if (dragged.object) {
      var mouse = getMousePos(event);
      var left = parseInt(dragged.object.style.left);
      var top = parseInt(dragged.object.style.top);
      dragged.object.style.left = (left + mouse.x - dragged.mouseLastX) + "px";
      dragged.object.style.top = (top + mouse.y - dragged.mouseLastY) + "px";
      dragged.mouseLastX = mouse.x;
      dragged.mouseLastY = mouse.y;
    }
  };
  
  cell1.onmouseout = dropWindow;
  cell1.onmouseup = dropWindow;
  cell1.onmousemove = moveWindow;
  
  var cell2 = document.createElement("td");
  row1.appendChild(cell2);
  cell2.width = "20px";
  cell2.style.backgroundColor = "black";
  cell2.style.color = "white";
  cell2.style.textAlign = "center";
  cell2.style.verticalAlign = "middle";
  cell2.style.fontWeight = "bold";
  cell2.innerHTML = "X";
  cell2.onmouseover = function () {
    this.style.color = "red";
    this.style.cursor = "pointer";
  };
  cell2.onmouseout = function () {
    this.style.color = "white";
  };
  cell2.onclick = function (event) {
    var id = this.parentNode.parentNode.parentNode.id;
    registeredWindows[id] = null;
    document.getElementById(bodyId).removeChild(this.parentNode.parentNode.parentNode);
  };
  
  var row2 = document.createElement("tr");
  frame.appendChild(row2);
  var iframeCell = document.createElement("td");
  row2.appendChild(iframeCell);
  iframeCell.colSpan = 2;
  var iframe = document.createElement("iframe");
  iframeCell.appendChild(iframe);
  iframe.src = src;
  iframe.style.height = height + "px";
  iframe.style.width = (width - 5*3) + "px"; //five times the broder size of the table
  iframe.scrolling = "no";
  iframe.style.border = "none";
}

function getMousePos(event) {
  var mouse = new Object();
  if (event.pageX) {
    mouse.x = event.pageX;
    mouse.y = event.pageY;
  } else if (event.clientX) {
    mouse.x = event.clientX + (document.documentElement.scrollLeft ? document.documentElement.scrollLeft : document.body.scrollLeft);
    mouse.y = event.clientY + (document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop);
  }
  return mouse;
}
