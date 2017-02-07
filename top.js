var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var r = require("rethinkdb");

app.use(express.static(__dirname + '/images'));

app.get('/', function(req, res){
	res.sendFile(__dirname + '/top.html');
});

var query = r.db('test').table('players').orderBy({index: r.desc('score')}).limit(5);

//on updated
r.connect().then(function(conn){
    return query.changes().run(conn);
}).then(function(cursor){
    cursor.each(function(err, item){
        io.emit('chat message', item);
    });
});

io.on('connection', function(socket){
    r.connect().then(function(conn) {
        return query.run(conn).finally(function() { conn.close(); });
    }).then(function(cursor) {
        return cursor.toArray();
    }).then(function(output) {     
	    io.emit('leaders', output);
    }).error(function(err) {
       console.log("Failed:", err);
    });
});

http.listen(3000, function(){
    console.log('listening on *:3000');
});
