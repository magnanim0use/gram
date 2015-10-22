$(document).ready(function() {

//----------------------


//SETUP SOCKET
  var socket = io.connect('http://localhost:4200');

  var data;

  $('#imageView').on('dblclick', function(e) {
      var idCounter = idCounter++ || 1;
      data = new Container({
        id: idCounter,
        shape: null,
        color: null,
        width: 120,
        height: 30,
        radius: null,
        text: $('#textInput').val(),
        cenX: e.pageX,
        cenY: e.pageY,
        connectedTo: null,
        startedAt: new Date(),
      });
      socket.emit('createdObj', data);
  })

  socket.on('createObj', function(data) {
    shapes.push(data);
    rect(data.cenX, data.cenY, data.width, data.height, data.text);
  });
  

  socket.on('drawLine', function(data) {
    drawLine(data.startLineX, data.startLineY, data.endLineX, data.endLineY);
  });

  socket.on('updateMessages', function(data) {
      $('<div class="chatLog"><div class="userName">' + data.userName + '</div><p>       ' + data.message + '</p></div>').hide().prependTo('.chatBox').fadeIn(1000)
  })

//-----------------------
//setup HTML5 Canvas
  var lines = [];
  var shapes = [];
  var canvas;
  var ctx;
  var dragging;
  var width = 800;
  var height = 400;

  var x = 120;
  var y = 80;

  var colorScale = ['#99CCFF', '#99FF66', '#FF9933'];
  var colorNumber = colorNumber || 0;
  

  function rect (cenX, cenY, rectWidth, rectHeight, text) {
    ctx.beginPath();
    ctx.rect(cenX - 10, cenY - 120, rectWidth, rectHeight);
    ctx.strokeStyle = "black";
    ctx.lineWidth   = 2;
    ctx.stroke();
    ctx.closePath();
    ctx.fillStyle = colorScale[colorNumber];
    colorNumber++;
    if (colorNumber == colorScale.length) {colorNumber = 0;}
    ctx.fill();
    ctx.font = "14px Arial";
    ctx.fillStyle = 'black';
    ctx.fillText(text, cenX + 10, cenY -100);
  }

  function circle (cenX, cenY, radius, text) {
    ctx.beginPath();
    ctx.arc(cenX, cenY, radius, 0, 2 * Math.PI, false);
    ctx.fillStyle = colorScale[colorNumber];
    colorNumber++;
    if (colorNumber == colorScale.length) {colorNumber = 0;}
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'black';
    ctx.stroke();
  }

  function clear() {
    ctx.clearRect(0, 0, width, height);
  }

  function init() {
    canvas = document.getElementById('imageView');
    ctx = canvas.getContext('2d');
  }

  function draw(e) {
    return setInterval(function(){
      ctx.clear();
      for (var i = 0; i < shapes.length; i ++) {    
          rect(shapes[i].cenX, shapes[i].cenY, shapes[i].rectWidth, shapes[i].rectHeight, shapes[i].text);
        }
      }, 100);
  }

  function drag(e) {
    if (dragging = true) {
      x = e.pageX - canvas.offsetLeft;
      y = e.pageY - canvas.offsetTop;

    }
  }

  var startLineX, startLineY, endLineX, endLineY;
  function onMouseDown(e) {
    startLineX = e.pageX - 10;
    startLineY = e.pageY - 120;
  }

  function onMouseUp(e) {
    endLineX = e.pageX - 10;
    endLineY = e.pageY - 120;
    data = {
      startLineX: startLineX,
      startLineY: startLineY,
      endLineX: endLineX,
      endLineY: endLineY
    }
    socket.emit('lineDrawn', data);

    canvas.onmousemove = null;
  }
  
  function drawLine(startX, startY, endX, endY) {
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.stroke();
    console.log('line drawn')
  }


  init();
  canvas.onmousedown = onMouseDown;
  canvas.onmouseup = onMouseUp;

  var Container = function (obj) {
    this.id = obj.id;
    this.shape = obj.shape;
    this.color = obj.color;
    this.width = obj.width;
    this.height = obj.height;
    this.radius = obj.radius;
    this.text = obj.text;
    this.cenX = obj.cenX;
    this.cenY = obj.cenY;
    this.connectedTo = obj.connectedTo;
    this.startedAt = obj.startedAt;
  };

  //CHAT FUNCTIONALITY

  var userName = prompt('what do people call you')
  var chatLog = {};

  $(document).keydown(function(e) {
    if (e.keyCode === 13) {

          chatText = $('input[name=chatInput]').val();

          if(chatText === '') {
            return false;
          }

          console.log(chatText)
          socket.emit('messagePosted', {
            userName: userName,
            message: chatText
          });
          

      }
  })
  

})

 