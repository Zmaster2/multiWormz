var pzS = require('./pz');
var baseS = require('./base');

function group(owner,n){
	this.leader=owner;
	this.num=n;
	this.size=1;
	this.color=owner.color;
	this.nPos=0;
	this.pattern=null;
	this.patternChozen=null;
	this.canChose=true;
	this.ang=0;
	/*this.div=document.createElement('DIV');
	this.div.style.borderLeft='10px solid '+this.color;
	this.div.style.lineHeight='15px';
	this.div.style.float='left';
	this.div.style.margin='3px 0px';
	this.div.style.width='30px';
	document.getElementById("side").appendChild(this.div);*/
}

group.prototype.update=function(n){
	/*if(this.size>0){
		this.div.style.display="block"
		this.div.innerText=this.size
	}else{
		this.div.style.display="none"
	}*/
	this.nPos=0;
	this.ang=baseS.rotateTo(this.ang,this.leader.ang,3);
}
exports.group=group;