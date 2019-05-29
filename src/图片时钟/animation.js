// 封装我们的框架
function animation(dom, targetJson, time, callback) {
	var startJson = {}
	var speedJson = {}

	for (var key in targetJson) {
		// 获取起点值
		startJson[key] = getStyle(dom, key);

		// 计算速度
		speedJson[key] = (targetJson[key] - startJson[key]) / (time * 1000);
	}


	// 获取初始时间
	var startTime = new Date();

	// 设置定时器
	var timer = setInterval(function () {
		// 获取时间差
		var _time = new Date() - startTime;
		// // console.log(_time)
		for (var key in targetJson) {
			if (key !== 'opacity') {
				dom.style[key] = startJson[key] + _time * speedJson[key] + 'px';
			} else {
				dom.style[key] = startJson[key] + _time * speedJson[key];
			}

			// 判断收尾
			if (_time >= time * 1000) {
				if (key !== 'opacity') {
					dom.style[key] = targetJson[key] + 'px';
				} else {
					dom.style[key] = targetJson[key];
				}
			}
		}

		if (_time >= time * 1000) {
			clearInterval(timer);
			callback && callback.call(dom, startJson, time)
		}


	}, 20)

}

// 封装的兼容函数
function getStyle(dom, attr) {
	return dom.currentStyle ? parseFloat(dom.currentStyle[attr]) : parseFloat(getComputedStyle(dom)[attr]);
}