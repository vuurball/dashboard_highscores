var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var r = require("rethinkdb");

app.get('/', function(req, res){
	res.sendFile(__dirname + '/chat.html');
});

io.on('connection', function(socket){

    io.emit('chat message', 'OLGAAAAAAAAAAAAAAAAA');


r.connect().then(function(conn){
                return r.db('test').table('players').orderBy({index: r.desc('score')}).limit(5).changes().run(conn);
        })
        .then(function(cursor){
                cursor.each(function(err, item){
 io.emit('chat message', item);
                        console.log(item);
                });
        });


	console.log('a user connected');
//	socket.on('chat message', function(msg){
//		io.emit('chat message', msg);
//	  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
