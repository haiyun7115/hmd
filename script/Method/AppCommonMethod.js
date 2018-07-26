hmd.extend(hmd.methods,{
	/*
	 * @description 根据模板和参数生成html串
	 * @params obj {id:id,params : {'%s':'id','%t':'name'},data:[{id:'aaa',name:'bbb'},{id:'ccc',name:'ddd'}]}id表示模板的id,
	 * @如果没有id则取temp	 
	 * params表示模板里面的参数 eg:%s可以取到数组每一项里面的key
	 * data表示数据
	 */
	generateStringByTemplate : function(obj){
		var id = obj.id || '',
			params = obj.params,
			data = obj.data,
			$script = id !== '' ? $('#'+id) : null,
			txt = !$script ? obj.temp : ($script.text()||$script[0].innerHTML),
			param_arr = [],
			param_str = '',
			reg = null,
			_arr = [];
		for(var index in params){
			param_arr.push(index);
		}
		
		param_str = param_arr.join('|');
		reg = new RegExp(param_str,'g');
		$(data).each(function(index,element){
			_arr.push(txt.replace(reg,function(a,b){
				return element[params[a]];
			}));
		});
		return _arr.join('');
			
	},
	/*
	 * @description 把location的search转换成对象
	 * @param s 表示search
	 */
	changeLocationSearchToObject : function(s,p){
		p = p || '&'
		var arr = s.split(p),
			obj = {};
		$(arr).each(function(index,element){
			var el = element.split('='),
				_key = el[0],
				_value = el[1];
			obj[_key] = _value;
		});
		return obj;
	},	
	/*
	 * @description 将模板转化成页面串
	*/
	manageTemplate : function(obj){
		obj = obj || {};
		var data = obj.data,
			config = obj.config;
		var reg = /<template>([\w\W]+)<\/template>/;
		var res = data.replace(reg,'%template');
		var resArr = data.match(reg)
		var _tem = this.handleTemplate({
			temp : resArr[1],
			config : config
		}).join('');
		return res.replace(/%template/,_tem);
	},
	/*
	 * @description 对模板里面的代码进行处理，返回页面串
	*/
	handleTemplate : function(obj){
		obj = obj || {};
		var id = obj.id || '__temp_html',
			config = obj.config || {};
		var __temp = $('#'+id),
			_txt = obj.temp ? obj.temp : __temp.text(),
			_str_l = _txt.substring(0,_txt.indexOf('{')),
			_str_r = _txt.substring(_txt.lastIndexOf('}')+1),
			_str_c = _txt.substring(_txt.indexOf('{')+1,_txt.lastIndexOf('}'));
		var func = new Function(_str_c);
		var res = func.call(config)
		res.unshift(_str_l);
		res.push(_str_r)
		return res;
	},
	/*
	 * @description 委托代理
	 * @params obj 里面的参数包括：type(代表事件类型，默认为click)
	 * $obj 代表页面元素，jquery对象
	 * callback 代表函数
	 */
	delegate : function(obj){
		var type = obj && obj.type ? obj.type : 'click',
			$obj = obj.$obj,
			callback = obj.callback;
		$obj.bind(type,function(e){
			callback.call(this,e);
		})
		
	},
	loadUrl : function(key){
		var _name = key || '',
			router = hmd.router;

		return router[_name];

	},
	/*
	 * @description 切换页签
	 * @param obj id为tab页的id,callback为用户传入的回调方法
	*/
	switchTap : function(obj){
		obj = obj || {};
		var id = obj.id || 'myTab',
			callback = obj.callback || function(){},
			$tab = $('#'+id+' a').click(function(e){
				e.preventDefault();
				callback.call(this)
			})
	},
	/*
	 * @description 加载页面
	 * @param obj key为首次加载的数据源中的key，source为数据源即切换页签的列表，如果没有切换
	 * 此source不用传
	*/
	getUrl : function(obj){
		obj = obj || {};
		var key = obj.key || '',
			id = obj.id || 'content',
			$obj = $('#'+id),
			source = obj.source || {},
			url = source[key],
			callback = obj.callback || function(){},
			tab = obj.tab || true,
			self = this;
		$obj.load(url);

		if(tab){
			this.switchTap({
				callback : function(){
					$obj.load(source[this.name])					
				}
			})
		}
	},
	/*
	 * @description 时间选择器
	 * @param obj 里面有start和end两个key，value表示id，如果有两个时间框并且关联，
	 * 就将start和end都传进去，如果是一个时间框就传一个start就可以
	 * @attr 时间框的属性datepicker需要填写,datepicker有两个值(datepicker,datetimepicker)
	 * datepicker显示到天，datetimepicker显示到秒 
	 * @attr validate validate='bootstrap'，如果设置此值表示要和bootstrapValidate结合
	 * 解决readonly文本框不能验证的问题
	 * @eg:<input type="text" id="start" datepicker='datepicker' readonly />

	*/
	timePicker : function(obj){		
		var self = this;
		var start = $('#'+obj.start),
			end = $('#'+obj.end),
			datepicker = start.attr('datepicker'),
			flag = datepicker === 'datepicker' ? false : true,
			startValidate = start.attr('validate'),
			endValidate = end.attr('validate'),
			status = {
				datepicker : 'datepicker',
				datetimepicker : 'datetimepicker'
			};					

		start[status[datepicker]]({ 
			showSecond: flag,
			showMinute : flag,
			showHour : flag,
			dateFormat: 'yy-mm-dd',
            timeFormat: flag ? 'hh:mm:ss' : '',
			onClose: function(dateText, inst) {
				if (end.val() != '') {
					var testStartDate = start.datetimepicker('getDate');
					var testEndDate = end.datetimepicker('getDate');
					if (testStartDate > testEndDate)
						end.datetimepicker('setDate', testStartDate);
				}
				else {
					//end.val(dateText);
				}
			},
			onSelect: function (selectedDateTime){
				var $parent;
				end.datetimepicker('option', 'minDate', start.datetimepicker('getDate') );
				if(startValidate && startValidate === 'bootstrap'){
					$parent = $(this).closest('div');
					if($parent.find('i').hasClass('glyphicon-remove')){
						$parent.find('i').removeClass('glyphicon-remove').addClass('glyphicon-ok')
						$parent.find('small').hide()
						if(!end[0]){
							$parent.parent().removeClass('has-error').addClass('has-success');
						}
					}
				}
			}
		});
		end[status[datepicker]]({ 
			showSecond: flag,
			showMinute : flag,
			showHour : flag,
			dateFormat: 'yy-mm-dd',
			timeFormat: flag ? 'hh:mm:ss' : '',
		            
			onClose: function(dateText, inst) {
				if (start.val() != '') {
					var testStartDate = start.datetimepicker('getDate');
					var testEndDate = end.datetimepicker('getDate');
					if (testStartDate > testEndDate)
						start.datetimepicker('setDate', testEndDate);
				}
				else {
					//start.val(dateText);
				}
			},
			onSelect: function (selectedDateTime){//has-error has-success
				var $parent;
				start.datetimepicker('option', 'maxDate', end.datetimepicker('getDate') );
				if(startValidate && startValidate === 'bootstrap'){
					$parent = $(this).closest('div');
					if($parent.find('i').hasClass('glyphicon-remove')){
						$parent.find('i').removeClass('glyphicon-remove').addClass('glyphicon-ok')
						$parent.find('small').hide();
						$parent.parent().removeClass('has-error').addClass('has-success');
					}
				}
			}
		});
	},
	/*
	 * @description 分页
	 * @param obj obj.id 为分页的id，如果不传，默认为pagination
	 * obj.totalPages总页数，如果不传为0
	 * obj.visiblePages显示多少页
	 * obj.currentPage当前第几页
	 * obj.callback 回调函数
	*/
	pagination : function(obj){
		obj = obj || {};
		var id = obj.id || 'pagination',
			totalPages = obj.totalPages || 0,
			visiblePages = obj.visiblePages || 10,
			currentPage = obj.currentPage || 1,
			callback = obj.callback || function(){};
        /*if($('#'+id)[0]){
            $('#'+id).jqPaginator('destroy');
		}*/
		$.jqPaginator('#'+id, {
            totalCounts: totalPages,
            pageSize: visiblePages,
	        currentPage: currentPage,
	        first:'<li class="first"><a href="javascript:;">首页</a></li>',
	        prev: '<li class="prev"><a href="javascript:;">上一页</a></li>',
	        next: '<li class="next"><a href="javascript:;">下一页</a></li>',
	        last: '<li class="last"><a href="javascript:;">尾页</a></li>',
	        page: '<li class="page"><a href="javascript:;">{{page}}</a></li>',
	        onPageChange: function (num, type) {
	        	callback.call(this,num,type)	            
	        }
	    });
	},
	/*
	 * @description 给文本框添加keyup事件
	*/
	addKeyUpToInput : function(){
		var eventObj = {
			float : function(){
				this.value = this.value.replace(/[^\d\.]/g,'')
			},
			integer : function(){
				this.value = this.value.replace(/[^\d]/g,'')
			}
		};
		$(document.body).keyup(function(e){
			var target = e.target;
			if(target.nodeName === 'INPUT'){
				if(target.type === 'text'){
					if($(target).attr('reg')){
						eventObj[$(target).attr('reg')].call(target)
					}
				}
			}
		})
	}
    /*
     * @description 发送验证码倒计时
    */


});