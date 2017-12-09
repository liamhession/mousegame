var WebSocketServer = require(__dirname + '/ws/index').Server,
    server = new WebSocketServer({port: 8080});

server.broadcast = function(data) {
    for (var i in this.clients) {
        this.clients[i].send(data);
    }
}

var print = function(output) {
    console.log(output);
}

var decodeMessage = function(message) {
    try {
    return JSON.parse(message);
    } catch(err) {
      return; 
    }
}

var encodeMessage = function(message) {
    return JSON.stringify(message);
}


var currentId = 0;

server.on('connection', function(user) {
    user.id = currentId++;
    print('new user, id: ' + user.id);
    user.send(encodeMessage({'id': user.id, 'action': 'setup'}));

    user.on('message', broadcastMessage );

    user.on('close', function() { 
            broadcastMessage(encodeMessage({'id': user.id, 'action': 'close'})); 
            });
});


var broadcastMessage = function(incomingRequest) {
    var message = decodeMessage(incomingRequest);

    if (message['action'] != 'move') {
        print('broadcasting ' + message['action'] + ' request on user ' + message['id']);
    }

    server.broadcast(encodeMessage(message));
}

