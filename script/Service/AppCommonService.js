hmd.extend(hmd.service,{
    /*port:"http://10.167.160.117:8080",*/
    port:"http://10.167.200.153:8802",
	getData : function(callback){
		hmd.send({
			url : './../script/Json/data.json',
			dataType : 'json'
		},callback)
	},
	/*发送验证码接口*/
    checkForm:function (callback) {
		var obj = {
			url:this.port+"/repayment/security_code",
			type:"POST",
			data:{
                idNumber:$.trim($("#idCard").val()),
                phoneNumber:$.trim($("#tel_num").val())
			},
			dataType:"json"
		};
		hmd.send(obj,callback);
    },
	/*登录接口*/
	login:function (callback) {
		var obj = {
			url:this.port+"/repayment/login",
			type:"POST",
			data:{
                idNumber:$.trim($("#idCard").val()),
                phoneNumber:$.trim($("#tel_num").val()),
                securityCode:$.trim($("#check_num").val())
			},
			dataType:"json"
		};
		hmd.send(obj,callback);
    },
	/*合同信息页面接口*/
    contract:function (callback) {
		var obj = {
			url:this.port+"/repayment/contract",
			type:"POST",
			data:{
				token:$.cookie("data_token")
			},
			dataType:"json"
		};
		hmd.send(obj,callback);
    },
	/*合同信息操作充值-获取跳转URL*/
    generateUrl:function (callback) {
		var obj = {
			url:this.port+"/repayment/generate_url",
			type:"POST",
			data:{
				token:$.cookie("data_token"),
                contractCode:$(".recharge").attr("contractCode")
			},
			dataType:"json"
		};
		hmd.send(obj,callback);
    },
    /*充值明细页面接口*/
    payDetail:function (_data,callback) {
		var obj = {
			url:this.port+"/repayment/pay_detail",
			type:"POST",
			data:_data,
			dataType:"json"
		};
		hmd.send(obj,callback);
    },
	/*注销接口*/
    logout:function (callback) {
		var obj = {
			url:this.port+"/repayment/logout",
			type:"POST",
			data:{
                token:$.cookie("data_token")
			},
			dataType:"json"
		};
		hmd.send(obj,callback);
    },
	/*验证是否已经登录的接口*/
	hasLogin:function (callback) {
		var obj = {
			url:this.port+"/repayment/has_login",
			type:"POST",
			data:{
                token:$.cookie("data_token")
			},
			dataType:"json"
		};
		hmd.send(obj,callback);
    }
});