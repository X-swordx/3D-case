//时间版运动框架
function animation(dom,jsonTarget,time,cb){
	var jsonStart = {};
	var jsonSpeed = {};
	for(var key in jsonTarget){
		jsonStart[key] = getStyle(dom,key);
		jsonSpeed[key] = (jsonTarget[key] - jsonStart[key])/(time*1000);
	}
	var fn = arguments.callee;

	var startTime = new Date();

	var timer = setInterval(function(){
		var _time = new Date() - startTime;
		
		for(var key in jsonTarget){
			if(key==='opacity'){
				dom.style[key] = jsonStart[key] + jsonSpeed[key] * _time;
			}else{
				dom.style[key] = jsonStart[key] + jsonSpeed[key] * _time+'px';
			}

			if(jsonSpeed[key]>=0){
				if( getStyle(dom,key) >= jsonTarget[key] ){
					if(key==='opacity'){
						dom.style[key] = jsonTarget[key];
					}else{
						dom.style[key] = jsonTarget[key] +'px';
					}
				}
			}else{
				if( getStyle(dom,key) <= jsonTarget[key] ){
					if(key==='opacity'){
						dom.style[key] = jsonTarget[key];
					}else{
						dom.style[key] = jsonTarget[key] +'px';
					}
				}
			}
		}
		if(_time/1000>=time){
			cb&&cb.call(dom,fn,jsonStart,time);
			clearInterval(timer);
		}
	},20);


	function getStyle(dom,attr){
		if(dom.currentStyle){
			return parseFloat(dom.currentStyle[attr]);
		}else{
			return parseFloat(getComputedStyle(dom,null)[attr]);
		}
	}
}



