var groupS = require('./group');
var pzS = require('./pz');
var game = null//require('./teste');
function setGame(g){
	game=g;	
}
function getEni(n,master,minDistance,prevTarget){
	var prim=game.pzArray[n];
	var minDist=999999;
	var minPz=null;
	if(prevTarget!=null){
		if(prevTarget.group!=prim.group){	
			minDist=distPz(prim.x,prim.y,prevTarget.x,prevTarget.y);
			minPz=prevTarget
		}
	}
	globalDist=999999;
	for(var i=game.numeroBizaro;i<game.num;i+=3){
		var test=game.pzArray[i];			
		if(master)
			test=game.pzArray[i].group.leader
		if(test.group!=prim.group){				
			var hip=distPz(prim.x,prim.y,test.x,test.y);
			if(hip<minDistance){
				if(hip<minDist){
					minPz=test;
					minDist=hip;
				}
			}
		}
	}
	/*if(n==3 && !master)
		var x=kkkkk;/**/
	globalDist=minDist;
	return minPz;/**/
	return game.pzArray[0];
		
}
function distPz(pzAx,pzAy,pzBx,pzBy){
	return hip=Math.sqrt( Math.pow(pzAx-pzBx,2)+Math.pow(pzAy-pzBy,2));
}
function angTo(ox,oy,tx,ty){
	var dx = tx - ox;
	var dy = ty - oy;
	var distance = Math.sqrt ( dx * dx + dy * dy );
	var angle = Math.acos ( dy / distance );
	angle=(angle*180)/Math.PI
	if(dx<0){
		angle=360-angle
	}
	return angle;
}
function rotateTo(oAng,tAng,speed){
	var fAng=oAng
	if(tAng-oAng>180){
		tAng-=360
	}else if(tAng-oAng<-180){
		tAng+=360
	}
	if(Math.abs(oAng-tAng)>speed){	
		if(tAng<oAng){
			fAng-=speed
		}else{
			fAng+=speed
		}
	}else{
		return tAng;
	}
	return fAng;
}
function inBorder(px,py){
	opx=px;
	opy=py;
	if(px<0)opx=0;
	if(px>game.cw)opx=game.cw;
	if(py<0)opy=0;
	if(py>game.ch)opy=game.ch;
	if(px!=opx || py!=opy)
		return [opx,opy];
	else
		return "ok";
}
function calcNewPos(prim,group){
	var maxDistance=Math.sqrt(Math.pow(game.baseDistance,2)+((game.pixelPerChild*group.size)/Math.PI));  //game.pzArray[n].childs*1+15
	if((Math.random()<0.05) || (group.pattern!=prim.posPattern)){
		//if(group.pattern==null){
			var ang=Math.random()*2*Math.PI;
			var newDist=Math.random()*maxDistance;
			prim.posX=Math.cos(ang)*newDist;
			prim.posY=Math.sin(ang)*newDist;
			
		/*}else if(group.pattern!=prim.posPattern || ( Math.floor(new Date().getTime()/500)%10==1 )){
			var baseDist=Math.sqrt((iw*ih)/group.size);
			var nw=iw/baseDist
			var nh=ih/baseDist
			var px=Math.floor((group.nPos%nw)*baseDist)
			var py=Math.floor(Math.floor(group.nPos/nw)*baseDist)
			while(group.pattern[px][py]>100){			
				px=Math.floor(Math.random()*group.pattern.length);
				py=Math.floor(Math.random()*group.pattern[0].length);
			}
			prim.posX=(px-group.pattern.length/2)/iw*maxDistance*2.2;
			prim.posY=(py-group.pattern[0].length/2)/ih*maxDistance*2.2;
		}*/
		//prim.posPattern=group.pattern;
	}
	group.nPos++;
}
function batman(){
	groupArray[0].pattern=patternArray[1];
}
exports.getEni=getEni;
exports.distPz=distPz;
exports.angTo=angTo;
exports.rotateTo=rotateTo;
exports.inBorder=inBorder;
exports.calcNewPos=calcNewPos;
exports.setGame=setGame;