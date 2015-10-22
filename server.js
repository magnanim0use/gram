var express = require('express');
var bodyParser = require('body-parser');

var app = express();

var server = require('http').createServer(app);

var io = require('socket.io')(server);

var port = process.env.PORT || 4200;

app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));

app.chatLog = {};

app.get('/api/chats', function(req, res, next) {
  console.log('GET request received by server');
  res.send(201, app.chatLog);
  // console.log(app.chatLog);
})

app.post('/api/chats', function(req, res, next) {
  console.log('post: req.body.username:', req.body.username, 'req.body.messages:', req.body.messages)
  app.chatLog[req.body.username] = req.body.messages;
  res.send();
})

app.post
//set up the socket.io event listeners
io.on('connection', function(socket) {
  console.log('Client connected ...')

  socket.on('createdObj', function(data) {
    io.emit('createObj', data);
  })

  socket.on('lineDrawn', function(data) {
    console.log('server listed to connected, sending back:', data);
    io.emit('drawLine', data);
  })

  socket.on('messagePosted', function(data) {
    io.emit('updateMessages', data)
  })

});

server.listen(port);

console.log('Listening at:', port);

module.export = app;