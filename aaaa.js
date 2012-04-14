var http = require('http')
, url = require('url')
, fs = require('fs')
, server;

//var game = require('./code/ServerScript');
var game = require('./code/teste');
console.log(game)
var base = require('./code/base');
var pz = require('./code/pz');
base.setGame(game);


var loggedUsers=new Array();
var loggedUsersId=new Array();
function player(socketId,userId){
	this.x=0;
	this.y=0;
	this.socketId=socketId;
	this.userId=userId;	
}

var localPath=process.cwd();
server = http.createServer(function(request, response){
	var pathname=url.parse(request.url).pathname;
	console.log(">>> "+pathname);	
	response.writeHead(200, {"Content-Type": "text/html"});
	fs.readFile(localPath+pathname, function(error, file) {
		if(error) {
			response.write(error + "\n");
			response.end();
		} else { 
			response.write(file);
			response.end();
		}
	});
}).listen(8080);

var io = require('socket.io').listen(server,{ log: false });

io.sockets.on('connection', function(socket){
  console.log("Connection " + socket.id + " accepted.");
  
	var userId=loggedUsers.length;
	var p=new player(socket.id,userId);
	loggedUsers[userId]=p;
	loggedUsersId[socket.id]=p;
	game.pzArray[userId].setPlayer(p);
	//socket.emit('message', { hello: 'world' });
	socket.on('message', function(message){
		if(message=="begin"){
			game.begin()
			io.sockets.emit('begin', 'ha');
		}else{
			if(game.started){
				loggedUsersId[socket.id].x = message.split("||")[0];
				loggedUsersId[socket.id].y = message.split("||")[1];
				//socket.emit('message', game.r_pzA());
			}
		}
				
	});    
	socket.on('disconnect', function(){
		console.log("Connection " + socket.id + " terminated.");		
	});    
});
game.start(io.sockets);
//pz.setPlayers(loggedUsers);