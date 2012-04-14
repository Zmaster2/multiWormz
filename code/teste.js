var groupS = require('./group');
var pzS = require('./pz');
var baseS = require('./base');

function game(){
	this.start= function (s){
		this.socket=s;
	
		this.started=false;
		this.num=300;
		this.groupArray=new Array();
		this.pzArray=new Array();
		this.cw=800
		this.ch=600;
		this.baseDistance=10;
		this.pixelPerChild=40;
		this.lastCalledTime=0;
		this.numeroBizaro=0;
		this.globalDist=0;
		this.patternArray=new Array();
		this.imagensArray=['bat.png','stn.png','tri.png'];
		this.imagensInd=0;
		
		this.patternArray.push(null)
		this.creatPz();
		this.update(this);
	}
	this.begin= function (){
		this.started=true;
		this.ani(this);
	}
	this.creatPz = function (){
		for(var i=0;i<this.num;i++){
			/*****************************************************= Creat a unity  */
			var pzObject=new pzS.pz(i,Math.random()*this.cw,Math.random()*this.ch);
			this.pzArray.push(pzObject);
			/*****************************************************= Create a Group and set the unity as the leader */
			var groupObject=new groupS.group(pzObject,i);		
			this.groupArray.push(groupObject);	
			pzObject.group=groupObject;
			//////////////////////////////////////////
			if(i==0){
				/*pzObject.player=true;
				pzObject.x=0;
				pzObject.y=0;
				pzObject.maxLife=50;
				pzObject.life=50;
				pzObject.damage=1;
				pzObject.attackSpeed=5;*/
				//groupObject.patternChozen=imagensArray[1];
			}else if(i>0){
			//	pzObject.setGroup(groupArray[1])
			}
		}			
	}
	this.update = function (obj){
		obj.socket.emit('message', obj.r_pzA());
		setTimeout(obj.update,50,obj);
		//console.log("ee");		
	}
	this.ani = function (obj){
		if(obj.started){
			obj.numeroBizaro++
			if(obj.numeroBizaro>3)
				obj.numeroBizaro=0;
				
			for(var i=0;i<obj.num;i++){
				obj.groupArray[i].update();
			}
			for(var i=0;i<obj.num;i++){
				obj.pzArray[i].go(i);
			}
		}
		//obj.socket.emit('message', obj.r_pzA());
		setTimeout(obj.ani,20,obj);
		//console.log("ee");		
	}
	
	this.r_pzA = function(){
		var visualPz=new Array();
		for(var i=0;i<this.pzArray.length;i++){
			var v=new Object();
			v.x=this.pzArray[i].x;
			v.y=this.pzArray[i].y;
			v.color=this.pzArray[i].color;
			v.isPlayer=(this.pzArray[i].player!=null);
			visualPz.push(v);
		}
		return visualPz;
	}
}

module.exports=new game();