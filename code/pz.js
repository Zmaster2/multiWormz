var groupS = require('./group');
var baseS = require('./base');
var players=null;
function setPlayers(p){
	players=p;	
}
function pz(n,xx,yy){
	this.anumb=n;
	this.x=xx;
	this.y=yy;
	this.lx=xx;
	this.ly=yy;
	this.ang=0;
	this.vel=1//1;
	this.rotationVel=15//10;
	this.damage=1;
	this.life=15;
	this.maxLife=15;
	this.regen=1;
	this.group=null;
	this.player=null;
	this.random=5;
	this.angVel=0;
	this.wave=0;
	this.waveAmp=3.5+Math.random()*3;
	this.atks=0;
	this.timer=0;
	this.attackSpeed=15;
	var r=(Math.floor(Math.random()*150)+100);
	var g=(Math.floor(Math.random()*150)+100);
	var b=(Math.floor(Math.random()*150)+100);
	if(n==0){
		r=g=b=0;
	}
	this.color="rgb("+r+","+g+","+b+")";
	this.posPattern="lol";
	this.target=null;
	this.targetDist;
	this.grouptarget=null;
}
pz.prototype.go=function(n){
	if(this.timer<0){
		this.timer=100;
		this.life+=this.regen;
	}
	if(this.life>this.maxLife)this.life=this.maxLife
	if(this.player!=null){
		this.timer--;
		this.attackSpeed=12;
		this.damage=1.2;
	}
	this.atks--;
	this.timer--;
	var speedMult=1.0;
	if(Math.abs(this.wave)>25 )
		this.waveAmp*=-1;
	this.wave+=this.waveAmp;	
	var tempVel=this.vel;
	var nextEni=baseS.getEni(n,false,10,this.target);//Search a enemy nearby	
	this.target=nextEni;
	this.targetDist=globalDist;
	
	if(this.atks<0){
		if(this.targetDist<3){
			this.target.life-=this.damage;
			this.atks=this.attackSpeed*(1+(Math.random()*0.3));
			/*ctx.fillStyle = "rgb(200,0,0)";
			ctx.fillRect(this.target.x-2,this.target.y-2,7,7);	*/
			if(this.target.life<0){
				this.target.setGroup(this.group);
				this.target=null;
			}
			this.ang=Math.random()*360;
		}
	}
	if(this.target!=null && this.group.pattern==null){
		var tAng=baseS.angTo(this.x,this.y,this.target.x,this.target.y)
	}else{
		if(this.group.leader!=this){
			speedMult=1.5;
			/*this.posX+=(Math.random()-0.5)*this.random*2;
			this.posY+=(Math.random()-0.5)*this.random*2;
			var hip=Math.sqrt(Math.pow(this.posX,2)+Math.pow(this.posY,2));
			var maxDistance=Math.sqrt(Math.pow(baseDistance,2)+((pixelPerChild*this.group.size)/Math.PI));
			if(hip>maxDistance){*/
				baseS.calcNewPos(this,this.group);
			//}
			var pCos=Math.cos((this.group.ang+90)*Math.PI/180);
			var pSin=Math.sin((this.group.ang+90)*Math.PI/180);
			var nposY=(this.posX*pCos)-(this.posY*pSin)
			var nposX=(this.posX*pSin)+(this.posY*pCos)
			var tAng=baseS.angTo(this.x,this.y,this.group.leader.x+nposX,this.group.leader.y+nposY,this.posY)
			if(this.group.pattern!=null){
				tempVel=baseS.distPz(this.x,this.y,this.group.leader.x+nposX,this.group.leader.y+nposY)*0.05;
				if(tempVel>this.vel*2)tempVel=this.vel*2
			}
		}else{
			if(this.player!=null){				
				var tAng=baseS.angTo(this.x,this.y,this.player.x,this.player.y)
			}else{
				var nextEni=baseS.getEni(n,true,10000,this.grouptarget);
				this.grouptarget=nextEni;
				if(this.grouptarget!=null){
					//selecionar um novo pattern
					/*if(globalDist>(this.group.size*0.0+5)){
						if(this.group.patternChozen==null){
							if((this.group.canChose)&&(this.group.size>35)){
								this.group.patternChozen=patternArray[Math.floor(Math.random()*(patternArray.length-1))+1];
								this.group.canChose=false;
							}
						}else{
							this.group.pattern=this.group.patternChozen;
						}
					}else{
						this.group.canChose=true;
						this.group.pattern=null;
					}*/
					var tAng=baseS.angTo(this.x,this.y,this.grouptarget.x,this.grouptarget.y)
				}
			}
		}
	}
	tempVel*=speedMult;
	this.ang=baseS.rotateTo(this.ang,tAng,this.rotationVel);/**/
	/*this.angVel+=(Math.random()-0.5)*this.random*1;
	this.ang+=this.angVel;
	this.angVel*=0.9;/**/
	
	this.lx=this.x;
	this.ly=this.y;
	this.y+=Math.cos((this.ang+this.wave)*Math.PI/180)*tempVel;//this.vel*speedMult;
	this.x+=Math.sin((this.ang+this.wave)*Math.PI/180)*tempVel;//this.vel*speedMult;
	if(baseS.inBorder(this.x,this.y)!="ok"){
		this.ang=Math.random()*360;
		this.x=this.lx
		this.y=this.ly
	}
}
pz.prototype.setGroup=function(newGroup){
	console.log(" kill ");
	owner=newGroup.leader;
	this.group.size--;
	newGroup.size++;
	this.group=newGroup;
	this.life=this.maxLife/2;
	owner.life+=this.maxLife/2;
	baseS.calcNewPos(this,newGroup);	
	var mcor=this.color.substring(4).slice(0, -1).split(",");
	var ocor=newGroup.color.substring(4).slice(0, -1).split(",");
	var r=Math.floor((parseFloat(mcor[0])+parseFloat(ocor[0])*2)/3);
	var g=Math.floor((parseFloat(mcor[1])+parseFloat(ocor[1])*2)/3);
	var b=Math.floor((parseFloat(mcor[2])+parseFloat(ocor[2])*2)/3);
	this.color="rgb("+r+","+g+","+b+")";
	this.posPattern="lol";
}
pz.prototype.setPlayer=function(p){
	this.player=p;
}
exports.pz=pz;
exports.setPlayers=setPlayers;