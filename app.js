
var express     = require('express'),
    path        = require('path'),
    fs          = require('fs'),
    tictactoe     = require('./client/js/tictactoe.js').game();

var app = express()
    , http = require('http')
    , server = http.createServer(app)
    , io = require('socket.io').listen(server);

server.listen(8989);

app.configure(function(){
    app.set('env', 'development');
    app.set('port', process.env.PORT || 8989);
    app.set('views', __dirname + '/views');

    app.use(express.static(path.join(__dirname, './client/html')));
});

io.sockets.on('connection', function (socket) {

    socket.on('newPlayer', function (data) {

        var playerName = data;

        if(tictactoe.players.length > 1) {

            socket.emit('drop', {
                'reason' : 'too many players'
            });

        } else if(tictactoe.players.length === 1) {

            tictactoe.players.push(playerName);

            socket.emit('ready', {
                'opponent' : tictactoe.players[0], 'code' : '1'
            });

            /*
             * find the other socket and send play on that as well
             */
            tictactoe.waitingSocket.emit('makeMove', {
                'opponent' : tictactoe.players[1], 'code' : '0'
            });

            tictactoe.toggleSockets(socket);

        } else {
            //#numPlayers == 1
            tictactoe.players.push(playerName);

            socket.emit('wait', {
                'reason' : 'no other player'
            });

            tictactoe.waitingSocket = socket;
        }
    });

    socket.on('mark', function(data) {

        var index = data.index;

        var code = data.code;

        if(tictactoe.isValidMove(index, code)) {

            tictactoe.waitingSocket.emit('update', {
                'code': code, 'index': index
            });

            socket.emit('update', {
                'code': code, 'index': index
            });

            tictactoe.matrix[index-1] = code === '0' ? 0 : 1;

            if(tictactoe.isMatchWon()) {

                tictactoe.waitingSocket.emit('youLose');

                socket.emit('youWin');

            } else if (tictactoe.isMatchOver()) {

                socket.emit('matchOver');

                tictactoe.waitingSocket.emit('matchOver');

            } else {

                socket.emit('readyContinue');

                tictactoe.waitingSocket.emit('makeMoveContinue');

                tictactoe.toggleSockets(socket);
            }
        } else {

            socket.emit('invalidMove');

            socket.emit('makeMoveContinue');

            tictactoe.waitingSocket.emit('readyContinue');
        }
    });
});



