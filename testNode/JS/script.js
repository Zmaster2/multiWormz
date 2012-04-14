var canvas,ctx,img,imgD,imgR,resulti,ih,iw;
var mouseX=0,mouseY=0;
var m_canvas = document.createElement('canvas');
var ServerId="none"
var socket;
var firstconnect = true;
var oldPlayers=null;
var mouseDown=false;
var gameStarted=false;

window.onload = function(){
	iw=400
	ih=300
	canvas = document.getElementById("canvas");
	cw=canvas.width
	ch=canvas.height
	ctx = canvas.getContext("2d");
	m_canvas.width = iw;
	m_canvas.height = ih;
	m_ctx = m_canvas.getContext("2d");	
	ctx.lineCap = 'round'
}
document.onmousemove = function(e){
	if(mouseDown){
		mouseX=e.pageX
		mouseY=e.pageY
	}
};
function atualiza(){
	sendMouse();	
	setTimeout(atualiza,50);
}
function click(){
	mouseDown=true;
}
function solta(){
	mouseDown=false;
}	
function des(players){
	ctx.fillStyle = "rgba(255,255,255,0.2)"; 
	ctx.fillRect(0,0,cw,ch);
	for(var i=0;i<players.length;i++){
		ctx.fillStyle = players[i].color; 
		ctx.strokeStyle = players[i].color; 
		 
		if(oldPlayers==null || gameStarted==false){
			if(players[i].isPlayer)
				ctx.fillRect(Math.floor(parseFloat(players[i].x)),Math.floor(parseFloat(players[i].y)),6,6);
			else
				ctx.fillRect(Math.floor(parseFloat(players[i].x)),Math.floor(parseFloat(players[i].y)),3,3);
		}else{
			if(players[i].isPlayer)
				ctx.lineWidth = 5
			else
				ctx.lineWidth = 3
			ctx.beginPath(); 
			ctx.moveTo(Math.floor(parseFloat(oldPlayers[i].x)),Math.floor(parseFloat(oldPlayers[i].y)));
			ctx.lineTo(Math.floor(parseFloat(players[i].x)),Math.floor(parseFloat(players[i].y)));
			ctx.stroke();
			//ctx.fillRect(,3,3);
		}
	}
	oldPlayers=players;
	//setTimeout(sendMouse(),10);
}
function connect() {
  if(firstconnect) {
	socket = io.connect("localhost");
	  
	socket.on('message', function(data){ message(data); });
	socket.on('begin', function(data){ gameStarted=true; });
	socket.on('connect', function(){ status_update("Connected to Server"); });
	socket.on('disconnect', function(){ status_update("Disconnected from Server"); gameStarted=false;}); 
	socket.on('message', function(data){ message(data); });
	socket.on('reconnect', function(){ status_update("Reconnected to Server"); /*gameStarted=false;/**/});
	socket.on('reconnecting', function( nextRetry ){ status_update("Reconnecting in " 
	  + nextRetry + " seconds"); });
	socket.on('reconnect_failed', function(){ message("Reconnect Failed"); });
	  
	firstconnect = false;
  } else {
	socket.socket.reconnect();
  }
  alert("conected")
	atualiza();	
}
function sendMouse(){
	socket.send(mouseX+"||"+mouseY);    
}	
function disconnect() {
  socket.disconnect();
}	
function message(data) {
	des(data);
}	
function status_update(txt){
	serverStatus.innerText= txt;
}  
function esc(msg){
  return msg.replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
function begin(){
	socket.send("begin");    
}

setTimeout(connect,1000);
