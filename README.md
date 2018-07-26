	这是一个依赖jquery的模板库，之前MyFirstGitRepository是第一个版本，这个新版本更注重模板的使用
这个模板库采用了mvc的方式，本人对mvvm方式不是很喜欢，不喜欢将页面和js都放在一起写，
那样比较乱，现在每个页面相当于是一个component，和react、vue的区别在于每一个component会配置一个controller,
同时还会有method层、service层,将页面统一配置到router路由器里面，模板层就是hmd.js。
	模板库里面的模板方法主要有三个，第一个就是generateStringByTemplate，具体使用可以到method方法中看，
第二个就是handleTemplate，这个是将模板中的js代码转化成页面，第三个也就是重点介绍的就是讲页面作为模板，
通过对模板的操作来改变页面
hmd.component({
	//temp: '_footer',
	id: 'root',
	tag : function(){
		var _arr = ['<h-footer name="10" age=25 />','<h-head/>'];
		return _arr.join('');
	}()
})

这是一个具体调用模板方法，temp为模板的id，如果temp存在，就会根据id调用模板，如果temp不存在，则根据tag来
操作模板